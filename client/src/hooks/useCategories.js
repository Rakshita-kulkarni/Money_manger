import { useEffect, useState } from "react";
import { categoryService } from "../services/api";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => setCategories(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addCategory = async (data) => {
    const res = await categoryService.create(data);
    setCategories((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateCategory = async (id, data) => {
    const res = await categoryService.update(id, data);
    setCategories((prev) => prev.map((c) => (c._id === id ? res.data : c)));
    return res.data;
  };

  const deleteCategory = async (id) => {
    await categoryService.delete(id);
    setCategories((prev) => prev.filter((c) => c._id !== id));
  };

  return { categories, loading, addCategory, updateCategory, deleteCategory };
};

export default useCategories;
