import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../config/api";
import DataTable from "../components/DataTable";
import { PriorityBadge, StatusBadge } from "../components/Badges";



// ── constants ─────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS = {
  status:     "",
  priority:   "",
  assignedTo: "",
  sortBy:     "createdAt",
  order:      "desc",
};

// ── component ─────────────────────────────────────────────────────────────────

export default function CorrectiveActionList() {
  const navigate = useNavigate();

  const [actions,  setActions]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [filters,  setFilters]  = useState(DEFAULT_FILTERS);

  // ── fetch ──────────────────────────────────────────────────────────────────

  const fetchActions = useCallback(async (f) => {
    try {
      setLoading(true);
      setError(null);

      // strip empty strings so they don't get sent as query params
      const params = Object.fromEntries(
        Object.entries(f).filter(([, v]) => v !== "")
      );

      const res = await axios.get(API.getAction, { params });
      setActions(res.data);
    } catch (err) {
      setError("Failed to load actions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // re-fetch whenever filters change (covers initial load too)
  useEffect(() => {
    fetchActions(filters);
  }, [filters, fetchActions]);

  // ── delete ─────────────────────────────────────────────────────────────────

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API?.deleteAction}/${deleteId}`);
      setDeleteId(null);
      fetchActions(filters);
    } catch (err) {
      setError("Delete failed. Please try again.");
      setDeleteId(null);
    }
  };

  // ── filter helpers ─────────────────────────────────────────────────────────

  const setFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  // ── table columns ──────────────────────────────────────────────────────────

  const columns = [
    { key: "title",      label: "Title" },
    { key: "assignedTo", label: "Assigned To" },
    {
      key: "priority",
      label: "Priority",
      render: (row) => <PriorityBadge priority={row.priority} />,
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "dueDate",
      label: "Due Date",
      render: (row) =>
        row.dueDate ? new Date(row.dueDate).toLocaleDateString() : "-",
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",
      render: (row) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => navigate(`/actions/add?id=${row.id}`)}
            className="px-3 py-1.5 rounded-lg text-white text-xs font-medium bg-gradient-to-r from-amber-400 to-orange-500 hover:scale-105 transition"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="px-3 py-1.5 rounded-lg text-white text-xs font-medium bg-gradient-to-r from-red-500 to-rose-600 hover:scale-105 transition"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  // ── ui ─────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Corrective Actions
          </h1>
          <p className="text-slate-500 mt-1">Manage and track all corrective actions</p>
        </div>
        <button
          onClick={() => navigate("/actions/add")}
          className="px-5 py-3 rounded-2xl text-white font-semibold shadow-lg hover:scale-105 transition bg-gradient-to-r from-red-500 to-orange-500"
        >
          + Add Action
        </button>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* FILTER BAR */}
      <div className="flex gap-3 mb-6 flex-wrap items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">

        <select
          className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value)}
        >
          <option value="">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={filters.priority}
          onChange={(e) => setFilter("priority", e.target.value)}
        >
          <option value="">All Priority</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <input
          type="text"
          placeholder="Filter by assigned to..."
          className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={filters.assignedTo}
          onChange={(e) => setFilter("assignedTo", e.target.value)}
        />

        <select
          className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={filters.sortBy}
          onChange={(e) => setFilter("sortBy", e.target.value)}
        >
          <option value="createdAt">Sort: Created Date</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
        </select>

        <select
          className="border border-slate-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={filters.order}
          onChange={(e) => setFilter("order", e.target.value)}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>

        <button
          onClick={() => setFilters(DEFAULT_FILTERS)}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm transition"
        >
          Reset
        </button>

        <span className="ml-auto text-sm text-slate-400">
          {!loading && `${actions.length} result${actions.length !== 1 ? "s" : ""}`}
        </span>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="h-12 w-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin" />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={actions}
          emptyMessage="No corrective actions found"
        />
      )}

      {/* DELETE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-3xl shadow-2xl w-[400px] text-center">
            <div className="text-5xl mb-3">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800">Delete Action</h2>
            <p className="text-slate-500 mt-2 mb-6">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-5 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl text-white bg-red-500 hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}