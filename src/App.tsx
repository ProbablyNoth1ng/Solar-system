import { useRef, Suspense, useMemo, useCallback } from 'react'
import * as THREE from 'three';
import { Canvas, useFrame, ThreeEvent} from '@react-three/fiber'
import { Environment, useTexture, OrbitControls, Html } from '@react-three/drei'
import {OrbitalPlanetProps, EarthProps, SaturnProps} from './types'
import './App.scss'



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
    // Stop propagation to prevent multiple click events
    event.stopPropagation();
    
    // Call onClick if provided, passing the planet group ref and size
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


const Earth = ({sunPosition = [0,0,0],orbitRadius = 30 , orbitSpeed = 0.05, size = 1, initialAngle = 0, rotationSpeed = 0.01}:EarthProps) => {
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
  
  // Load textures
  const textures = useTexture({
    saturnMap: "src/assets/8k_saturn.webp",
    ringMap: "src/assets/8k_saturn_ring_alpha.webp"
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




const CanvasLoader = () => {
  return (
    <Html center className=''>
      <div className="text-5xl font-bold text-blue-600 mb-6   flex justify-center htt">Loading Solar System...</div>
    </Html>
  )
}

const Torus = ({orbitRadius, pos, thin, opacity}: {orbitRadius: number, pos:[number,number,number], thin:number, opacity:number}) => {
  
  return (
    <group position={pos} rotation={[Math.PI / 2, 0, 0]} >
      <mesh>
        <torusGeometry 
          args={[
            orbitRadius,  
            thin,         
            2,            
            128,           
            Math.PI * 2 
          ]}
          
        />
        <meshStandardMaterial 
         color={"white"} 
         transparent={true}
         opacity={opacity}
         
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
      <Canvas  camera={{position:[0,20,30]}}
>
        <Suspense fallback={<CanvasLoader />}>
        <Skybox/>
        <Sun pos={sunPosition} size={sunSize} />
        
        <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={0.4 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.04}
        rotationSpeed={0.01}
        size={0.38}
        textureMap="src/assets/8k_mercury.webp"
        initialAngle={Math.random() * Math.PI * 2 }

        />

        <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={0.9 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.015}
        rotationSpeed={0.002} // Venus rotates very slowly
        size={0.95}
        textureMap="src/assets/8k_venus_surface.webp"
        initialAngle={Math.random() * Math.PI * 2 }
        />

        <Earth 
          sunPosition={sunPosition}
          orbitRadius={2 * distanceScale + sunSize * 1.5}
          rotationSpeed={0.019} 
          orbitSpeed={0.01}
          size={1.0}
          initialAngle={Math.random() * Math.PI * 3}
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
      <Saturn 
        sunPosition={sunPosition}
        orbitRadius={10 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.005}
        rotationSpeed={0.038}
        size={9.5 * 0.3}
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
        <ambientLight intensity={0.7} /> 
        <OrbitControls
    
        />
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
