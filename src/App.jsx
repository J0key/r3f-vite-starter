import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Leva } from "leva";
import  UI  from "./components/UI";


function App() {
  return (
    <>
      <Leva  />
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
      <UI/>
    </>
  );
}

export default App;
