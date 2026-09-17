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

export interface ExtractedDoor {
  id: string;
  x: number;
  y: number;
  width: number;
  connects: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface ExtractedWindow {
  id: string;
  x: number;
  y: number;
  width: number;
  wall_side: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ExtractionResult {
  rooms: Space[];
  doors: ExtractedDoor[];
  windows: ExtractedWindow[];
  building_type: string;
  scale_confidence: 'high' | 'medium' | 'low';
  estimated_scale_note: string;
  overall_confidence: 'high' | 'medium' | 'low';
  undetected_elements: string[];
  notes: string;
}

export async function extractBlueprintWithGemini(base64Image: string, _apiKey: string): Promise<ExtractionResult> {
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
  
  return data as ExtractionResult;
}

// Keep legacy export for any remaining callers
export async function extractRoomsWithGemini(base64Image: string, apiKey: string): Promise<Space[]> {
  const result = await extractBlueprintWithGemini(base64Image, apiKey);
  return result.rooms;
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
