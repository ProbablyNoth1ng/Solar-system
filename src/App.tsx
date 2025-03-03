import { useState, useRef, useEffect, Suspense } from 'react'
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, PerspectiveCamera, Plane, Sphere, useHelper, useTexture, OrbitControls, Html } from '@react-three/drei'
import './App.scss'

interface OrbitalPlanetProps {
  sunPosition?: [number, number, number];
  orbitRadius?: number;
  orbitSpeed?: number;
  rotationSpeed?: number;
  size?: number;
  textureMap: string;
  segments?: number;
  initialAngle?: number;
}

interface EarthProps{
  sunPosition?: [number,number,number],
  orbitRadius:number,
  orbitSpeed:number, 
  rotationSpeed:number,
  size:number,
  initialAngle:number,
}

const OrbitalPlanet = ({
  sunPosition = [0, 0, 0], 
  orbitRadius = 10, 
  orbitSpeed = 0.1, 
  rotationSpeed = 0.004,
  size = 1,
  textureMap,
  segments = 32,
  initialAngle = 0
}: OrbitalPlanetProps) => {
  const planetRef = useRef<THREE.Group>(null!)
  const orbitRef = useRef<THREE.Group>(null!)
  const texture = useTexture(textureMap);



  useFrame((state,delta) => {
    if(orbitRef.current){
      orbitRef.current.rotation.y += orbitSpeed * delta
    }

    if(planetRef.current){
      planetRef.current.rotation.y += rotationSpeed * delta
    }

  })

  return (
    <group ref={orbitRef} position={sunPosition} rotation-y={initialAngle}>
        <group position={[orbitRadius,0,0]} ref={planetRef}>
        <mesh>
          <sphereGeometry args={[size, segments, segments]} />
          <meshStandardMaterial map={texture}  />
        </mesh>
      </group>
    </group>
  )
}

const Skybox = () => {
  return (
    <Environment
      files={"src/assets/HDR_blue_nebulae-1.hdr"}
      background={true}
    
    />
  )
}





