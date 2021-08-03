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
    let newItems = items.filter((product) => product.id !== id);
    setItems(newItems);
  };

  ///////////////////
  useEffect(() => {
    console.log();
  }, [thickness, surfaceArea]);
  /////////////////////
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
        ///////////////////////////////////////
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
      //key: product.id,
      label: product.productName,
      //value: product.id,
      epd: product.epd,
    }))
    .sort((a, b) => (a.label < b.label ? -1 : 1));

  console.log("items", items);

  if (!loading)
    return (
      <>
        {items.map((item) => {
          const { id } = item;

          return (
            <div key={id} className="item">
              <Select
                options={itemOptions}
                onChange={(selected) => {
                  console.log("selected", selected);

                  items[id].productName = selected.label;
                  const selectedParameters = data.find(
                    (item) => item.epd === selected.epd
                  );
                  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                  items[id].manufacturing = +selectedParameters.manufacturing;
                  items[id].assembly = +selectedParameters.assembly;
                  items[id].transport = +selectedParameters.transport;

                  //////////////////////////////////////////////////////////////////////////////////////////////////////////////
                }}
              />

              <Field
                label={"Thickness"}
                onChange={(event) => {
                  setThickness(event.target.value);
                  items[id].thickness = +event.target.value;
                }}
              />
              <Field
                label={"Surface Area "}
                onChange={(event) => {
                  setSurfaceArea(event.target.value);
                  items[id].surfaceArea = +event.target.value;
                }}
              />

              <p>
                Volume
                {
                  (items[id].volume =
                    (items[id].thickness * items[id].surfaceArea) / 1000)
                }
              </p>

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
  else return <p>Loading</p>;
};

export default Counts;