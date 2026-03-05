const BudgetCard = ({ budget, spent }) => {
  const remaining = budget - spent;
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = remaining < 0;

  return (
    <div className="card">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Monthly Budget</h3>
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            ₹{Math.abs(remaining).toFixed(2)}
          </p>
          <p className={`text-sm mt-0.5 ${isOver ? "text-red-500" : "text-green-600 dark:text-green-400"}`}>
            {isOver ? "Over budget" : "Remaining"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Spent: <span className="font-semibold text-gray-700 dark:text-gray-200">₹{spent.toFixed(2)}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Budget: <span className="font-semibold text-gray-700 dark:text-gray-200">₹{budget.toFixed(2)}</span>
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            isOver ? "bg-red-500" : percentage > 80 ? "bg-yellow-500" : "bg-blue-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{percentage.toFixed(0)}% used</p>
    </div>
  );
};

export default BudgetCard;
