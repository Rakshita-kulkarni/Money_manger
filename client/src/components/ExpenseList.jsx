import { HiTrash } from "react-icons/hi2";

const CATEGORY_COLORS = {
  Food: "bg-orange-100 text-orange-700",
  Transport: "bg-blue-100 text-blue-700",
  Shopping: "bg-pink-100 text-pink-700",
  Entertainment: "bg-purple-100 text-purple-700",
  Health: "bg-red-100 text-red-700",
  Utilities: "bg-yellow-100 text-yellow-700",
  Education: "bg-green-100 text-green-700",
  Other: "bg-gray-100 text-gray-700",
};

const ExpenseList = ({ expenses, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <p className="text-sm">No expenses recorded today.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                CATEGORY_COLORS[expense.category] || CATEGORY_COLORS["Other"]
              }`}
            >
              {expense.category}
            </span>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
              {expense.description || expense.category}
            </span>
          </div>
          <div className="flex items-center gap-3 ml-2 shrink-0">
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              ₹{parseFloat(expense.amount).toFixed(2)}
            </span>
            <button
              onClick={() => onDelete(expense._id)}
              className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExpenseList;
