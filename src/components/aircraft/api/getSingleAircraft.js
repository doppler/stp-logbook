import getAircraft from "./getAircraft";
const getSingleAircraft = async id => {
  const aircraft = await getAircraft();
  const singleAircraft = aircraft.find(o => o.id === id);
  return singleAircraft;
};

export default getSingleAircraft;
