import { useState, useEffect } from "react";
import Select from "react-select";
import Field from "./Field";
import { data } from "../assets/data";

const Counts = (props) => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  let gwpTotal = items.reduce((a, b) => +a + +b.gwpTotal, 0);
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
  //  let jsitems = JSON.stringify(items);

  //transfer total GWP summa to header component when items updated
  useEffect(() => {
    props.setResults(gwpTotal);
  }, [props, gwpTotal]);

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
          const gwpManufacturingPerMeter = items[index].manufacturing * 10;
          const gwpManufacturingTotal =
            currentVolume * gwpManufacturingPerMeter;
          const gwpTransportPerMeter =
            (items[index].transport * props.selectedDistance * 10) / 600;
          const gwpTransportTotal = currentVolume * gwpTransportPerMeter;
          const gwpAssemblyPerMeter = items[index].assembly * 10;
          const gwpAssemblyTotal = currentVolume * gwpAssemblyPerMeter;
          const gwpTotal =
            gwpManufacturingTotal + gwpTransportTotal + gwpAssemblyTotal;

          newArr[index] = {
            ...newArr[index],
            volume: currentVolume,
            gwpManufacturingPerMeter: gwpManufacturingPerMeter,
            gwpManufacturingTotal: gwpManufacturingTotal,
            gwpTransportPerMeter: gwpTransportPerMeter,
            gwpTransportTotal: gwpTransportTotal,
            gwpAssemblyPerMeter: gwpAssemblyPerMeter,
            gwpAssemblyTotal: gwpAssemblyTotal,
            gwpTotal: gwpTotal,
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
          const gwpManufacturingPerMeter = items[index].manufacturing * 10;
          const gwpManufacturingTotal =
            currentVolume * gwpManufacturingPerMeter;
          const gwpTransportPerMeter =
            (items[index].transport * props.selectedDistance * 10) / 600;
          const gwpTransportTotal = currentVolume * gwpTransportPerMeter;
          const gwpAssemblyPerMeter = items[index].assembly * 10;
          const gwpAssemblyTotal = currentVolume * gwpAssemblyPerMeter;
          const gwpTotal =
            gwpManufacturingTotal + gwpTransportTotal + gwpAssemblyTotal;

          newArr[index] = {
            ...newArr[index],
            volume: currentVolume,
            gwpManufacturingPerMeter: gwpManufacturingPerMeter,
            gwpManufacturingTotal: gwpManufacturingTotal,
            gwpTransportPerMeter: gwpTransportPerMeter,
            gwpTransportTotal: gwpTransportTotal,
            gwpAssemblyPerMeter: gwpAssemblyPerMeter,
            gwpAssemblyTotal: gwpAssemblyTotal,
            gwpTotal: gwpTotal,
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

  console.log(props.selectedDistance);

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
                    let currentVolume = items[index].volume;
                    const gwpManufacturingPerMeter =
                      items[index].manufacturing * 10;
                    const gwpManufacturingTotal =
                      currentVolume * gwpManufacturingPerMeter;
                    const gwpTransportPerMeter =
                      (items[index].transport * props.selectedDistance * 10) /
                      600;
                    const gwpTransportTotal =
                      currentVolume * gwpTransportPerMeter;
                    const gwpAssemblyPerMeter = items[index].assembly * 10;
                    const gwpAssemblyTotal =
                      currentVolume * gwpAssemblyPerMeter;
                    const gwpTotal =
                      gwpManufacturingTotal +
                      gwpTransportTotal +
                      gwpAssemblyTotal;

                    newArr[index] = {
                      ...newArr[index],
                      ...selectedParameters,
                      gwpManufacturingPerMeter: gwpManufacturingPerMeter,
                      gwpManufacturingTotal: gwpManufacturingTotal,
                      gwpTransportPerMeter: gwpTransportPerMeter,
                      gwpTransportTotal: gwpTransportTotal,
                      gwpAssemblyPerMeter: gwpAssemblyPerMeter,
                      gwpAssemblyTotal: gwpAssemblyTotal,
                      gwpTotal: gwpTotal,
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

              <p>GWP Manufacturing per m{item.gwpManufacturingPerMeter}</p>
              <p>
                GWP Manufacturing total
                {item.gwpManufacturingTotal}
              </p>
              <p>GWP Transport per m{item.gwpTransportPerMeter}</p>
              <p>
                GWP Transport total
                {item.gwpTransportTotal}
              </p>
              <p>GWP Assembly per m{item.gwpAssemblyPerMeter}</p>
              <p>
                GWP Assembly total
                {item.gwpAssemblyTotal}
              </p>
              <p>
                GWP total
                {item.gwpTotal}
              </p>

              <button onClick={() => removeItem(index)}>X</button>
            </div>
          );
        })}
        <p>Summa GWP{gwpTotal}</p>

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
