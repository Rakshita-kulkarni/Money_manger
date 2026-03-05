import { useEffect, useState } from "react";
import BudgetCard from "../components/BudgetCard";
import ExpenseForm from "../components/ExpenseForm";
import ExpenseList from "../components/ExpenseList";
import { useAuth } from "../context/AuthContext";
import useCategories from "../hooks/useCategories";
import useExpenses from "../hooks/useExpenses";
import usePaymentAccounts from "../hooks/usePaymentAccounts";
import { budgetService } from "../services/api";

const DashboardPage = () => {
  const { user } = useAuth();
  const { expenses, loading, addExpense, deleteExpense } = useExpenses();
  const { categories } = useCategories();
  const { accounts, refreshAccounts } = usePaymentAccounts();
  const [budget, setBudget] = useState(0);
  const [budgetInput, setBudgetInput] = useState("");
  const [budgetLoading, setBudgetLoading] = useState(false);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Load saved budget
  useEffect(() => {
    budgetService
      .get()
      .then((res) => {
        setBudget(res.data?.amount || 0);
        setBudgetInput(res.data?.amount || "");
      })
      .catch(() => {});
  }, []);

  // Today's expenses
  const today = new Date().toISOString().split("T")[0];
  const todayExpenses = expenses.filter((e) => {
    const d = e.date ? e.date.split("T")[0] : "";
    return d === today;
  });

  // Total spent this month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlySpent = expenses
    .filter((e) => {
      const d = new Date(e.date || e.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const showNotification = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleBudgetSave = async (e) => {
    e.preventDefault();
    if (!budgetInput || isNaN(budgetInput) || parseFloat(budgetInput) <= 0) return;
    setBudgetLoading(true);
    try {
      await budgetService.set({ amount: parseFloat(budgetInput) });
      setBudget(parseFloat(budgetInput));
      showNotification("Budget updated successfully!");
    } catch {
      showNotification("Failed to save budget.", "error");
    } finally {
      setBudgetLoading(false);
    }
  };

  const handleAddExpense = async (data, form) => {
    setExpenseLoading(true);
    try {
      await addExpense(data);
      if (data.paymentAccount) await refreshAccounts();
      form.reset();
      showNotification("Expense added!");
    } catch {
      showNotification("Failed to add expense.", "error");
    } finally {
      setExpenseLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      showNotification("Expense removed.");
    } catch {
      showNotification("Failed to delete expense.", "error");
    }
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all
            ${notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
        >
          {notification.msg}
        </div>
      )}

      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {greeting()}, {user?.name?.split(" ")[0] || "User"} 👋
        </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Card */}
        <div className="lg:col-span-2">
          <BudgetCard budget={budget} spent={monthlySpent} />
        </div>

        {/* Set Budget */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
            Set Monthly Budget
          </h3>
          <form onSubmit={handleBudgetSave} className="space-y-3">
            <div>
              <label className="label">Budget Amount (₹)</label>
              <input
                type="number"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                placeholder="e.g. 20000"
                min="1"
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={budgetLoading}
              className="btn-primary w-full disabled:opacity-60"
            >
              {budgetLoading ? "Saving..." : "Save Budget"}
            </button>
          </form>
        </div>
      </div>

      {/* Add Expense */}
      <div className="card">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Add Today's Expense
        </h3>
        <ExpenseForm onSubmit={handleAddExpense} loading={expenseLoading} categories={categories} accounts={accounts} />
      </div>

      {/* Today's Expenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Today's Expenses</h3>
          {todayExpenses.length > 0 && (
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              Total: ₹
              {todayExpenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}
            </span>
          )}
        </div>
        <ExpenseList
          expenses={todayExpenses}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
