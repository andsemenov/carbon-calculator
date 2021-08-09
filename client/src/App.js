import { useState } from "react";
import Header from "./components/Header";
import Counts from "./components/Counts";
import "./App.css";

function App() {
  const [selectedDistance, setSelectedDistance] = useState(0);
  const [validFootprintSize, setValidFootprintSize] = useState(false);
  const [results, setResults] = useState(0);

  return (
    <>
      <Header
        setSelectedDistance={setSelectedDistance}
        validFootprintSize={validFootprintSize}
        setValidFootprintSize={setValidFootprintSize}
        results={results}
      />
      <Counts
        selectedDistance={selectedDistance}
        validFootprintSize={validFootprintSize}
        setResults={setResults}
      />
    </>
  );
}

export default App;
