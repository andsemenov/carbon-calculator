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
  return (
    <>
      <h1 id="header-title">Carbon calculator</h1>
      <table className="header-table">
        <tbody className="header-table-body">
          <tr className="header-row">
            <td className="title-in-row">
              <label className="title-table-data" htmlFor="postcode">
                {"Site postcode (optional)"}
              </label>
            </td>
            <td className="data-in-row">
              <input
                id="postcode"
                type="text"
                className={`form-control ${errors.postcode && "invalid"}`}
                {...register("postcode", {
                  pattern: {
                    value: /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/,
                    message: "Please input a valid postcode!",
                  },
                })}
                onKeyUp={(event) => {
                  trigger("postcode");
                }}
              />
              {errors.postcode && (
                <p className="text-danger">{errors.postcode.message || null}</p>
              )}
            </td>
          </tr>
          <tr className="header-row">
            <td className="title-in-row">
              <label className="title-table-data" htmlFor="footprint">
                {"Building footprint size (m2)*"}
              </label>
            </td>
            <td className="data-in-row">
              <input
                id="footprint"
                type="text"
                className={`form-control ${errors.footprint && "invalid"}`}
                {...register("footprint", {
                  required: "The value is Required!",
                  min: {
                    value: Number.MIN_VALUE,
                    message: "The value must be greater than 0!",
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Only numbers greater 0!",
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
                <p className="text-danger">
                  {errors.footprint.message || null}
                </p>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <table className="header-table">
        <tbody className="header-table-body">
          <tr className="header-row">
            <td className="title-in-row">
              <label className="title-table-data" htmlFor="distance">
                Distance from manufacturing plant (km)
              </label>
            </td>
            <td className="data-in-row">
              <input
                id="distance"
                type="text"
                className={`form-control ${errors.distance && "invalid"}`}
                {...register("distance", {
                  min: {
                    value: 0,
                    message: "Must be 0 or greater!",
                  },
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "Only numbers 0 or greater!",
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
                <p className="text-danger">{errors.distance.message || null}</p>
              )}
            </td>
          </tr>
          <tr className="header-row">
            <td className="title-in-row">
              <p>Embodied carbon contribution from insulation (kgCO2e/m2)</p>
            </td>
            <td className="data-in-row">
              {props.validFootprintSize &&
                roundNumber(props.results / footPrintSize)}
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
    </>
  );
};

export default Header;
