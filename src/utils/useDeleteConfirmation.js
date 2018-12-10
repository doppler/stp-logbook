import { useState } from "react";

const useDeleteConfirmation = () => {
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const changeDeleteConfirmation = () => {
    setDeleteConfirmation(true);
    setTimeout(() => setDeleteConfirmation(false), 1000);
  };
  return [deleteConfirmation, changeDeleteConfirmation];
};

export default useDeleteConfirmation;
