export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }
  
  try {
    const { rooms } = await req.json();
    if (!Array.isArray(rooms) || rooms.length === 0 || rooms.length > 200) {
      return new Response(JSON.stringify({ error: 'Invalid rooms payload' }), { status: 400 });
    }
    const isValidRoom = (r: any) =>
      r && typeof r === 'object' &&
      typeof r.id === 'string' && r.id.length <= 100 &&
      typeof r.name === 'string' && r.name.length <= 200 &&
      typeof r.type === 'string' && r.type.length <= 50 &&
      Number.isFinite(r.x) && Number.isFinite(r.y) &&
      Number.isFinite(r.width) && Number.isFinite(r.height);
    if (!rooms.every(isValidRoom)) {
      return new Response(JSON.stringify({ error: 'Invalid room entry' }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500 });
    }

    const payload = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an expert architect. Analyze this 2D floor plan layout and suggest 3 to 5 practical improvements.
The rooms are defined by x, y, width, height (in meters).
Rules for recommendations:
1. Focus on flow, lighting, space efficiency, and logical adjacencies.
2. Return ONLY a valid JSON array of recommendation objects.
3. Each recommendation object MUST have: "title" (short), "description" (1-2 sentences), "impact" ('high', 'medium', 'low'), and "changes" (an array).
4. Each change object MUST have: "roomId" (matching an existing room), "type" ('resize', 'move', 'rename', 'retype'), and the new values ("width", "height", "x", "y", "name", "roomType" depending on the change).
Here is the current layout:
${JSON.stringify(rooms, null, 2)}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.3,
        response_mime_type: "application/json"
      }
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
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

    let parsed = [];
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      const match = text.match(/\[\s*\{.*\}\s*\]/s);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error("Could not extract JSON array");
      }
    }

    return new Response(JSON.stringify({ recommendations: parsed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
