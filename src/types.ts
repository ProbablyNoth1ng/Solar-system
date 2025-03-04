import { Group} from 'three';


export interface OrbitalPlanetProps {
  sunPosition?: [number, number, number];
  orbitRadius?: number;
  orbitSpeed?: number;
  rotationSpeed?: number;
  size?: number;
  textureMap: string;
  segments?: number;
  initialAngle?:number;
  onClick?: (planetRef: Group, size: number) => void;
}


export interface EarthProps {
    sunPosition?: [number, number, number];
    orbitRadius?: number;
    orbitSpeed?: number;
    rotationSpeed?: number;
    size?: number;
    initialAngle?:number;
    onClick?: (planetRef: Group, size: number) => void;
}
  
export interface SaturnProps {
sunPosition?: [number, number, number];
orbitRadius?: number;
orbitSpeed?: number;
rotationSpeed?: number;
size?: number;
initialAngle?:number;
onClick?: (planetRef: Group, size: number) => void;
}