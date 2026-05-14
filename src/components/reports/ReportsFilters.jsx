function ReportsFilters({ selectedMonth, onMonthChange, selectedYear, onYearChange, disabled }) {
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm">
      <select 
        value={selectedMonth} 
        onChange={(e) => onMonthChange(Number(e.target.value))}
        disabled={disabled}
        className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer"
      >
        {months.map((m, index) => (
          <option key={m} value={index + 1}>{m}</option>
        ))}
      </select>

      <div className="h-4 w-px bg-gray-200"></div>

      <input 
        type="number" 
        value={selectedYear}
        onChange={(e) => onYearChange(Number(e.target.value))}
        disabled={disabled}
        className="w-20 px-2 py-1.5 text-sm font-medium text-gray-700 bg-transparent outline-none"
        min="2000"
        max="2100"
      />
    </div>
  );
}

export default ReportsFilters;