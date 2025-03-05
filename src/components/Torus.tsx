

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


export default Torus;