import { useEffect, useState } from "react";
import api from "../services/api";

const useExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const addExpense = async (data) => {
    const res = await api.post("/expenses", data);
    setExpenses((prev) => [res.data, ...prev]);
    return res.data;
  };

  const deleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return { expenses, loading, error, addExpense, deleteExpense, fetchExpenses };
};

export default useExpenses;
