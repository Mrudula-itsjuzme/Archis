import { Space } from '../models/types';

export async function extractRoomsWithGemini(base64Image: string, apiKey: string): Promise<Space[]> {
  const base64Data = base64Image.split(',')[1];
  const mimeType = base64Image.split(',')[0].split(':')[1].split(';')[0];
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  const payload = {
    model: "google/gemini-1.5-flash",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "You are an architectural assistant. The user uploaded a floor plan image. Detect all distinct rooms/spaces in the plan. Return a JSON array of rooms. Each room MUST be an object with exactly these fields: \"name\" (string, e.g. 'Classroom 1'), \"type\" (string, MUST be one of: 'living', 'kitchen', 'bedroom', 'bathroom', 'circulation', 'office', 'classroom', 'lab', 'corridor', 'courtyard', 'stair', 'retail', 'utility', 'lobby', 'outdoor'), \"x\" (number, rough X position in meters, assuming origin is top-left), \"y\" (number, rough Y position in meters), \"width\" (number, width in meters), \"height\" (number, height in meters). Ensure rooms do not overlap and form a contiguous floor plan. Output ONLY valid JSON array without any markdown formatting."
          },
          {
            type: "image_url",
            image_url: {
              url: dataUrl
            }
          }
        ]
      }
    ],
    temperature: 0.2
  };

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://archis.demo',
      'X-Title': 'Archis'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter API Error: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  let text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("No text returned from OpenRouter");
  }

  // Strip markdown blocks if the model wrapped it
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    const rooms = JSON.parse(text);
    return rooms.map((r: any, idx: number) => ({
      ...r,
      id: `extracted_space_${idx}_${Date.now()}`,
      isLocked: false
    }));
  } catch (err) {
    throw new Error("Failed to parse JSON response: " + text);
  }
}
