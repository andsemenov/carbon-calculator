import { useState } from "react";
import Header from "./components/Header";
import Counts from "./components/Counts";
import "./App.css";

function App() {
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [results, setResults] = useState([""]);

  return (
    <>
      <Header setSelectedDistance={setSelectedDistance} results={results} />
      <Counts selectedDistance={selectedDistance} setResults={setResults} />
    </>
  );
}

export default App;
