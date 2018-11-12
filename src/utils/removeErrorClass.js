const removeErrorClass = () => {
  const els = document.getElementsByClassName("formField error");
  while (els[0]) {
    els[0].classList.remove("error");
  }
};

export default removeErrorClass;
