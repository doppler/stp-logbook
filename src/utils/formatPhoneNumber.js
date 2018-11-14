const formatPhoneNumber = value => {
  let newValue;
  switch (true) {
    case /^\d{4}/.test(value):
      newValue = value.replace(/^(\d{3})(\d{1})/, "$1-$2");
      break;
    case /^\d{3}-\d{4}/.test(value):
      newValue = value.replace(/^(\d{3}-\d{3})(\d{1})/, "$1-$2");
      break;
    default:
      newValue = value;
      break;
  }
  return newValue;
};

export default formatPhoneNumber;
