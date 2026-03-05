import { useState } from "react";
import TransactionTable from "../components/TransactionTable";
import useTransactions from "../hooks/useTransactions";

const TransactionsPage = () => {
  const {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  const [form, setForm] = useState({
    personName: "",
    amount: "",
    type: "lent",
    status: "unpaid",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState(null);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validate = () => {
    const errs = {};
    if (!form.personName.trim()) errs.personName = "Person name is required";
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      errs.amount = "Enter a valid amount";
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
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setFormLoading(true);
    try {
      await addTransaction({
        personName: form.personName.trim(),
        amount: parseFloat(form.amount),
        type: form.type,
        status: form.status,
        reason: form.reason.trim(),
        date: form.date,
      });
      setForm({
        personName: "",
        amount: "",
        type: "lent",
        status: "unpaid",
        reason: "",
        date: new Date().toISOString().split("T")[0],
      });
      showNotification("Transaction added!");
    } catch {
      showNotification("Failed to add transaction.", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      showNotification("Transaction deleted.");
    } catch {
      showNotification("Failed to delete.", "error");
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await updateTransaction(id, data);
      showNotification("Status updated.");
    } catch {
      showNotification("Failed to update.", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
            ${notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
        >
          {notification.msg}
        </div>
      )}

      {/* Add Transaction Form */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-5">
          Add Transaction
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Person Name */}
            <div>
              <label className="label">Person Name</label>
              <input
                type="text"
                name="personName"
                value={form.personName}
                onChange={handleChange}
                placeholder="e.g. Rahul, Priya..."
                className={`input-field ${errors.personName ? "border-red-400" : ""}`}
              />
              {errors.personName && (
                <p className="text-red-500 text-xs mt-1">{errors.personName}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="label">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className={`input-field ${errors.amount ? "border-red-400" : ""}`}
              />
              {errors.amount && (
                <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="label">Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="input-field"
              >
                <option value="lent">Lent (I gave money)</option>
                <option value="borrowed">Borrowed (I took money)</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="input-field"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className="input-field"
              />
            </div>

            {/* Reason */}
            <div className="sm:col-span-2">
              <label className="label">Reason (optional)</label>
              <input
                type="text"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="e.g. Borrowed for medical expenses..."
                className="input-field"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="btn-primary w-full sm:w-auto px-8 disabled:opacity-60"
          >
            {formLoading ? "Adding..." : "Add Transaction"}
          </button>
        </form>
      </div>

      {/* Transactions Table */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-5">
          All Transactions
        </h3>
        <TransactionTable
          transactions={transactions}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TransactionsPage;