const Sun =({pos, size = 5}:{pos:[number,number,number], size:number}) => {
  const sunRef = useRef<THREE.Group>(null!)

  const textures = useTexture({
    map:"src/assets/8k_sun.webp",
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


const Earth = ({sunPosition = [0,0,0],orbitRadius = 30 , orbitSpeed = 0.05, size = 1, initialAngle = 0, rotationSpeed}:EarthProps) => {
  const earthRef  = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)
  const orbitRef = useRef<THREE.Mesh>(null!)

  const textures = useTexture({
    map: "src/assets/Albedo.webp",           
    specularMap: "src/assets/8081_earthspec4k.webp", 
    bumpMap: "src/assets/8081_earthbump4k.webp",     
    normalMap: "src/assets/8k_earth_normal_map.webp", 
    emissiveMap: "src/assets/8k_earth_nightmap.webp"  
  })

  const cloudTexture = useTexture("src/assets/8k_earth_clouds.webp")

  useFrame((state,delta) => {

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

  return(
    <group ref={orbitRef}  position={sunPosition} rotation-y={initialAngle}>
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

    <Moon earthPosition={[0, 0, 0]} orbitRadius={size * 2.5} orbitSpeed={0.5} size={size * 0.27} />
     </group>
    </group>
    
  )
}

const Moon = ({earthPosition = [0, 0, 0], orbitRadius = 1, orbitSpeed = 0.1, size = 0.27}) => {
  const moonRef = useRef<THREE.Group>(null!)
  const orbitRef = useRef<THREE.Group>(null!)


  const texture = useTexture({
    map:"src/assets/moon_mat.webp",
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



const CanvasLoader = () => {
  return (
    <Html center className=''>
      <div className="text-5xl font-bold text-blue-600 mb-6   flex justify-center htt">Loading Solar System...</div>
    </Html>
  )
}
// const Torus = ({orbitRadius}: {orbitRadius: number}) => { // for saturn
//   return (
//     <group position={[0,0,0]}  >
//       <mesh>
//         <torusGeometry 
//           args={[
//             orbitRadius,  
//             0.05,         // Thin tube for the orbit line
//             2,            // Low radial segments for performance
//             64,           // More tubular segments for smoother circle
//             Math.PI * 2 
//           ]}
          
//         />
//         <meshStandardMaterial color={"white"} />
//       </mesh>
//     </group>
//   )
// }

const Torus = ({orbitRadius}: {orbitRadius: number}) => {
  return (
    <group position={[0,0,0]} rotation={[Math.PI / 2, 0, 0]} >
      <mesh>
        <torusGeometry 
          args={[
            orbitRadius,  
            0.02,         // Thin tube for the orbit line
            2,            // Low radial segments for performance
            128,           // More tubular segments for smoother circle
            Math.PI * 2 
          ]}
          
        />
        <meshStandardMaterial 
         color={"white"} 
         transparent={true}
         opacity={0.5}
          />
      </mesh>
    </group>
  )
}

const Space = () => { 
  const sunPosition: [number, number, number] = [0, 0, 0];
  const sunSize = 5;
  const distanceScale = 5; 
    return (
      <Canvas camera={{position:[0,20,30]}}>
        <Suspense fallback={<CanvasLoader />}>
        <Skybox/>
        <Sun pos={sunPosition} size={sunSize} />
        <Torus orbitRadius={0.4 * distanceScale + sunSize * 1.5} />
        <Torus orbitRadius={0.9 * distanceScale + sunSize * 1.5} />
        <Torus orbitRadius={2 * distanceScale + sunSize * 1.5} />
        <Torus orbitRadius={3 * distanceScale + sunSize * 1.5} />
        <Torus orbitRadius={5.2 * distanceScale + sunSize * 1.5} />
        <Torus orbitRadius={10 * distanceScale + sunSize * 1.5} />
        <Torus orbitRadius={17 * distanceScale + sunSize * 1.5} />
        <Torus orbitRadius={21 * distanceScale + sunSize * 1.5} />

        <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={0.4 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.04}
        rotationSpeed={0.01}
        size={0.38}
        textureMap="src/assets/8k_mercury.webp"
        initialAngle={Math.random() * Math.PI * 2}
      />
        <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={0.9 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.015}
        rotationSpeed={0.002} // Venus rotates very slowly
        size={0.95}
        textureMap="src/assets/8k_venus_surface.webp"
        initialAngle={Math.random() * Math.PI * 2}
      />

      <Earth 
        sunPosition={sunPosition}
        orbitRadius={2 * distanceScale + sunSize * 1.5}
        rotationSpeed={0.009} 
        orbitSpeed={0.01}
        size={1.0}
        initialAngle={Math.random() * Math.PI * 2}
      />

      <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={3 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.008}
        rotationSpeed={0.015}
        size={0.53}
        textureMap="src/assets/8k_mars.webp"
        initialAngle={Math.random() * Math.PI * 2}
      />

      <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={5.2 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.01}
        rotationSpeed={0.04} 
        size={11.2 * 0.3} 
        textureMap="src/assets/8k_jupiter.webp"
        segments={64} 
        initialAngle={Math.random() * Math.PI * 2}
      />

      <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={10 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.005}
        rotationSpeed={0.038}
        size={9.5 * 0.3} // Scaled down for visualization
        textureMap="src/assets/8k_saturn.webp"
        segments={64}
        initialAngle={Math.random() * Math.PI * 2}
      />

      <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={17 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.0024}
        rotationSpeed={0.02}
        size={4.0 * 0.3}
        textureMap="src/assets/2k_uranus.webp"
        initialAngle={Math.random() * Math.PI * 2}
      />

      <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={21 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.0011}
        rotationSpeed={0.02}
        size={3.9 * 0.3}
        textureMap="src/assets/2k_neptune.webp"
        initialAngle={Math.random() * Math.PI * 2}
      />
        
       
        <pointLight position={[0,0,0]} intensity={200} decay={1} /> 
        <ambientLight intensity={0.1} /> 
        <OrbitControls/>
        <axesHelper args={[10]}/>
        </Suspense>
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
