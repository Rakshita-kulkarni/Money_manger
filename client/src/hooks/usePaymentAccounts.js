import { useEffect, useState } from "react";
import { paymentAccountService } from "../services/api";

const usePaymentAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentAccountService
      .getAll()
      .then((res) => setAccounts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addAccount = async (data) => {
    const res = await paymentAccountService.create(data);
    setAccounts((prev) => [...prev, res.data]);
    return res.data;
  };

  const updateAccount = async (id, data) => {
    const res = await paymentAccountService.update(id, data);
    setAccounts((prev) => prev.map((a) => (a._id === id ? res.data : a)));
    return res.data;
  };

  const deleteAccount = async (id) => {
    await paymentAccountService.delete(id);
    setAccounts((prev) => prev.filter((a) => a._id !== id));
  };

  // Refresh accounts from server (e.g. after income/expense changes balance)
  const refreshAccounts = async () => {
    const res = await paymentAccountService.getAll();
    setAccounts(res.data);
  };

  return { accounts, loading, addAccount, updateAccount, deleteAccount, refreshAccounts };
};

export default usePaymentAccounts;
