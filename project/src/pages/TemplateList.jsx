import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/DataTable";
import axios from "axios";
import API from "../config/api";

export default function TemplateList() {
  const [templates, setTemplates] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchTemplates = async () => {
    try {
      setLoading(true);

      const res = await axios.get(API?.getTemplate);

      setTemplates(res.data);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const confirmDelete = async () => {
    try {
      await axios.delete(`${API.deleteTemplate}/${deleteId}`)
      setDeleteId(null);
      fetchTemplates();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const columns = [
    {
      key: "templateName",
      label: "Template Name",
    },
    {
      key: "description",
      label: "Description",
    },
    {
      key: "actions",
      label: "Actions",
      align: "right",

      render: (row) => (
        <div className="flex gap-2 justify-end">
          <button
            onClick={() =>
              navigate(`/checklist/add?id=${row.id}`)
            }
            className="
              px-4 py-2
              rounded-xl
              text-white
              font-medium
              transition
              hover:scale-105
              bg-gradient-to-r
              from-amber-400
              to-orange-500
            "
          >
            Edit
          </button>

          <button
            onClick={() => setDeleteId(row.id)}
            className="
              px-4 py-2
              rounded-xl
              text-white
              font-medium
              transition
              hover:scale-105
              bg-gradient-to-r
              from-red-500
              to-rose-600
            "
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div>
          <h1
            className="
              text-4xl font-bold
              bg-gradient-to-r
              from-violet-600
              via-indigo-600
              to-blue-600
              bg-clip-text
              text-transparent
            "
          >
            Templates
          </h1>

          <p className="text-slate-500 mt-1">
            Manage checklist templates
          </p>
        </div>

        <button
          onClick={() => navigate("/checklist/add")}
          className="
            px-5 py-3
            rounded-2xl
            text-white
            font-semibold
            shadow-lg
            transition-all
            hover:scale-105
            bg-gradient-to-r
            from-violet-600
            to-blue-600
          "
        >
          + Add Template
        </button>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div
              className="
                h-12 w-12
                border-4
                border-violet-200
                border-t-violet-600
                rounded-full
                animate-spin
              "
            />
            <p className="text-slate-500 font-medium">
              Loading templates...
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={templates}
          emptyMessage="No templates available"
        />
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-[400px]">
            <div className="text-center">
              <div className="text-5xl mb-3">⚠️</div>

              <h2 className="text-xl font-bold text-slate-800">
                Delete Template
              </h2>

              <p className="text-slate-500 mt-2 mb-6">
                Are you sure you want to delete this
                template? This action cannot be undone.
              </p>

              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="
                    px-5 py-2
                    rounded-xl
                    bg-slate-200
                    text-slate-700
                    hover:bg-slate-300
                    transition
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="
                    px-5 py-2
                    rounded-xl
                    text-white
                    transition
                    hover:scale-105
                    bg-gradient-to-r
                    from-red-500
                    to-rose-600
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}