import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { roundNumber } from "../../assets/roundNumber";
import "./style.css";

const Header = (props) => {
  const [footPrintSize, setFootPrintSize] = useState(0);
  //validation stuff
  const {
    register,
    formState: { errors },
    trigger,
  } = useForm();

  useEffect(() => {
    trigger("footprint");
  }, [props.validFootprintSize, trigger]);

  console.log("valid?", props.validFootprintSize);
  return (
    <>
      <p>Header</p>
      <div>
        <label htmlFor="postcode">{"Site postcode"}</label>
        <input
          id="postcode"
          type="text"
          className={`form-control ${errors.postcode && "invalid"}`}
          {...register("postcode", {
            pattern: {
              value: /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/,
              message: "Please input a valid postcode(optional)",
            },
          })}
          onKeyUp={(event) => {
            trigger("postcode");
          }}
        />
        {errors.postcode && (
          <small className="text-danger">{errors.postcode.message}</small>
        )}
      </div>
      <div>
        <label htmlFor="distance">
          {"Distance from manufacturing plant (km)"}
        </label>
        <input
          id="distance"
          type="text"
          className={`form-control ${errors.distance && "invalid"}`}
          {...register("distance", {
            min: {
              value: 0,
              message: "Distance must be greater than 0",
            },
            pattern: {
              value: /^[0-9]*$/,
              message: "Only numbers are allowed",
            },
          })}
          onKeyUp={(event) => {
            trigger("distance").then(function (result) {
              if (result) {
                props.setSelectedDistance(event.target.value);
              }
            });
          }}
        />
        {errors.distance && (
          <small className="text-danger">{errors.distance.message}</small>
        )}
      </div>
      <div>
        <label htmlFor="footprint">{"Building footprint size (m2)*"}</label>
        <input
          id="footprint"
          type="text"
          className={`form-control ${errors.footprint && "invalid"}`}
          {...register("footprint", {
            required: "Building footprint size is Required",
            min: {
              value: Number.MIN_VALUE,
              message: "Building footprint size must be greater than 0",
            },
            pattern: {
              value: /^[0-9]*$/,
              message: "Only numbers are allowed",
            },
          })}
          onKeyUp={(event) => {
            trigger("footprint").then(function (result) {
              props.setValidFootprintSize(result);
              if (result) {
                setFootPrintSize(event.target.value);
              }
            });
          }}
        />
        {errors.footprint && (
          <small className="text-danger">{errors.footprint.message}</small>
        )}
      </div>
      <p>
        Embodied carbon contribution from insulation (kgCO2e/m2)
        {props.validFootprintSize && roundNumber(props.results / footPrintSize)}
      </p>
    </>
  );
};

export default Header;
