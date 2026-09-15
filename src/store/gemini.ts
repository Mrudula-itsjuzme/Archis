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

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API Error: ${res.status} ${errorText}`);
  }

  const data = await res.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error("No text returned from Gemini");
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

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'circulation' | 'area' | 'adjacency' | 'lighting' | 'safety' | 'efficiency';
  priority: 'high' | 'medium' | 'low';
  changes: RecommendationChange[];
}

export interface RecommendationChange {
  spaceId: string;
  spaceName: string;
  type: 'resize' | 'move' | 'rename' | 'retype';
  newWidth?: number;
  newHeight?: number;
  newX?: number;
  newY?: number;
  newName?: string;
  newType?: string;
  reason: string;
}

export async function getRecommendations(rooms: any[], apiKey: string): Promise<Recommendation[]> {
  const roomSummary = rooms.map(r => ({
    id: r.id,
    name: r.name,
    type: r.type,
    area: parseFloat((r.width * r.height).toFixed(1)),
    x: parseFloat(r.x.toFixed(1)),
    y: parseFloat(r.y.toFixed(1)),
    width: parseFloat(r.width.toFixed(1)),
    height: parseFloat(r.height.toFixed(1)),
  }));

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{
          text: `You are an expert architectural consultant reviewing a floor plan. Here is the extracted floor plan data as JSON:

${JSON.stringify(roomSummary, null, 2)}

Analyze this floor plan and generate 3-5 specific, actionable architectural recommendations. Focus on:
- Circulation efficiency (corridors should be shorter/more direct)
- Room sizing (too small rooms, wasted space)
- Adjacency issues (incompatible rooms next to each other)
- Natural light access (rooms without windows)
- Safety (fire egress, emergency exits)

For each recommendation, also specify the EXACT changes to apply to the model (resize or move specific rooms by ID).

Return ONLY a valid JSON array of recommendations. Each recommendation MUST have this exact structure:
{
  "id": "rec_1",
  "title": "Short title (5 words max)",
  "description": "Detailed explanation of why this change improves the design",
  "category": "circulation|area|adjacency|lighting|safety|efficiency",
  "priority": "high|medium|low",
  "changes": [
    {
      "spaceId": "<exact room id from the data>",
      "spaceName": "<room name>",
      "type": "resize|move",
      "newWidth": <number, only for resize>,
      "newHeight": <number, only for resize>,
      "newX": <number, only for move>,
      "newY": <number, only for move>,
      "reason": "Brief reason for this specific change"
    }
  ]
}

Output ONLY the JSON array, no other text.`
        }]
      }
    ],
    generationConfig: { temperature: 0.3, response_mime_type: "application/json" }
  };

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API Error: ${res.status} ${err}`);
  }

  const data = await res.json();
  let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  text = text.replace(/```json/g, '').replace(/```/g, '').trim();
  return JSON.parse(text);
}
