import { Space } from '../models/types';

export async function extractRoomsWithGemini(base64Image: string, apiKey: string): Promise<Space[]> {
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0];

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "You are an architectural assistant. The user uploaded a floor plan image. Detect all distinct rooms/spaces in the plan. Return a JSON array of rooms. Each room MUST be an object with exactly these fields: \"name\" (string, e.g. 'Classroom 1'), \"type\" (string, MUST be one of: 'living', 'kitchen', 'bedroom', 'bathroom', 'circulation', 'office', 'classroom', 'lab', 'corridor', 'courtyard', 'stair', 'retail', 'utility', 'lobby', 'outdoor'), \"x\" (number, rough X position in meters, assuming origin is top-left), \"y\" (number, rough Y position in meters), \"width\" (number, width in meters), \"height\" (number, height in meters). Ensure rooms do not overlap and form a contiguous floor plan. Output ONLY valid JSON array."
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

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API Error: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No text returned from Gemini");
  }

  try {
    const rooms = JSON.parse(text);
    return rooms.map((r: any, idx: number) => ({
      ...r,
      id: `extracted_space_${idx}_${Date.now()}`,
      isLocked: false
    }));
  } catch (err) {
    throw new Error("Failed to parse Gemini JSON response");
  }
}
