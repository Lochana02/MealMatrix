import React from "react";

const Topbar = () => {
  return (
    <header className="flex items-center justify-between border-b px-6 py-3 bg-surface">
      <h2 className="text-lg font-bold">Heirloom Ledger</h2>

      <div className="flex items-center gap-4">
        <input
          className="border rounded-lg px-3 py-2"
          placeholder="Search categories..."
        />
        <button>🔔</button>
        <button>👤</button>
      </div>
    </header>
  );
};

export default Topbar;