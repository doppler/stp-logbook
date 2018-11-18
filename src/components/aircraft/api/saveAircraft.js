import validateAircraft from "./validateAircraft";

const saveAircraft = async singleAircraft => {
  const validation = validateAircraft(singleAircraft);
  if (validation.error) {
    return { error: validation.error.details };
  }

  const res = JSON.parse(localStorage.getItem("stp-logbook:aircraft"));
  const aircraft = res
    ? [singleAircraft, ...res.filter(o => o.id !== singleAircraft.id)]
    : [singleAircraft];

  localStorage.setItem("stp-logbook:aircraft", JSON.stringify(aircraft));

  return {};
};

export default saveAircraft;
