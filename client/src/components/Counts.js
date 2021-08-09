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
  const [errors, setErrors] = useState([]);
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
      if (/^(0|\+?[1-9]\d*)$/.test(currentValue)) {
        //change array errors thickness -make error false
        let newErrors = [...errors];
        newErrors[index].thickness = {
          ...newErrors[index].thickness,
          error: false,
        };
        setErrors(newErrors);

        //////////////////////////////////////
        let newArr = [...items];
        newArr[index] = { ...newArr[index], thickness: currentValue };
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
        setItems(newArr);
      } else {
        //change errors message
        let newErrors = [...errors];
        console.log("newErr", newErrors);
        newErrors[index].thickness = {
          ...newErrors[index].thickness,
          error: true,
          message: "only numbers 0 or greater allowed",
        };
        setErrors(newErrors);
      }
      /////////////////////////
    }
    if (event.target.name === "surfaceArea") {
      if (/^(0|\+?[1-9]\d*)$/.test(currentValue)) {
        //change array errors surfaceArea -make error false
        let newErrors = [...errors];
        newErrors[index].surfaceArea = {
          ...newErrors[index].surfaceArea,
          error: false,
        };
        setErrors(newErrors);
        let newArr = [...items];
        newArr[index] = { ...newArr[index], surfaceArea: currentValue };
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
        // }
        setItems(newArr);
      } else {
        //change errors message
        let newErrors = [...errors];
        console.log("newErr", newErrors);
        newErrors[index].surfaceArea = {
          ...newErrors[index].surfaceArea,
          error: true,
          message: "only numbers 0 or greater allowed",
        };
        setErrors(newErrors);
      }
    }
  };
  //remove line from calculation list
  const removeItem = (index) => {
    let newItems = items.filter((item, id) => id !== index);
    setItems(newItems);
    let newErrors = errors.filter((error, id) => id !== index);
    setErrors(newErrors);
  };
  console.log("error", errors);
  if (!loading)
    return (
      <>
        {items.map((item, index) => {
          return (
            <div key={index} className="item">
              <Select
                options={itemOptions}
                className={`form-control ${
                  errors[index].item.error && "invalid"
                }`}
                errors={errors[index].item}
                onChange={(selected) => {
                  /////////////////
                  let newErrors = [...errors];
                  console.log("newErr", newErrors);
                  newErrors[index].item = {
                    ...newErrors[index].item,
                    error: false,
                  };
                  setErrors(newErrors);
                  ////////////////
                  const selectedParameters = data.find(
                    (item) => item.epd === selected.epd
                  );

                  let newArr = [...items];
                  console.log("newArr", newArr);
                  newArr[index] = {
                    ...newArr[index],
                    ...selectedParameters,
                    ...calculateParameters(
                      newArr[index].volume,
                      selectedParameters.manufacturing,
                      selectedParameters.transport,
                      selectedParameters.assembly,
                      props.selectedDistance
                    ),
                  };
                  setItems(newArr);
                }}
              />
              {errors[index].item.error && (
                <small className="text-danger">
                  {errors[index].item.message}
                </small>
              )}
              <Field
                label={"Thickness*"}
                name="thickness"
                className={`form-control ${
                  errors[index].thickness.error && "invalid"
                }`}
                id={index}
                //value={item.thickness}
                placeholder={"0"}
                errors={errors[index].thickness}
                onChange={handleChange(index)}
              />
              <Field
                label={"Surface Area*"}
                name="surfaceArea"
                className={`form-control ${
                  errors[index].surfaceArea.error && "invalid"
                }`}
                id={index}
                //value={item.surfaceArea}
                placeholder={"0"}
                errors={errors[index].surfaceArea}
                onChange={handleChange(index)}
              />
              <p>
                Volume
                {roundNumber(item.volume)}
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
        <p>Summa GWP kgCO2e{roundNumber(gwpTotal) || null}</p>

        <button
          className="btn"
          onClick={() => {
            setItems([...items, { thickness: 0, surfaceArea: 0, volume: 0 }]);
            setErrors([
              ...errors,
              {
                item: {
                  error: true,
                  message: "mat required",
                },
                thickness: {
                  error: true,
                  message: "thick required",
                },
                surfaceArea: {
                  error: true,
                  message: "surf required",
                },
              },
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
