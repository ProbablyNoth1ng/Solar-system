import { useRef,  useMemo } from 'react'
import * as THREE from 'three';
import { useFrame} from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { SaturnProps} from '../types'
import Torus from './Torus';
import saturn from '../assets/8k_saturn.webp'
import saturn_ring from '../assets/8k_saturn_ring_alpha.webp'

const Saturn = ({
    sunPosition = [0, 0, 0],
    orbitRadius = 10 * 5 + 5 * 1.5,
    orbitSpeed = 0.005,
    rotationSpeed = 0.038,
    size = 9.5 * 0.3,
    initialAngle = 0
  }: SaturnProps) => {
    const saturnRef = useRef<THREE.Group>(null!);
    const orbitRef = useRef<THREE.Group>(null!);
    const ringRef = useRef<THREE.Mesh>(null!);
    
    const textures = useTexture({
      saturnMap: saturn,
      ringMap: saturn_ring
    });
    console.log(initialAngle)
    useMemo(() => {
      if (textures.ringMap) {
        textures.ringMap.wrapS = textures.ringMap.wrapT = THREE.RepeatWrapping;
        textures.ringMap.repeat.set(2, 1); 
        textures.ringMap.center.set(0.5, 0.5);
        textures.ringMap.rotation = Math.PI / 2; 
        textures.ringMap.needsUpdate = true;
      }
      
      if (textures.saturnMap) {
        textures.saturnMap.needsUpdate = true;
      }
    }, [textures]);
  
    const ringGeometry = useMemo(() => {
      const innerRadius = size * 1.2;
      const outerRadius = size * 2.4;
      const thetaSegments = 128; 
      const phiSegments = 2;
      
      const geometry = new THREE.RingGeometry(
        innerRadius, 
        outerRadius, 
        thetaSegments, 
        phiSegments
      );
      
      const position = geometry.attributes.position;
      const vertex = new THREE.Vector3();
      
      const uv = new Float32Array(position.count * 2);
      
      for (let i = 0; i < position.count; i++) {
        vertex.fromBufferAttribute(position, i);
        
        const theta = Math.atan2(vertex.y, vertex.x);
        const radius = Math.sqrt(vertex.x * vertex.x + vertex.y * vertex.y);
        
        const u = (theta + Math.PI) / (2 * Math.PI);
        const v = (radius - innerRadius) / (outerRadius - innerRadius);
        
        uv[i * 2] = u;
        uv[i * 2 + 1] = v;
      }
      
  
      geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      
      return geometry;
    }, [size]);
  
    useFrame((state, delta) => {
      console.log(state)
      if (orbitRef.current) {
        orbitRef.current.rotation.y += orbitSpeed * delta;
      }
  
      if (saturnRef.current) {
        saturnRef.current.rotation.y += rotationSpeed * delta;
      }
    });
  
    return (
      <group>
        <Torus pos={sunPosition} orbitRadius={orbitRadius} opacity={0.5} thin={0.02}/>
        <group ref={orbitRef} position={[sunPosition[0], sunPosition[1], sunPosition[2]]}>
          <group position={[orbitRadius, 0, 0]}>
            <group ref={saturnRef}>
              <mesh castShadow receiveShadow>
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial map={textures.saturnMap} />
              </mesh>
              
          <group rotation={[Math.PI / 2, 0, 0]}>
                <mesh ref={ringRef} geometry={ringGeometry}>
                  <meshStandardMaterial 
                    map={textures.ringMap}
                    transparent={true}
                    opacity={0.9}
                    side={THREE.DoubleSide}
                    alphaTest={0.1}
                    roughness={0.7}
                      metalness={0.2}
                    />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    );
  };


export default Saturn;