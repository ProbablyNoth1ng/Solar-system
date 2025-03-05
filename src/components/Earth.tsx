
import { useRef } from 'react'
import * as THREE from 'three';
import { useFrame} from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import Torus from './Torus';
import Moon from './Moon';
import { EarthProps } from '../types';

import earth_clouds from '../assets/8k_earth_clouds.webp'
import earth_nightmap from '../assets/8k_earth_nightmap.webp'
import earth_normalmap from '../assets/8k_earth_normal_map.webp'
import earth_color from '../assets/Albedo.webp'
import earth_specular from '../assets/8081_earthspec4k.webp'
import earth_bump from '../assets/8081_earthbump4k.webp'

const Earth = ({sunPosition = [0,0,0],orbitRadius = 30 , orbitSpeed = 0.05, size = 1, initialAngle = 0, rotationSpeed = 0.01}:EarthProps) => {
    const earthRef  = useRef<THREE.Mesh>(null!)
    const cloudsRef = useRef<THREE.Mesh>(null!)
    const orbitRef = useRef<THREE.Mesh>(null!)
  
    const textures = useTexture({
      map: earth_color,           
      specularMap: earth_specular, 
      bumpMap: earth_bump,     
      normalMap: earth_normalmap, 
      emissiveMap: earth_nightmap,   
    })
  
    const cloudTexture = useTexture(earth_clouds)
  
    useFrame((state,delta) => {
        console.log(state)
      if(orbitRef.current){
        orbitRef.current.rotation.y += orbitSpeed * delta
      }
  
      if(earthRef.current){
        earthRef.current.rotation.y += rotationSpeed * delta
      }
  
      if(cloudsRef.current){
        cloudsRef.current.rotation.y += 0.002*delta
      }
  
    })
    console.log(initialAngle)
    return(
      <>
          <Torus orbitRadius={orbitRadius} pos={sunPosition} thin={0.02} opacity={0.5}/>
          <group ref={orbitRef}  position={sunPosition} rotation-y={10}>
            <group position={[orbitRadius,0,0]}>
            <mesh ref={earthRef} >
            <sphereGeometry  args={[size, 64, 64]} />
              <meshStandardMaterial 
                map={textures.map}
                normalMap={textures.normalMap}
                bumpMap={textures.bumpMap}
                roughnessMap={textures.specularMap}
                emissiveMap={textures.emissiveMap}
                emissive={new THREE.Color(0xffffff)}
                emissiveIntensity={0.5}
                bumpScale={0.05}
                roughness={0.8}
              /> 
          </mesh>
  
          <mesh ref={cloudsRef}>
              <sphereGeometry args={[size * 1.02, 64, 64]} />
              <meshStandardMaterial 
                map={cloudTexture}
                transparent={true}
                opacity={0.5}
                depthWrite={false}
                side={THREE.DoubleSide}
                roughness={1}
                metalness={0}
              />
          </mesh>
      
          <Moon earthPosition={[0, 0, 0]} orbitRadius={size * 2.5} orbitSpeed={0.025} size={size * 0.27}  />
          </group>
          
        </group>
        
  
      </>
      
      
    )
  }
  
export default Earth;