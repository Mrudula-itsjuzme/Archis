export const config = {
  runtime: 'edge',
};

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
            {
              text: "You are an architectural assistant. The user uploaded a floor plan image. Detect all distinct rooms/spaces in the plan. Return a JSON array of rooms. Each room MUST be an object with exactly these fields: \"name\" (string, e.g. 'Classroom 1'), \"type\" (string, MUST be one of: 'living', 'kitchen', 'bedroom', 'bathroom', 'circulation', 'office', 'classroom', 'lab', 'corridor', 'courtyard', 'stair', 'retail', 'utility', 'lobby', 'outdoor'), \"shape\" (string, MUST be one of: 'rect', 'arc', 'l-shape' — use 'arc' for semicircular or round rooms), \"x\" (number, rough X position in meters, origin top-left), \"y\" (number, rough Y in meters), \"width\" (number, width in meters), \"height\" (number, height in meters). For arc shapes, also include \"radius\" (number, radius in meters). Try to place rooms to reflect the real floor plan layout. Do NOT overlap rooms. Output ONLY valid JSON array without any markdown."
            },
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
        temperature: 0.2,
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

    let parsedRooms = [];
    try {
      parsedRooms = JSON.parse(text);
    } catch (e) {
      const match = text.match(/\[\s*\{.*\}\s*\]/s);
      if (match) {
        parsedRooms = JSON.parse(match[0]);
      } else {
        throw new Error("Could not extract JSON array");
      }
    }

    return new Response(JSON.stringify({ rooms: parsedRooms }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
