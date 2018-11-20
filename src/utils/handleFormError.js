const handleFormError = errors => {
  console.error(errors);
  errors.map((error, i) => {
    let el = document.getElementById(error.context.key);
    try {
      el.classList.add("error");
    } catch (error) {
      console.error(error);
    }

    return null;
  });
  const errorFields = document.querySelectorAll(".formField.error");
  try {
    errorFields.item(0).focus();
  } catch (error) {
    console.error(error);
  }
  return false;
};

module.exports = handleFormError;
