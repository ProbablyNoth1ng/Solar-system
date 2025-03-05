import { useRef } from 'react'
import * as THREE from 'three';
import { useFrame} from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import moon from '../assets/moon_mat.webp'


const Moon = ({earthPosition = [0, 0, 0], orbitRadius = 1, orbitSpeed = 0.012, size = 0.27}) => {
    const moonRef = useRef<THREE.Group>(null!)
    const orbitRef = useRef<THREE.Group>(null!)
  
      
    useFrame((state, delta) => {
      console.log(state)
      if (orbitRef.current) {
        orbitRef.current.rotation.y += orbitSpeed * delta
      }
      
      if (moonRef.current) {
        moonRef.current.rotation.y += orbitSpeed * delta
      }
    })
  
  
    const texture = useTexture({
      map: moon,
    })
    
    return (
      <group  ref={orbitRef} position={[earthPosition[0],0,0]} rotation-y={orbitSpeed}>
        <group position={[orbitRadius,0,0]} ref={moonRef}>
          <mesh>
              <sphereGeometry  args={[size, 32, 32]}  />
              <meshStandardMaterial
                {...texture}  
                roughness={1}
              />
          </mesh>
        </group>
      </group>
    )
  }
  

export default Moon;