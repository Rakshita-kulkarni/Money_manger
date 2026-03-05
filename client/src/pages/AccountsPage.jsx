import { useState } from "react";
import {
    HiBanknotes,
    HiCreditCard,
    HiDevicePhoneMobile,
    HiPencil,
    HiPlus,
    HiTrash,
} from "react-icons/hi2";
import useCategories from "../hooks/useCategories";
import usePaymentAccounts from "../hooks/usePaymentAccounts";

const TYPE_META = {
  cash: { label: "Cash", icon: HiBanknotes, color: "text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400" },
  upi: { label: "UPI", icon: HiDevicePhoneMobile, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400" },
  card: { label: "Card", icon: HiCreditCard, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/40 dark:text-purple-400" },
};

const AccountsPage = () => {
  const { accounts, loading: acLoading, addAccount, updateAccount, deleteAccount } = usePaymentAccounts();
  const { categories, loading: catLoading, addCategory, updateCategory, deleteCategory } = useCategories();

  // Account form state
  const [acForm, setAcForm] = useState({ name: "", type: "cash", balance: "" });
  const [acError, setAcError] = useState("");
  const [acLoading2, setAcLoading2] = useState(false);
  const [editAc, setEditAc] = useState(null); // { id, name, type }

  // Category form state
  const [catForm, setCatForm] = useState({ name: "", color: "#6366f1" });
  const [catError, setCatError] = useState("");
  const [catLoading2, setCatLoading2] = useState(false);
  const [editCat, setEditCat] = useState(null); // { id, name, color }

  const [notification, setNotification] = useState(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAddAccount = async (e) => {
    e.preventDefault();
    if (!acForm.name.trim()) { setAcError("Name is required"); return; }
    setAcLoading2(true);
    try {
      await addAccount({ name: acForm.name.trim(), type: acForm.type, balance: parseFloat(acForm.balance) || 0 });
      setAcForm({ name: "", type: "cash", balance: "" });
      setAcError("");
      notify("Account added!");
    } catch (err) {
      notify(err.response?.data?.message || "Failed to add account.", "error");
    } finally { setAcLoading2(false); }
  };

  const handleEditAccount = async (e) => {
    e.preventDefault();
    if (!editAc.name.trim()) return;
    try {
      await updateAccount(editAc.id, { name: editAc.name.trim(), type: editAc.type });
      setEditAc(null);
      notify("Account updated!");
    } catch { notify("Failed to update.", "error"); }
  };

  const handleDeleteAccount = async (id) => {
    if (!confirm("Delete this account?")) return;
    try {
      await deleteAccount(id);
      notify("Account deleted.");
    } catch { notify("Failed to delete.", "error"); }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!catForm.name.trim()) { setCatError("Name is required"); return; }
    setCatLoading2(true);
    try {
      await addCategory({ name: catForm.name.trim(), color: catForm.color });
      setCatForm({ name: "", color: "#6366f1" });
      setCatError("");
      notify("Category added!");
    } catch (err) {
      notify(err.response?.data?.message || "Failed to add category.", "error");
    } finally { setCatLoading2(false); }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    if (!editCat.name.trim()) return;
    try {
      await updateCategory(editCat.id, { name: editCat.name.trim(), color: editCat.color });
      setEditCat(null);
      notify("Category updated!");
    } catch { notify("Failed to update.", "error"); }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      notify("Category deleted.");
    } catch { notify("Failed to delete.", "error"); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium
          ${notification.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
          {notification.msg}
        </div>
      )}

      {/* ── Payment Accounts ── */}
      <section className="card dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-5">Payment Accounts</h3>

        {/* Add Account Form */}
        <form onSubmit={handleAddAccount} className="flex flex-wrap gap-3 mb-6">
          <input
            value={acForm.name}
            onChange={(e) => { setAcForm((p) => ({ ...p, name: e.target.value })); setAcError(""); }}
            placeholder="Account name (e.g. SBI UPI, HDFC Card)"
            className={`input-field flex-1 min-w-[180px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${acError ? "border-red-400" : ""}`}
          />
          <select
            value={acForm.type}
            onChange={(e) => setAcForm((p) => ({ ...p, type: e.target.value }))}
            className="input-field w-32 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
          </select>
          <input
            value={acForm.balance}
            onChange={(e) => setAcForm((p) => ({ ...p, balance: e.target.value }))}
            type="number"
            placeholder="Opening balance"
            min="0"
            className="input-field w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          />
          <button type="submit" disabled={acLoading2} className="btn-primary flex items-center gap-1.5 disabled:opacity-60">
            <HiPlus className="w-4 h-4" /> Add
          </button>
          {acError && <p className="w-full text-red-500 text-xs -mt-1">{acError}</p>}
        </form>

        {/* Accounts List */}
        {acLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : accounts.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500">No accounts yet. Add one above.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {accounts.map((ac) => {
              const meta = TYPE_META[ac.type] || TYPE_META.cash;
              const Icon = meta.icon;
              return editAc?.id === ac._id ? (
                <form key={ac._id} onSubmit={handleEditAccount} className="border rounded-xl p-3 space-y-2 dark:border-gray-600">
                  <input
                    value={editAc.name}
                    onChange={(e) => setEditAc((p) => ({ ...p, name: e.target.value }))}
                    className="input-field w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  />
                  <select
                    value={editAc.type}
                    onChange={(e) => setEditAc((p) => ({ ...p, type: e.target.value }))}
                    className="input-field w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="card">Card</option>
                  </select>
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary text-xs px-3 py-1.5">Save</button>
                    <button type="button" onClick={() => setEditAc(null)} className="text-xs px-3 py-1.5 border rounded-lg text-gray-600 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                  </div>
                </form>
              ) : (
                <div key={ac._id} className="border rounded-xl p-4 flex flex-col gap-2 dark:border-gray-600 dark:bg-gray-750">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`p-1.5 rounded-lg ${meta.color}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="font-medium text-sm text-gray-800 dark:text-gray-100">{ac.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{meta.label}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditAc({ id: ac._id, name: ac.name, type: ac.type })} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteAccount(ac._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-800 dark:text-gray-100">
                    ₹{ac.balance?.toFixed(2) ?? "0.00"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Categories ── */}
      <section className="card dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 mb-5">Expense Categories</h3>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex flex-wrap gap-3 mb-6">
          <input
            value={catForm.name}
            onChange={(e) => { setCatForm((p) => ({ ...p, name: e.target.value })); setCatError(""); }}
            placeholder="Category name (e.g. Gym, Petrol)"
            className={`input-field flex-1 min-w-[180px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${catError ? "border-red-400" : ""}`}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Color</label>
            <input
              type="color"
              value={catForm.color}
              onChange={(e) => setCatForm((p) => ({ ...p, color: e.target.value }))}
              className="w-10 h-9 rounded cursor-pointer border border-gray-300 dark:border-gray-600 bg-transparent"
            />
          </div>
          <button type="submit" disabled={catLoading2} className="btn-primary flex items-center gap-1.5 disabled:opacity-60">
            <HiPlus className="w-4 h-4" /> Add
          </button>
          {catError && <p className="w-full text-red-500 text-xs -mt-1">{catError}</p>}
        </form>

        {/* Categories grid */}
        {catLoading ? (
          <p className="text-sm text-gray-400">Loading...</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) =>
              editCat?.id === cat._id ? (
                <form key={cat._id} onSubmit={handleEditCategory} className="flex items-center gap-2 border rounded-xl px-3 py-1.5 dark:border-gray-600">
                  <input
                    value={editCat.name}
                    onChange={(e) => setEditCat((p) => ({ ...p, name: e.target.value }))}
                    className="border-b border-gray-300 dark:border-gray-600 bg-transparent text-sm text-gray-800 dark:text-gray-100 w-24 focus:outline-none"
                  />
                  <input
                    type="color"
                    value={editCat.color}
                    onChange={(e) => setEditCat((p) => ({ ...p, color: e.target.value }))}
                    className="w-6 h-6 rounded cursor-pointer"
                  />
                  <button type="submit" className="text-xs text-blue-600 font-medium">Save</button>
                  <button type="button" onClick={() => setEditCat(null)} className="text-xs text-gray-500">✕</button>
                </form>
              ) : (
                <div key={cat._id} className="flex items-center gap-2 border rounded-xl px-3 py-1.5 dark:border-gray-600 group">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-gray-700 dark:text-gray-200">{cat.name}</span>
                  <button onClick={() => setEditCat({ id: cat._id, name: cat.name, color: cat.color })} className="hidden group-hover:inline text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <HiPencil className="w-3 h-3" />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat._id)} className="hidden group-hover:inline text-gray-400 hover:text-red-500">
                    <HiTrash className="w-3 h-3" />
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AccountsPage;
