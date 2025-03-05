import { Suspense } from 'react'
import { Canvas} from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import './App.scss'
import { Environment } from '@react-three/drei';

import Sun from './components/Sun';
import OrbitalPlanet from './components/OrbitalPlanet';
import Earth from './components/Earth';
import Saturn from './components/Saturn';

import neptune from './assets/2k_neptune.webp'
import uranus from './assets/2k_uranus.webp'
import jupiter from './assets/8k_jupiter.webp'
import mars from './assets/8k_mars.webp'
import mercury from './assets/8k_mercury.webp'
import venus from './assets/8k_venus_surface.webp'
import back from './assets/8k_stars_milky_way.jpg'




const Skybox = () => {
  return (
    <Environment 
      files={back}
      background={true}
      blur={0.02}
    />
  );
};

const CanvasLoader = () => {
  return (
    <Html center className=''>
      <div className="text-5xl font-bold text-blue-600 mb-6   flex justify-center htt">Loading Solar System...</div>
    
    </Html>
  )
}

const Space = () => { 
  const sunPosition: [number, number, number] = [0, 0, 0];
  const sunSize = 5;
  const distanceScale = 5; 


    return (
      <Canvas  camera={{position:[0,20,30]}}>
        <Suspense fallback={<CanvasLoader />}>
        <Skybox/> 
        <Sun pos={sunPosition} size={sunSize} />
        
        <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={0.4 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.04}
        rotationSpeed={0.01}
        size={0.38}
        textureMap={mercury}
        initialAngle={Math.random() * Math.PI * 2 }

        />

        <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={0.9 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.015}
        rotationSpeed={0.002} // Venus rotates very slowly
        size={0.95}
        textureMap={venus}
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
          textureMap={mars}
          initialAngle={Math.random() * Math.PI * 2}
        />

      <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={5.2 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.01}
        rotationSpeed={0.04} 
        size={11.2 * 0.3} 
        textureMap={jupiter}
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
        textureMap={uranus}
        initialAngle={Math.random() * Math.PI * 2}
       
      />

      <OrbitalPlanet 
        sunPosition={sunPosition}
        orbitRadius={21 * distanceScale + sunSize * 1.5}
        orbitSpeed={0.0011}
        rotationSpeed={0.02}
        size={3.9 * 0.3}
        textureMap={neptune}
        initialAngle={Math.random() * Math.PI * 2}
      />
        
       
        <pointLight position={[0,0,0]} intensity={200} decay={1} /> 
        <ambientLight intensity={0.7} /> 
        <OrbitControls
    
        />
       
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
