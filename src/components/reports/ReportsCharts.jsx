function ReportsCharts({ transactions }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 flex items-center justify-center text-gray-400">
        <p className="text-sm font-medium">[Gráfico de Despesas por Categoria]</p>
      </div>
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-80 flex items-center justify-center text-gray-400">
        <p className="text-sm font-medium">[Gráfico de Gasto/Saldo por Conta]</p>
      </div>
    </div>
  );
}

export default ReportsCharts;