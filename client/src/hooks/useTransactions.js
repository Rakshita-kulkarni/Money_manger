import { useEffect, useState } from "react";
import api from "../services/api";

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (data) => {
    const res = await api.post("/transactions", data);
    setTransactions((prev) => [res.data, ...prev]);
    return res.data;
  };

  const updateTransaction = async (id, data) => {
    const res = await api.put(`/transactions/${id}`, data);
    setTransactions((prev) =>
      prev.map((t) => (t._id === id ? res.data : t))
    );
    return res.data;
  };

  const deleteTransaction = async (id) => {
    await api.delete(`/transactions/${id}`);
    setTransactions((prev) => prev.filter((t) => t._id !== id));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    fetchTransactions,
  };
};

export default useTransactions;
