import { useState } from "react";
import Field from "../../components/Field";

const Header = (props) => {
  const [postCode, setPostCode] = useState("");
  //const [distance, setDistance] = useState(0);
  const [footPrintSize, setFootPrintSize] = useState(0);

  console.log("this is results", props.results);

  return (
    <>
      <p>Header</p>
      <div>
        <Field
          label={"Site postcode"}
          onChange={(event) => {
            setPostCode(event.target.value);
          }}
        />
        <Field
          label={"Distance"}
          onChange={(event) => {
            //setDistance(event.target.value);
            props.setSelectedDistance(event.target.value);
          }}
        />

        <Field
          label={"Footprint Size"}
          onChange={(event) => {
            // setDistance(event.target.value);
            setFootPrintSize(event.target.value);
          }}
        />
        <p>Total GWP{props.results}</p>
      </div>
    </>
  );
};

export default Header;
