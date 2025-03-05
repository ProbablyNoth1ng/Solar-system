import { useRef } from 'react'
import * as THREE from 'three';
import { useTexture } from '@react-three/drei'
import sun from '../assets/8k_sun.webp'


const Sun =({pos, size = 5}:{pos:[number,number,number], size:number}) => {
    const sunRef = useRef<THREE.Group>(null!)
  
    const textures = useTexture({
      map: sun
    })
  
    return (
      <group position={pos} >
        <mesh ref={sunRef} >
          <sphereGeometry args={[size,64,64]}/>
          <meshStandardMaterial 
            {...textures }
            emissive={new THREE.Color(0xffddaa)}
            emissiveIntensity={0.01}
  
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[size * 1.2, 32, 32]} />
          <meshBasicMaterial
            color={new THREE.Color(0xffddaa)}
            transparent={true}
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      </group>
    )
  }


export default Sun;