import { useState, useEffect } from "react";
import Select from "react-select";
import Field from "./Field";
import { data } from "../assets/data";

const Counts = (props) => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [thickness, setThickness] = useState(0);
  const [surfaceArea, setSurfaceArea] = useState(0);
  const [items, setItems] = useState([]);

  const removeItem = (id) => {
    let newItems = items.filter((person) => person.id !== id);
    setItems(newItems);
  };

  useEffect(() => {
    async function fetchProducts() {
      const response = await fetch("/products");

      if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
      }

      const products = await response.json();
      return products;
    }
    fetchProducts().then((products) => {
      if (products) {
        ///////////////////////////////////////
        setProductData([...products]);
        setLoading(false);
      }
    });
  }, []);

  const itemOptions = productData
    .map((product) => ({
      key: product.id,
      label: product.productName,
      value: product.id,
      epd: product.epd,
    }))
    .sort((a, b) => (a.label < b.label ? -1 : 1));

  console.log(items);
  console.log(props.selectedDistance);
  console.log("thick", thickness);
  console.log();

  return (
    <>
      {items.map((item) => {
        const { id, epd } = item;

        return (
          <div key={id} className="item">
            {!loading ? (
              <Select
                id="product"
                name="product"
                options={itemOptions}
                onChange={(selected) => {
                  console.log(selected);
                  console.log(selected.value);
                  console.log(selected.label);
                  items[id].productName = selected.label;
                  const selectedParameters = data.find(
                    (item) => item.epd === selected.epd
                  );

                  items[id].manufacturing = selectedParameters.manufacturing;
                  items[id].assembly = selectedParameters.assembly;
                  items[id].transport = selectedParameters.transport;

                  console.log("selectedParameters", selectedParameters);
                }}
              />
            ) : (
              <p>Loading</p>
            )}
            <Field
              label={"Thickness"}
              onChange={(event) => {
                setThickness(event.target.value);
                items[id].thickness = event.target.value;
              }}
            />
            <Field
              label={"Surface Area "}
              onChange={(event) => {
                setSurfaceArea(event.target.value);
                items[id].surfaceArea = event.target.value;
                //items[id].thickness = event.target.value;
              }}
            />
            {items[id].thickness && items[id].surfaceArea && (
              <p>{items[id].thickness * items[id].surfaceArea}</p>
            )}

            <button onClick={() => removeItem(id)}>X</button>
          </div>
        );
      })}
      <button
        className="btn"
        onClick={() => {
          setCounter((prevState) => prevState + 1);
          setItems([...items, { id: counter }]);
        }}
      >
        Add items
      </button>
    </>
  );
};

export default Counts;
