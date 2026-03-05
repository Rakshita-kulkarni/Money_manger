// categories: [{ _id, name, color }]
// accounts: [{ _id, name, type }]
const ExpenseForm = ({ onSubmit, loading, categories = [], accounts = [] }) => {
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      amount: parseFloat(form.amount.value),
      category: form.category.value,
      description: form.description.value.trim(),
      paymentAccount: form.paymentAccount.value || null,
      date: form.date.value,
    };
    onSubmit(data, form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label className="label dark:text-gray-400">Amount (₹)</label>
          <input
            name="amount"
            type="number"
            placeholder="0.00"
            min="0.01"
            step="0.01"
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>

        {/* Category (Type) */}
        <div>
          <label className="label dark:text-gray-400">Type / Category</label>
          <select name="category" className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required>
            <option value="">Select type</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="label dark:text-gray-400">Description (what was spent on)</label>
          <input
            name="description"
            type="text"
            placeholder="e.g. Pizza, Uber, Groceries..."
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
        </div>

        {/* Payment Account */}
        <div>
          <label className="label dark:text-gray-400">Pay via</label>
          <select name="paymentAccount" className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
            <option value="">— No account —</option>
            {accounts.map((ac) => (
              <option key={ac._id} value={ac._id}>
                {ac.name} ({ac.type})
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="label dark:text-gray-400">Date</label>
          <input
            name="date"
            type="date"
            defaultValue={today}
            max={today}
            className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Adding..." : "Add Expense"}
      </button>
    </form>
  );
};

export default ExpenseForm;

