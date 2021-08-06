import { useState, useEffect } from "react";
import Select from "react-select";
import Field from "./Field";
import { data } from "../assets/data";
import { roundNumber } from "../assets/roundNumber";
import { calculateParameters } from "../assets/calculateParameters";

const Counts = (props) => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  //counts summa of all gwp in list to calculate
  let gwpTotal = items
    .filter((item) => item.gwpTotal)
    .reduce((sum, val) => sum + val.gwpTotal, 0);
  //fetch data from db
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

  //transfer total GWP summa to header component when items updated
  useEffect(() => {
    props.setResults(gwpTotal);
  }, [props, gwpTotal]);

  //change calculation if you change a distance
  useEffect(() => {
    const newItems = items.map((item) =>
      item.gwpTotal !== undefined
        ? (item = {
            ...item,
            ...calculateParameters(
              item.volume,
              item.manufacturing,
              item.transport,
              item.assembly,
              props.selectedDistance
            ),
          })
        : item
    );
    setItems(newItems);
  }, [props.selectedDistance]);

  //sort options for select
  const itemOptions = productData
    .map((product) => ({
      label: product.productName,
      epd: product.epd,
    }))
    .sort((a, b) => (a.label < b.label ? -1 : 1));

  //track changes in input and calculates, add values to object with specific index
  const handleChange = (index) => (event) => {
    let currentValue = +event.target.value;
    if (event.target.name === "thickness") {
      let newArr = [...items];
      newArr[index] = { ...newArr[index], thickness: currentValue };

      if (items[index].thickness && items[index].surfaceArea) {
        let currentVolume = (currentValue * newArr[index].surfaceArea) / 1000;
        if (
          items[index].manufacturing &&
          items[index].transport &&
          items[index].assembly
        ) {
          newArr[index] = {
            ...newArr[index],
            ...calculateParameters(
              currentVolume,
              items[index].manufacturing,
              items[index].transport,
              items[index].assembly,
              items[index].distance,
              props.selectedDistance
            ),
          };
        } else {
          newArr[index] = {
            ...newArr[index],
            volume: currentVolume,
          };
        }
      }
      setItems(newArr);
    }
    if (event.target.name === "surfaceArea") {
      let newArr = [...items];
      newArr[index] = { ...newArr[index], surfaceArea: currentValue };

      if (items[index].thickness && items[index].surfaceArea) {
        let currentVolume = (currentValue * newArr[index].thickness) / 1000;
        if (
          items[index].manufacturing &&
          items[index].transport &&
          items[index].assembly
        ) {
          newArr[index] = {
            ...newArr[index],
            ...calculateParameters(
              currentVolume,
              items[index].manufacturing,
              items[index].transport,
              items[index].assembly,
              props.selectedDistance
            ),
          };
        } else {
          newArr[index] = {
            ...newArr[index],
            volume: currentVolume,
          };
        }
      }
      setItems(newArr);
    }
  };
  //remove line from calculation list
  const removeItem = (index) => {
    let newItems = items.filter((product, id) => id !== index);
    setItems(newItems);
  };

  console.log(items);

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
                  if (items[index].volume) {
                    newArr[index] = {
                      ...newArr[index],
                      ...selectedParameters,
                      ...calculateParameters(
                        items[index].volume,
                        items[index].manufacturing,
                        items[index].transport,
                        items[index].assembly,
                        props.selectedDistance
                      ),
                    };
                  } else {
                    newArr[index] = {
                      ...newArr[index],
                      ...selectedParameters,
                    };
                  }
                  setItems(newArr);
                }}
              />
              <Field
                label={"Thickness*"}
                name="thickness"
                id={index}
                value={item.thickness}
                onChange={handleChange(index)}
              />
              <Field
                label={"Surface Area*"}
                name="surfaceArea"
                id={index}
                value={item.surfaceArea}
                onChange={handleChange(index)}
              />
              <p>
                Volume
                {roundNumber(item.volume) || null}
              </p>
              <p>
                GWP Manufacturing per m
                {roundNumber(item.gwpManufacturingPerMeter) || null}
              </p>
              <p>
                GWP Manufacturing total
                {roundNumber(item.gwpManufacturingTotal) || null}
              </p>
              <p>
                GWP Transport per m
                {roundNumber(item.gwpTransportPerMeter) || null}
              </p>
              <p>
                GWP Transport total
                {roundNumber(item.gwpTransportTotal) || null}
              </p>
              <p>
                GWP Assembly per m
                {roundNumber(item.gwpAssemblyPerMeter) || null}
              </p>
              <p>
                GWP Assembly total
                {roundNumber(item.gwpAssemblyTotal) || null}
              </p>
              <p>
                GWP total
                {roundNumber(item.gwpTotal) || null}
              </p>
              <button onClick={() => removeItem(index)}>X</button>
            </div>
          );
        })}
        <p>Summa GWP{roundNumber(gwpTotal) || null}</p>

        <button
          className="btn"
          onClick={() => {
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
