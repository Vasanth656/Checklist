import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, Save, ArrowLeft } from "lucide-react";
import axios from "axios";
import API from "../config/api";

const DEFAULT_FORM = {
  title:       "",
  description: "",
  assignedTo:  "",
  dueDate:     "",
  priority:    "MEDIUM",
  status:      "OPEN",
};

export default function CorrectiveActionForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id     = searchParams.get("id");
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error,    setError]    = useState(null);

  // ── load existing record when editing ─────────────────────────────────────

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${API.getAction}/${id}`)
      .then(({ data }) => {
        setFormData({
          title:       data.title       ?? "",
          description: data.description ?? "",
          assignedTo:  data.assignedTo  ?? "",
          dueDate:     data.dueDate ? data.dueDate.split("T")[0] : "",
          priority:    data.priority    ?? "MEDIUM",
          status:      data.status      ?? "OPEN",
        });
      })
      .catch(() => setError("Failed to load action details."))
      .finally(() => setFetching(false));
  }, [id]);

  // ── handlers ──────────────────────────────────────────────────────────────

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Title is required.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        ...formData,
        // send ISO string; backend does new Date()
        dueDate: formData.dueDate ? `${formData.dueDate}T00:00:00.000Z` : null,
      };

      if (isEdit) {
        await axios.put((`${API.updateAction

        }/${id}`), payload);
      } else {
        await axios.post(API.addAction, payload);
      }

      navigate("/actions");
    } catch (err) {
      setError("Save failed. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── ui ────────────────────────────────────────────────────────────────────

  if (fetching)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
        <div className="h-12 w-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">

      {/* HEADER */}
      <div className="bg-white/70 backdrop-blur-md border-b shadow-sm">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-3">
          <button
            onClick={() => navigate("/actions")}
            className="text-slate-500 hover:text-slate-800 transition mr-1"
          >
            <ArrowLeft size={20} />
          </button>
          <AlertTriangle className="text-red-500" />
          <h1 className="text-2xl font-bold text-purple-700">
            {isEdit ? "Edit Corrective Action" : "New Corrective Action"}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">

        {/* ERROR */}
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6 space-y-4">

          <div className="grid md:grid-cols-2 gap-4">

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. Fix login issue"
                className="p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Assigned To
              </label>
              <input
                value={formData.assignedTo}
                onChange={(e) => handleChange("assignedTo", e.target.value)}
                placeholder="e.g. John Doe"
                className="p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
                className="p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange("status", e.target.value)}
                className="p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              >
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange("dueDate", e.target.value)}
                className="p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>

          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
            />
          </div>
        </div>

        {/* SAVE */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition font-semibold disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Save className="inline mr-2" size={18} />
            {loading ? "Saving..." : isEdit ? "Update Action" : "Save Action"}
          </button>
        </div>

      </div>
    </div>
  );
}