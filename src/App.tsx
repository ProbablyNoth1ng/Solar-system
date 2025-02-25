import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three';

import { Canvas, useFrame, useThree  } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera, Plane, Sphere, useHelper, useTexture } from '@react-three/drei'

import './App.css'



// const  Skybox = () => {
//   const {scene} = useThree();

//   useEffect(() => {
//     const loader = new THREE.CubeTextureLoader();
//     const basePath = '../assets/skybox/'

//     const texture = loader.load([
//       basePath + 'px.jpg', // right
//       basePath + 'nx.jpg', // left
//       basePath + 'py.jpg', // top
//       basePath + 'ny.jpg', // bottom
//       basePath + 'pz.jpg', // front
//       basePath + 'nz.jpg'  // back
//     ]);

//     scene.background = texture;

//     return () => {
//       texture.dispose
//     }
//   },[scene])

//   return null;
// }

const Skybox = () => {
  return (
    <Environment
      files={"src/assets/HDR_blue_nebulae-1.hdr"}
      background={true}
      blur={0.03}
    
    
    />
  )
}




const Terrain = () => {



  return (
    <Plane args={[20, 10]} rotation={[-Math.PI / 2, 0, 0]} position={[0,-2,0]}>
      <meshStandardMaterial  />
    </Plane>
  )
}

const Obj = ({pos, scale = [1,1,1 ]}:{pos:[number,number,number], scale?:[number,number,number]}) => {
  const boxRef = useRef<THREE.Mesh>(null!)
  const terrainTextures = useTexture({
    map: "src/assets/Albedo.jpg",
    roughnessMap:"src/assets/Ocean_Mask.png",
    displacementMap:"src/assets/topography_5k.png"
  })
  return(
    <mesh ref={boxRef} position={pos} scale={scale}>
      <sphereGeometry args={[1]}/>
      <meshStandardMaterial {...terrainTextures}  displacementScale={0.01}
   /> 
    </mesh>
  )
}


const CameraHelper = () => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)

  useEffect(() => {
    if(cameraRef.current){
      cameraRef.current.position.set(0,3,10)
      cameraRef.current.lookAt(0,0,0)
    }
  })

  useHelper(cameraRef,THREE.CameraHelper)

    return <group >
      <PerspectiveCamera ref={cameraRef} args={[60,1,1,3]}/>
    </group>
}


const Space = () => { 
    return (
      <Canvas camera={{position:[0,2,5]}}>
        <Skybox/>
        <Obj pos={[0,0,0]}/>
        <pointLight position={[2,2,2]} intensity={20}/>
        {/* <axesHelper args={[10]}/> */}
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
