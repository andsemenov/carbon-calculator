import { useState } from "react";
import Header from "./components/Header";
import Counts from "./components/Counts";
import "./App.css";

function App() {
  const [selectedDistance, setSelectedDistance] = useState(0);

  return (
    <>
      <Header setSelectedDistance={setSelectedDistance} />
      <Counts selectedDistance={selectedDistance} />
    </>
  );
}

export default App;
