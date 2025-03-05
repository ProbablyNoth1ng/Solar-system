import { useRef, useCallback } from 'react'
import * as THREE from 'three';
import { useFrame, ThreeEvent} from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import {OrbitalPlanetProps } from '../types'
import Torus from './Torus';


const OrbitalPlanet = ({
    sunPosition = [0, 0, 0], 
    orbitRadius = 10, 
    orbitSpeed = 0.1, 
    rotationSpeed = 0.004,
    size = 1,
    textureMap,
    segments = 32,
    initialAngle = 0,
    onClick
  }: OrbitalPlanetProps & {onClick?: (planetRef: THREE.Group, size: number) => void}) => {
    const planetRef = useRef<THREE.Group>(null!)
    const orbitRef = useRef<THREE.Group>(null!)
    const meshRef = useRef<THREE.Group>(null!)
    const texture = useTexture(textureMap);
  
  
  
    useFrame((state,delta) => {
      console.log(state)
      if(orbitRef.current){
        orbitRef.current.rotation.y += orbitSpeed * delta
      }
  
      if(planetRef.current){
        planetRef.current.rotation.y += rotationSpeed * delta
      }
  
    })
  
    const handleClick = useCallback((event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      
      if (onClick && planetRef.current) {
        onClick(planetRef.current, size);
      }
    }, [onClick, size]);
  
  
    return (
      <>
          <Torus orbitRadius={orbitRadius} pos={sunPosition} thin={0.02} opacity={0.5}/>
          <group ref={orbitRef} position={sunPosition} rotation-y={initialAngle}>
            
              
              <group position={[orbitRadius,0,0]} ref={planetRef}>
              {orbitRadius === 10 * 5 + 5 * 1.5 ?  <Torus orbitRadius={5} pos={sunPosition} thin={1} opacity={1}/> : ""}
             
              <mesh 
              ref={meshRef}
              onClick={handleClick}
              
              >
              
                <sphereGeometry args={[size, segments, segments]} />
                <meshStandardMaterial map={texture}  />
              </mesh>
            </group>
          </group>
      </>
      
     
    )
  }
  


export default OrbitalPlanet;
