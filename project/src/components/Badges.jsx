const MAP = {
  OPEN:        "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  CLOSED:      "bg-green-100 text-green-700",
};

const PRIORITY_MAP = {
  LOW:      "bg-slate-100 text-slate-600",
  MEDIUM:   "bg-yellow-100 text-yellow-700",
  HIGH:     "bg-orange-100 text-orange-700",
  CRITICAL: "bg-red-100 text-red-700",
};

export function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${MAP[status] ?? "bg-slate-100 text-slate-500"}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${PRIORITY_MAP[priority] ?? "bg-slate-100 text-slate-500"}`}>
      {priority}
    </span>
  );
}