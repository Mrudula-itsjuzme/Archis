export const config = {
  runtime: 'edge',
};

const SYSTEM_PROMPT = `You are an expert architectural drawing interpreter. Analyze this floor plan image carefully and return a structured JSON object.

Return ONLY valid JSON with this exact structure:
{
  "scale_confidence": "high" | "medium" | "low",
  "estimated_scale_note": "string describing how you inferred scale (e.g. 'dimension annotations visible: 5m corridor', 'no scale bar found')",
  "rooms": [
    {
      "id": "unique_id",
      "name": "Room name as written on plan",
      "type": one of ["living","kitchen","bedroom","bathroom","circulation","office","classroom","lab","corridor","courtyard","stair","retail","utility","lobby","outdoor","toilet","storage","hall","reception","conference","parking","mechanical","balcony","terrace"],
      "x": number (meters from left),
      "y": number (meters from top),
      "width": number (meters),
      "height": number (meters),
      "confidence": "high" | "medium" | "low",
      "detection_note": "what evidence supports this detection (label visible, inferred from shape, etc.)"
    }
  ],
  "doors": [
    {
      "id": "unique_id",
      "x": number (center x in meters),
      "y": number (center y in meters),
      "width": 0.9,
      "connects": ["room_id_1", "room_id_2"],
      "confidence": "high" | "medium" | "low"
    }
  ],
  "windows": [
    {
      "id": "unique_id",
      "x": number,
      "y": number,
      "width": number,
      "wall_side": "north" | "south" | "east" | "west" | "unknown",
      "confidence": "high" | "medium" | "low"
    }
  ],
  "building_type": "residential" | "office" | "school" | "hospital" | "commercial" | "mixed" | "unknown",
  "undetected_elements": ["list any visible architectural elements you could not confidently categorize"],
  "overall_confidence": "high" | "medium" | "low",
  "notes": "Any important observations about the plan quality, scale, or unusual features"
}

Rules:
- Use real-world metric dimensions. Guess from context clues: door widths ~0.9m, corridor widths ~1.2-2m, bedroom ~12-20sqm.
- Do NOT invent rooms that are not visible. Mark uncertain detections with confidence "low".
- Place rooms so they reflect the actual spatial layout — adjacency must be approximately correct.
- If scale annotations are visible (e.g. "5m", "10ft"), use them and set scale_confidence "high".
- Output ONLY valid JSON, no markdown fences.`;

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  
  try {
    const { base64Image } = await req.json();
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
    }

    const base64Data = base64Image.split(',')[1];
    const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0];

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            { text: SYSTEM_PROMPT },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        response_mime_type: "application/json"
      }
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Gemini API Error', details: data }), { status: 502 });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return new Response(JSON.stringify({ error: 'No response from Gemini' }), { status: 500 });
    }

    let parsed: any = {};
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      // Try to extract JSON object
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse Gemini JSON response");
      }
    }

    // Normalise: add isLocked, id if missing
    const rooms = (parsed.rooms || []).map((r: any, i: number) => ({
      id: r.id || `room_${i}`,
      name: r.name || `Space ${i + 1}`,
      type: r.type || 'utility',
      x: Number(r.x) || 0,
      y: Number(r.y) || 0,
      width: Number(r.width) || 4,
      height: Number(r.height) || 4,
      isLocked: false,
      confidence: r.confidence || 'medium',
      detection_note: r.detection_note || '',
    }));

    const doors = (parsed.doors || []).map((d: any, i: number) => ({
      id: d.id || `door_${i}`,
      x: Number(d.x) || 0,
      y: Number(d.y) || 0,
      width: Number(d.width) || 0.9,
      connects: d.connects || [],
      confidence: d.confidence || 'medium',
    }));

    const windows = (parsed.windows || []).map((w: any, i: number) => ({
      id: w.id || `window_${i}`,
      x: Number(w.x) || 0,
      y: Number(w.y) || 0,
      width: Number(w.width) || 1.2,
      wall_side: w.wall_side || 'unknown',
      confidence: w.confidence || 'medium',
    }));

    return new Response(JSON.stringify({
      rooms,
      doors,
      windows,
      building_type: parsed.building_type || 'unknown',
      scale_confidence: parsed.scale_confidence || 'low',
      estimated_scale_note: parsed.estimated_scale_note || '',
      overall_confidence: parsed.overall_confidence || 'medium',
      undetected_elements: parsed.undetected_elements || [],
      notes: parsed.notes || '',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
