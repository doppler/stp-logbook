const handleFormError = errors => {
  errors.map(error => {
    let el = document.getElementById(error.context.key);
    try {
      el.classList.add("error");
    } catch (error) {
      console.error(error); // eslint-disable-line
    }

    return null;
  });
  const errorFields = document.querySelectorAll(".formField.error");
  try {
    errorFields.item(0).focus();
  } catch (error) {
    console.error(error); // eslint-disable-line
  }
  return false;
};

export default handleFormError;
