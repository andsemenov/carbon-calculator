import { useState } from "react";
import Field from "./Field";

const Header = (props) => {
  const [postCode, setPostCode] = useState("");
  const [distance, setDistance] = useState(0);
  const [footPrintSize, setFootPrintSize] = useState(0);

  console.log(distance);
  console.log(footPrintSize);
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
            setDistance(event.target.value);
            props.setSelectedDistance(event.target.value);
          }}
        />

        <Field
          label={"Footprint Size"}
          onChange={(event) => {
            setDistance(event.target.value);
            setFootPrintSize(event.target.value);
          }}
        />
      </div>
    </>
  );
};

export default Header;
