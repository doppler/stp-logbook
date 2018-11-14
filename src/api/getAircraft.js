const exampleAircraft = [
  { id: "N1234Z", name: "Otter 34Z", tailNumber: "N1234Z" }
];

const getAircraft = async () => {
  const aircraft =
    JSON.parse(localStorage.getItem("stp-logbook:aircraft")) || exampleAircraft;
  return aircraft;
};

export default getAircraft;
