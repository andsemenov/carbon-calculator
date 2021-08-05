import { useState, useEffect } from "react";
import Select from "react-select";
import Field from "./Field";
import { data } from "../assets/data";

const Counts = (props) => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  //const [counter, setCounter] = useState(0);
  //const [thickness, setThickness] = useState(0);
  //const [surfaceArea, setSurfaceArea] = useState(0);
  const [items, setItems] = useState([]);

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
      if (products.length) {
        setProductData([...products]);
        setLoading(false);
      }
    });
  }, []);
  let jsitems = JSON.stringify(items);
  useEffect(() => {
    props.setResults(jsitems);
  }, [props, jsitems]);

  const itemOptions = productData
    .map((product) => ({
      label: product.productName,
      epd: product.epd,
    }))
    .sort((a, b) => (a.label < b.label ? -1 : 1));

  /* const handleChange = (index) => (event) => {
    console.log(event);

    if (event.target.name === "thickness") {
      let newArr = [...items];
      newArr[index] = { ...newArr[index], thickness: event.target.value };
      setItems(newArr);
    }
    if (event.target.name === "surfaceArea") {
      let newArr = [...items];
      newArr[index] = { ...newArr[index], surfaceArea: event.target.value };
      setItems(newArr);
    }
  }; */

  const handleChange = (index) => (event) => {
    if (event.target.name === "thickness") {
      let newArr = [...items];
      newArr[index] = { ...newArr[index], thickness: +event.target.value };

      if (items[index].thickness && items[index].surfaceArea) {
        newArr[index] = {
          ...newArr[index],
          volume: (+event.target.value * newArr[index].surfaceArea) / 1000,
        };
      }
      setItems(newArr);
    }
    if (event.target.name === "surfaceArea") {
      let newArr = [...items];
      newArr[index] = { ...newArr[index], surfaceArea: +event.target.value };
      if (items[index].thickness && items[index].surfaceArea) {
        newArr[index] = {
          ...newArr[index],
          volume: (newArr[index].thickness * +event.target.value) / 1000,
        };
      }
      setItems(newArr);
    }
  };

  const removeItem = (index) => {
    let newItems = items.filter((product, id) => id !== index);
    setItems(newItems);
  };

  console.log("items", items);

  if (!loading)
    return (
      <>
        {items.map((item, index) => {
          return (
            <div key={index} className="item">
              <Select
                options={itemOptions}
                onChange={(selected) => {
                  const selectedParameters = data.find(
                    (item) => item.epd === selected.epd
                  );
                  let newArr = [...items];
                  newArr[index] = {
                    ...newArr[index],
                    ...selectedParameters,
                  };
                  setItems(newArr);
                }}
              />
              <Field
                label={"Thickness"}
                name="thickness"
                id={index}
                value={item.thickness}
                onChange={handleChange(index)}
              />
              <Field
                label={"Surface Area "}
                name="surfaceArea"
                id={index}
                value={item.surfaceArea}
                onChange={handleChange(index)}
              />

              <p>
                Volume
                {item.volume}
              </p>
              {/*
              <p>
                GWP Manufacturing per m
                {
                  (items[id].gwpManufacturingPerMeter =
                    items[id].manufacturing * 10)
                }
              </p>
              <p>
                GWP Manufacturing total
                {
                  (items[id].gwpManufacturingTotal =
                    items[id].volume * items[id].gwpManufacturingPerMeter)
                }
              </p>
              <p>
                GWP Transport per m
                {
                  (items[id].gwpTransportPerMeter =
                    (items[id].transport * 10 * props.selectedDistance) / 600)
                }
              </p>
              <p>
                GWP Transport total
                {
                  (items[id].gwpTransportTotal =
                    items[id].volume * items[id].gwpTransportPerMeter)
                }
              </p>
              <p>
                GWP Assembly per m
                {(items[id].gwpAssemblyPerMeter = items[id].assembly * 10)}
              </p>
              <p>
                GWP Assembly total
                {
                  (items[id].gwpAssemblyTotal =
                    items[id].volume * items[id].gwpAssemblyPerMeter)
                }
              </p>
              <p>
                GWP total
                {
                  (items[id].gwpTotal =
                    items[id].gwpManufacturingTotal +
                    items[id].gwpTransportTotal +
                    items[id].gwpAssemblyTotal)
                }
              </p>
 */}
              <button onClick={() => removeItem(index)}>X</button>
            </div>
          );
        })}
        <button
          className="btn"
          onClick={() => {
            //setCounter((prevState) => prevState + 1);
            setItems([
              ...items,
              { thickness: "", surfaceArea: "", volume: "" },
            ]);
          }}
        >
          Add items
        </button>
      </>
    );
  else return <p>Loading</p>;
};

export default Counts;
