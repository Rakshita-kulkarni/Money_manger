import { useState } from "react";
import { HiTrash } from "react-icons/hi2";
import useIncome from "../hooks/useIncome";
import usePaymentAccounts from "../hooks/usePaymentAccounts";

const IncomePage = () => {
  const { income, loading, addIncome, deleteIncome } = useIncome();
  const { accounts, refreshAccounts } = usePaymentAccounts();

  const [form, setForm] = useState({
    amount: "",
    paymentAccount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validate = () => {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      errs.amount = "Enter a valid amount";
    if (!form.paymentAccount) errs.paymentAccount = "Select an account";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setFormLoading(true);
    try {
      await addIncome({
        amount: parseFloat(form.amount),
        paymentAccount: form.paymentAccount,
        description: form.description.trim(),
        date: form.date,
      });
      await refreshAccounts();
      setForm({ amount: "", paymentAccount: "", description: "", date: new Date().toISOString().split("T")[0] });
      notify("Income added!");
    } catch (err) {
      notify(err.response?.data?.message || "Failed to add income.", "error");
    } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteIncome(id);
      await refreshAccounts();
      notify("Income deleted.");
    } catch { notify("Failed to delete.", "error"); }
  };

  // Total income per account
  const incomeByAccount = income.reduce((acc, inc) => {
    const name = inc.paymentAccount?.name || "Unknown";
    acc[name] = (acc[name] || 0) + inc.amount;
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
          ${notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
          {notification.msg}
        </div>
      )}

      {/* Summary cards */}
      {Object.keys(incomeByAccount).length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(incomeByAccount).map(([name, total]) => (
            <div key={name} className="card py-3 dark:bg-gray-800 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">{name}</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Income Form */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-5">Add Income</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label dark:text-gray-400">Amount (₹)</label>
              <input
                type="number" name="amount" value={form.amount} onChange={handleChange}
                placeholder="0.00" min="0.01" step="0.01"
                className={`input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.amount ? "border-red-400" : ""}`}
              />
              {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
            </div>
            <div>
              <label className="label dark:text-gray-400">Account</label>
              <select name="paymentAccount" value={form.paymentAccount} onChange={handleChange}
                className={`input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${errors.paymentAccount ? "border-red-400" : ""}`}>
                <option value="">Select account</option>
                {accounts.map((a) => (
                  <option key={a._id} value={a._id}>{a.name} ({a.type})</option>
                ))}
              </select>
              {errors.paymentAccount && <p className="text-red-500 text-xs mt-1">{errors.paymentAccount}</p>}
            </div>
            <div>
              <label className="label dark:text-gray-400">Description (optional)</label>
              <input
                type="text" name="description" value={form.description} onChange={handleChange}
                placeholder="e.g. Salary, Freelance..."
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="label dark:text-gray-400">Date</label>
              <input
                type="date" name="date" value={form.date} onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
          </div>
          <button type="submit" disabled={formLoading} className="btn-primary w-full sm:w-auto px-8 disabled:opacity-60">
            {formLoading ? "Adding..." : "Add Income"}
          </button>
        </form>
      </div>

      {/* Income History */}
      <div className="card dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">Income History</h3>
        {loading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : income.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No income recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                  <th className="pb-2 font-medium">Date</th>
                  <th className="pb-2 font-medium">Account</th>
                  <th className="pb-2 font-medium">Description</th>
                  <th className="pb-2 font-medium text-right">Amount</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {income.map((inc) => (
                  <tr key={inc._id} className="group">
                    <td className="py-2.5 text-gray-600 dark:text-gray-300">
                      {new Date(inc.date).toLocaleDateString("en-IN")}
                    </td>
                    <td className="py-2.5 text-gray-700 dark:text-gray-200">
                      {inc.paymentAccount?.name || "—"}
                    </td>
                    <td className="py-2.5 text-gray-500 dark:text-gray-400">{inc.description || "—"}</td>
                    <td className="py-2.5 text-right font-semibold text-green-600 dark:text-green-400">
                      +₹{inc.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 pl-2">
                      <button onClick={() => handleDelete(inc._id)}
                        className="opacity-0 group-hover:opacity-100 transition p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default IncomePage;
