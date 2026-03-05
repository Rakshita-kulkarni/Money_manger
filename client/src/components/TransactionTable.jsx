import { useState } from "react";
import { HiCheck, HiPencil, HiTrash, HiXMark } from "react-icons/hi2";

const STATUS_STYLES = {
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-yellow-100 text-yellow-700",
};

const TYPE_STYLES = {
  lent: "bg-blue-100 text-blue-700",
  borrowed: "bg-red-100 text-red-700",
};

const TransactionTable = ({ transactions, onDelete, onUpdate, loading }) => {
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState("");

  const totalLent = transactions
    .filter((t) => t.type === "lent")
    .reduce((s, t) => s + t.amount, 0);

  const totalBorrowed = transactions
    .filter((t) => t.type === "borrowed")
    .reduce((s, t) => s + t.amount, 0);

  const handleEditSave = (id) => {
    onUpdate(id, { status: editStatus });
    setEditId(null);
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4">
          <p className="text-xs text-blue-500 font-medium">Total Lent</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-1">
            ₹{totalLent.toFixed(2)}
          </p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-xl p-4">
          <p className="text-xs text-red-500 font-medium">Total Borrowed</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400 mt-1">
            ₹{totalBorrowed.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Table */}
      {transactions.length === 0 ? (
        <div className="text-center py-10 text-gray-400 dark:text-gray-500">
          <p className="text-sm">No transactions yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left font-medium">Person</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Type</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">Reason</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-transparent">
              {transactions.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">
                    {t.personName}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    ₹{parseFloat(t.amount).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        TYPE_STYLES[t.type]
                      }`}
                    >
                      {t.type === "lent" ? "Lent" : "Borrowed"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {editId === t._id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="text-xs border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-md px-2 py-1"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                      </select>
                    ) : (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          STATUS_STYLES[t.status]
                        }`}
                      >
                        {t.status === "paid" ? "Paid" : "Unpaid"}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400 max-w-[150px] truncate">
                    {t.reason || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(t.date || t.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {editId === t._id ? (
                        <>
                          <button
                            onClick={() => handleEditSave(t._id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            <HiCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <HiXMark className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditId(t._id);
                              setEditStatus(t.status);
                            }}
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(t._id)}
                            className="text-gray-300 hover:text-red-500"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
