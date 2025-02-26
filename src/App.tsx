import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three';

import { Canvas, useFrame, useThree  } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera, Plane, Sphere, useHelper, useTexture } from '@react-three/drei'

import './App.css'


// const [lastRender, setLastRender] = useState(0);

// useFrame((state, delta) => {
//   const now = performance.now();
//   // Limit to ~30 fps
//   if (now - lastRender >= 33) {
//     // Your animation code here
//     setLastRender(now);
//   }
// });


const Skybox = () => {
  return (
    <Environment
      files={"src/assets/HDR_blue_nebulae-1.hdr"}
      background={true}
      // blur={0.03}
    
    
    />
  )
}





const Earth = ({pos, scale = [1,1,1 ]}:{pos:[number,number,number], scale?:[number,number,number]}) => {
  const earthRef  = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)

  const textures = useTexture({
    map: "src/assets/Albedo.jpg",           
    specularMap: "src/assets/8081_earthspec4k.jpg", 
    bumpMap: "src/assets/8081_earthbump4k.jpg",     
    normalMap: "src/assets/8k_earth_normal_map.jpg", 
    emissiveMap: "src/assets/8k_earth_nightmap.jpg"  
  })

  const cloudTexture = useTexture("src/assets/8k_earth_clouds.jpg")


  useFrame((state,delta) => {
    if(earthRef.current){
      earthRef.current.rotation.y += 0.0015 * delta
    }

    if(cloudsRef.current){
      cloudsRef.current.rotation.y += 0.002*delta
    }

  })

  return(
    <group position={pos} scale={scale}>
      <mesh ref={earthRef} >
      <sphereGeometry args={[5, 64, 64]} />
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
        <sphereGeometry args={[5.05, 64, 64]} />
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



    </group>
    
  )
}

const Moon = ({pos}:{pos:[number,number,number]}) => {
  const texture = useTexture({
    map:"src/assets/moon_mat.webp",
    displacementMap:"src/assets/disp.webp"
  })
  
  return (
    <group  position={pos}>
      
        <mesh>
          <sphereGeometry args={[1.35,32,32]}/>
          <meshStandardMaterial
            {...texture}
            displacementScale={0.07}
            roughness={1}
            flatShading={false}
            
        
          />
        </mesh>

    </group>
  )
}
// const CameraHelper = () => {
//   const cameraRef = useRef<THREE.PerspectiveCamera>(null!)

//   useEffect(() => {
//     if(cameraRef.current){
//       cameraRef.current.position.set(0,3,10)
//       cameraRef.current.lookAt(0,0,0)
//     }
//   })

//   useHelper(cameraRef,THREE.CameraHelper)

//     return <group >
//       <PerspectiveCamera ref={cameraRef} args={[60,1,1,3]}/>
//     </group>
// }


const Space = () => { 
    return (
      <Canvas camera={{position:[0,20,30]}}>
        <Skybox/>
        <Earth pos={[0,0,0]}/>
        <Moon pos={[5,5,5]}/>
        <pointLight position={[30,30,30]} intensity={100 } decay={1}/> 
        <axesHelper args={[10]}/>
        {/* <CameraHelper/> */}
        <OrbitControls/>
        {/* <Terrain /> */}
      </Canvas>
    )
}


function App() {


  return (
    <>
     <div className="h-screen">
        <Space />
     </div>
    </>
  )
}

export default App
