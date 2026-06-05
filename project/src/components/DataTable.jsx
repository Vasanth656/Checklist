export default function DataTable({ columns, data, emptyMessage = "No data found" }) {
  if (!data.length)
    return (
      <div className="text-center py-20 text-slate-400 text-lg">{emptyMessage}</div>
    );

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-5 py-3 font-semibold text-slate-600 ${
                  col.align === "right" ? "text-right" : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-slate-100 hover:bg-slate-50 transition"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-5 py-3 text-slate-700 ${
                    col.align === "right" ? "text-right" : ""
                  }`}
                >
                  {col.render ? col.render(row) : row[col.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}