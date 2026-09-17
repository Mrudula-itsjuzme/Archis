import { Space } from '../models/types';

export interface RecommendationChange {
  spaceId: string;
  type: 'resize' | 'move' | 'rename' | 'retype';
  newWidth?: number;
  newHeight?: number;
  newX?: number;
  newY?: number;
  newName?: string;
  newRoomType?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  changes: RecommendationChange[];
}

export async function extractRoomsWithGemini(base64Image: string, _apiKey: string): Promise<Space[]> {
  const res = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ base64Image })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  
  return data.rooms;
}

export async function getRecommendations(rooms: Space[], _apiKey: string): Promise<Recommendation[]> {
  const res = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rooms })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error: ${res.status} - ${err}`);
  }

  const data = await res.json();
  if (data.error) throw new Error(data.error);
  
  return data.recommendations;
}
