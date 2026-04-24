export interface Placeholder {
  id: string;
  type: 'text' | 'image';
  key: string; // The {key} used in CSV/Manual Data
  label: string; // Display name in sidebar
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontFamily?: string;
  fill?: string;
  align?: 'left' | 'center' | 'right';
  isFrame?: boolean; // If true, this is the overlay frame
  staticUrl?: string; // If provided, this image is used instead of looking up data key
  rotation?: number; // Rotation in degrees
  zoom?: number; // Zoom level for images (1 = cover)
  offsetX?: number; // Pan X for images
  offsetY?: number; // Pan Y for images
  wrap?: 'word' | 'char' | 'none'; // Text wrapping mode
}

export interface Template {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundUrl?: string;
  placeholders: Placeholder[];
  category?: string;
  tags?: string[];
  description?: string;
  thumbnail?: string;
  sampleData?: Record<string, string>;
}

export interface DesignData {
  id: string;
  values: Record<string, string>;
  previewUrl?: string; // Generated preview dataUrl
}

export type InputMode = 'manual' | 'csv';
