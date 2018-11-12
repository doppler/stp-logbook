const handleFormError = errors => {
  errors.map((error, i) => {
    let el = document.getElementById(error.context.key);
    el.classList.add("error");
    return null;
  });
  return false;
};

module.exports = handleFormError;
