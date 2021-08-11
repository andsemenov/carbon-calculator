import { useState, useEffect } from "react";
import Select from "react-select";
import Field from "./Field";
import { data } from "../assets/data";
import { roundNumber } from "../assets/roundNumber";
import { calculateParameters } from "../assets/calculateParameters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

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
        //change volume if wrong input
        let newArr = [...items];
        newArr[index] = {
          ...newArr[index],
          volume: 0,
        };
        setItems([...newArr]);
        //change errors message
        let newErrors = [...errors];
        newErrors[index].thickness = {
          ...newErrors[index].thickness,
          error: true,
          message: "Only positive numbers!",
        };
        setErrors(newErrors);
      }
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
        //change volume if wrong input
        let newArr = [...items];
        newArr[index] = {
          ...newArr[index],
          volume: 0,
        };
        setItems([...newArr]);
        //change errors message
        let newErrors = [...errors];
        newErrors[index].surfaceArea = {
          ...newErrors[index].surfaceArea,
          error: true,
          message: "Only positive numbers!",
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
  if (!loading)
    return (
      <>
        <Table id="main-table-calculation">
          <Thead>
            <Tr>
              <Th className="th-calc-list">Product</Th>
              <Th className="th-calc-list">Thickness (mm)</Th>
              <Th className="th-calc-list">Surface area used (m2)</Th>
              <Th className="th-calc-list">Volume (m3)</Th>
              <Th className="th-calc-list">GWP manufacturing</Th>
              <Th className="th-calc-list">GWP transport</Th>
              <Th className="th-calc-list">GWP assembly</Th>
              <Th className="th-calc-list">Total</Th>
              <Th className="th-calc-list"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {items.map((item, index) => {
              return (
                <Tr key={index} className="item">
                  <Td className="td-align-top">
                    <Select
                      id="material"
                      options={itemOptions}
                      className={`form-control ${
                        errors[index].item.error && "invalid"
                      }`}
                      errors={errors[index].item}
                      onChange={(selected) => {
                        //change error to false
                        let newErrors = [...errors];
                        newErrors[index].item = {
                          ...newErrors[index].item,
                          error: false,
                        };
                        setErrors(newErrors);
                        const selectedParameters = data.find(
                          (item) => item.epd === selected.epd
                        );
                        let newArr = [...items];
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
                  </Td>
                  <Td className="td-align-top">
                    <Field
                      name="thickness"
                      className={`form-control ${
                        errors[index].thickness.error && "invalid"
                      }`}
                      id={index}
                      placeholder={"0"}
                      errors={errors[index].thickness}
                      onChange={handleChange(index)}
                    />
                  </Td>
                  <Td className="td-align-top">
                    <Field
                      name="surfaceArea"
                      className={`form-control ${
                        errors[index].surfaceArea.error && "invalid"
                      }`}
                      id={index}
                      placeholder={"0"}
                      errors={errors[index].surfaceArea}
                      onChange={handleChange(index)}
                    />
                  </Td>
                  <Td className="calc-values">
                    <p>{roundNumber(item.volume)}</p>
                  </Td>
                  <Td className="calc-values">
                    <p>{roundNumber(item.gwpManufacturingTotal) || 0}</p>
                  </Td>
                  <Td className="calc-values">
                    <p>{roundNumber(item.gwpTransportTotal) || 0}</p>
                  </Td>
                  <Td className="calc-values">
                    <p>{roundNumber(item.gwpAssemblyTotal) || 0}</p>
                  </Td>
                  <Td className="calc-values">
                    <p>{roundNumber(item.gwpTotal) || 0}</p>
                  </Td>
                  <Td id="delete-row">
                    <button
                      className="delete-calculation"
                      onClick={() => removeItem(index)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
        <button
          className="add-calculation"
          onClick={() => {
            setItems([...items, { thickness: 0, surfaceArea: 0, volume: 0 }]);
            setErrors([
              ...errors,
              {
                item: {
                  error: true,
                  message: "Material is required!",
                },
                thickness: {
                  error: true,
                  message: "Thickness is required!",
                },
                surfaceArea: {
                  error: true,
                  message: "Surface area is required!",
                },
              },
            ]);
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        <Table id="table-total-sum">
          <Thead>
            <Tr>
              <Th id="total-sum-title">
                <p>Sum GWP(kgCO2e)</p>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td id="total-sum-value">
                <p>{roundNumber(gwpTotal) || 0}</p>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </>
    );
  else return <p>Loading</p>;
};

export default Counts;
