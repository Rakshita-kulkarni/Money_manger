import { useEffect, useState } from "react";
import { incomeService } from "../services/api";

const useIncome = () => {
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    incomeService
      .getAll()
      .then((res) => setIncome(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const addIncome = async (data) => {
    const res = await incomeService.create(data);
    setIncome((prev) => [res.data, ...prev]);
    return res.data;
  };

  const deleteIncome = async (id) => {
    await incomeService.delete(id);
    setIncome((prev) => prev.filter((i) => i._id !== id));
  };

  return { income, loading, addIncome, deleteIncome };
};

export default useIncome;
