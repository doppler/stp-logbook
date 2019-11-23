import { useState, useEffect } from "react";

const useDeleteConfirmation = () => {
  let deleteButtonTimeout;
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const changeDeleteConfirmation = () => setDeleteConfirmation(true);
  useEffect(() => {
    deleteButtonTimeout = setTimeout(() => setDeleteConfirmation(false), 1000);
    return () => clearTimeout(deleteButtonTimeout);
  }, [deleteConfirmation]);
  return [deleteConfirmation, changeDeleteConfirmation];
};

export default useDeleteConfirmation;
