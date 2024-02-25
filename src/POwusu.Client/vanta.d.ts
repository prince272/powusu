export interface VantaGlobeParams {
  THREE: any;
  el: string | HTMLElement;
  mouseControls: boolean;
  touchControls: boolean;
  gyroControls: boolean;
  minHeight: number;
  minWidth: number;
  scale?: number;
  scaleMobile?: number;
  color?: number | string;
  color2?: number | string;
  size?: number;
  backgroundColor?: number | string;
}

export interface VantaGlobeInstance {
  setOptions: (options: Omit<VantaGlobeParams, 'el'>) => void;
  resize: () => void;
  destroy: () => void;
}

declare global {
  const VANTA: {
    GLOBE: (options: VantaGlobeParams) => VantaGlobeInstance;
  };
}