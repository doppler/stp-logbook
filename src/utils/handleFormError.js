const handleFormError = errors => {
  errors.map((error, i) => {
    let el = document.getElementById(error.context.key);
    el.classList.add("error");
    return null;
  });
  const errorFields = document.querySelectorAll(".formField.error");
  errorFields.item(0).focus();
  return false;
};

module.exports = handleFormError;
