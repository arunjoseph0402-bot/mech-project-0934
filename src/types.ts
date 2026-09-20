export type WorkstationId = 'all' | 'central' | 'left' | 'right';

export type VisualMode = 'solid' | 'wireframe' | 'blueprint';

export type LightingMode = 'studio' | 'workshop' | 'cyber';

export interface ComponentSpec {
  id: string;
  name: string;
  category: string;
  workstation: 'central' | 'left' | 'right';
  dimensions: string;
  material: string;
  weight: string;
  specs: { [key: string]: string };
  description: string;
}

export interface CameraPreset {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}
