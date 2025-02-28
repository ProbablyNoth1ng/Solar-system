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
    
    />
  )
}





const Earth = ({pos, scale = [1,1,1 ]}:{pos:[number,number,number], scale?:[number,number,number]}) => {
  const earthRef  = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)

  const textures = useTexture({
    map: "src/assets/Albedo.webp",           
    specularMap: "src/assets/8081_earthspec4k.webp", 
    bumpMap: "src/assets/8081_earthbump4k.webp",     
    normalMap: "src/assets/8k_earth_normal_map.webp", 
    emissiveMap: "src/assets/8k_earth_nightmap.webp"  
  })

  const cloudTexture = useTexture("src/assets/8k_earth_clouds.webp")


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

const Moon = ({earthPosition = [0, 0, 0], orbitRadius = 10, orbitSpeed = 0.5}) => {
  const moonRef = useRef<THREE.Group>(null!)
  const orbitRef = useRef<THREE.Group>(null!)


  useEffect(() => {
    if(orbitRef.current){
      orbitRef.current.position.set(earthPosition[0], earthPosition[1], earthPosition[2])
    }
  },[earthPosition])
  
  useFrame((state, delta) => {
    if(orbitRef.current){
      orbitRef.current.rotation.y += orbitSpeed * delta
    }

    if(orbitRef.current){
      orbitRef.current.rotation.y += 0.001 * delta
    }
  })

  const texture = useTexture({
    map:"src/assets/moon_mat.webp",
    displacementMap:"src/assets/disp.webp"
  })
  
  return (
    <group  ref={orbitRef}>
      <group position={[orbitRadius,0,0]} ref={moonRef}>
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
      
      

    </group>
  )
}

const Mercury = ({pos}:{pos:[number,number,number]}) => {
  const mercuryRef = useRef<THREE.Group>(null!)

  const texture = useTexture({
    map:"src/assets/8k_mercury.webp",
  })

  return (
    <group position={pos} ref={mercuryRef}>
      <mesh >
        <sphereGeometry args={[2,32,32]} />
        <meshStandardMaterial
            {...texture}
            
        />
      </mesh>
    </group>
  )
}


const Venus = ({pos}:{pos:[number,number,number]}) => {
  const venusRef = useRef<THREE.Group>(null!)

  const textures = useTexture({
    map:"src/assets/8k_venus_surface.webp"
  })

  return (
    <group position={pos} ref={venusRef}>
      <mesh>
        <sphereGeometry args={[2,32,32]} />
        <meshStandardMaterial {...textures}/>
      </mesh>
    </group>
  )
}


const Mars = ({pos}:{pos:[number,number,number]}) => {
  const marsRef = useRef<THREE.Group>(null!)

  const textures = useTexture({
    map:"src/assets/8k_mars.webp",
    normalMap:"src/assets/mars_1k_normal.jpg",
    
  })

  return (
    <group position={pos} ref={marsRef}>
      <mesh>
        <sphereGeometry args={[2,32,32]} />
        <meshStandardMaterial {...textures }/>
      </mesh>
    </group>
  )
}

const Jupiter = ({pos}:{pos:[number,number,number]}) => {
  const jupiterRef = useRef<THREE.Group>(null!)

  const textures = useTexture({
    map:"src/assets/8k_jupiter.webp",
   
    
  })

  return (
    <group position={pos} ref={jupiterRef}>
      <mesh>
        <sphereGeometry args={[2,32,32]} />
        <meshStandardMaterial {...textures }/>
      </mesh>
    </group>
  )
}

const Saturn = ({pos}:{pos:[number,number,number]}) => {
  const saturnRef = useRef<THREE.Group>(null!)

  const textures = useTexture({
    map:"src/assets/8k_saturn.webp",

   
    
  })

  return (
    <group position={pos} ref={saturnRef}>
      <mesh>
        <sphereGeometry args={[2,32,32]} />
        <meshStandardMaterial {...textures }/>
      </mesh>
    </group>
  )
}

const Uranus = ({pos}:{pos:[number,number,number]}) => {
  const saturnRef = useRef<THREE.Group>(null!)

  const textures = useTexture({
    map:"src/assets/2k_uranus.webp",

   
    
  })

  return (
    <group position={pos} ref={saturnRef}>
      <mesh>
        <sphereGeometry args={[2,32,32]} />
        <meshStandardMaterial {...textures }/>
      </mesh>
    </group>
  )
}


const Neptune = ({pos}:{pos:[number,number,number]}) => {
  const saturnRef = useRef<THREE.Group>(null!)

  const textures = useTexture({
    map:"src/assets/2k_neptune.webp",

   
    
  })

  return (
    <group position={pos} ref={saturnRef}>
      <mesh>
        <sphereGeometry args={[2,32,32]} />
        <meshStandardMaterial {...textures }/>
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
        <Mercury pos={[25,0,0]}/>
        <Venus pos={[0,0,25]}/>
        <Earth pos={[0,0,0]}/>
        <Mars pos={[0,5,25]}/>
        <Jupiter pos={[25,5,5]}/>
        <Saturn pos={[12,15,5]}/>
        <Uranus pos={[25,25,25]}/>
        <Neptune pos={[10,5,25]}/>
        <Moon earthPosition={[0, 0, 0]} orbitRadius={12} orbitSpeed={0.2}/>
        <pointLight position={[30,30,30]} intensity={100 } decay={1}/> 
        <axesHelper args={[10]}/>
        {/* <CameraHelper/> */}
        <OrbitControls/>

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
