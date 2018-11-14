const { store } = require("react-recollect");

export default flash => {
  const type = Object.keys(flash)[0];
  const message = flash[type];
  store.flash = { type, message };
  setTimeout(() => {
    store.flash = { type: "", message: "" };
  }, 10000);
};
