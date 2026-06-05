import { useNavigate } from "react-router-dom";

function ModuleCard({ title, description, path, icon, color = "blue" }) {
  const navigate = useNavigate();

  const colors = {
    blue: {
      card:
        "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700",
      button:
        "bg-white text-indigo-700 hover:bg-slate-100",
      icon: "text-white",
      glow: "bg-blue-300/20",
    },
    green: {
      card:
        "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600",
      button:
        "bg-white text-teal-700 hover:bg-slate-100",
      icon: "text-white",
      glow: "bg-emerald-300/20",
    },
  };

  return (
    <div
      onClick={() => navigate(path)}
      className={`
        relative
        overflow-hidden
        rounded-3xl
        p-6 sm:p-8
        cursor-pointer
        transition-all
        duration-300
        hover:scale-105
        hover:-translate-y-2
        shadow-xl
        hover:shadow-2xl
        ${colors[color].card}
        flex flex-col
        h-full
        text-white
      `}
    >
      {/* Decorative Glow */}
      <div
        className={`
          absolute
          -top-10
          -right-10
          w-40
          h-40
          rounded-full
          blur-3xl
          ${colors[color].glow}
        `}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {icon && (
          <div
            className={`
              mb-6
              ${colors[color].icon}
              transition-transform
              duration-300
              group-hover:scale-110
            `}
          >
            {icon}
          </div>
        )}

        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          {title}
        </h2>

        <p className="text-white/80 flex-grow text-sm sm:text-base leading-relaxed">
          {description}
        </p>

        <button
          className={`
            mt-6
            px-5
            py-3
            rounded-xl
            font-semibold
            transition-all
            duration-200
            w-full
            sm:w-auto
            shadow-md
            hover:shadow-lg
            ${colors[color].button}
          `}
        >
          Open Module →
        </button>
      </div>
    </div>
  );
}

export default ModuleCard;