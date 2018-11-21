const handleFormError = errors => {
  errors.map((error, i) => {
    try {
      let el = document.getElementById(error.context.key);
      el.classList.add("error");
      return null;
    } catch (e) {
      console.error(e);
      console.log(error.context.key);
    }
    return null;
  });
  const errorFields = document.querySelectorAll(".formField.error");
  errorFields.item(0).focus();
  return null;
};

module.exports = handleFormError;
