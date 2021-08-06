//calculate parameters and pack in object
export const calculateParameters = (
  volume,
  manufacturing,
  transport,
  assembly,
  distance
) => {
  let obj = {};
  const gwpManufacturingPerMeter = manufacturing * 10;
  const gwpManufacturingTotal = volume * gwpManufacturingPerMeter;
  const gwpTransportPerMeter = (transport * distance * 10) / 600;
  const gwpTransportTotal = volume * gwpTransportPerMeter;
  const gwpAssemblyPerMeter = assembly * 10;
  const gwpAssemblyTotal = volume * gwpAssemblyPerMeter;
  const gwpTotal = gwpManufacturingTotal + gwpTransportTotal + gwpAssemblyTotal;

  return (obj = {
    ...obj,
    volume: volume,
    gwpManufacturingPerMeter: gwpManufacturingPerMeter,
    gwpManufacturingTotal: gwpManufacturingTotal,
    gwpTransportPerMeter: gwpTransportPerMeter,
    gwpTransportTotal: gwpTransportTotal,
    gwpAssemblyPerMeter: gwpAssemblyPerMeter,
    gwpAssemblyTotal: gwpAssemblyTotal,
    gwpTotal: gwpTotal,
  });
};
