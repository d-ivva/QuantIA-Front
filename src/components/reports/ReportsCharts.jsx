import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4", "#F97316"];

function ReportsCharts({ budgetReport, transactions }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const categoryData = useMemo(() => {
    if (!budgetReport?.byCategory) return [];
    return budgetReport.byCategory.map((item) => ({
      name: item.categoryName,
      value: item.amount,
      percentage: item.percentage,
    }));
  }, [budgetReport]);

  const accountData = useMemo(() => {
    const accMap = {};

    transactions.forEach((t) => {
      const accName = t.account?.name || "Outros";
      if (!accMap[accName]) {
        accMap[accName] = { name: accName, Entradas: 0, Saídas: 0 };
      }

      if (t.direction === "income" || t.direction === "IN" || t.direction === 0) {
        accMap[accName].Entradas += t.amount;
      } else {
        accMap[accName].Saídas += t.amount;
      }
    });

    return Object.values(accMap);
  }, [transactions]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700 text-xs">
          <p className="font-semibold mb-1">{data.name}</p>
          <p className="text-emerald-400">
            Valor: {formatCurrency(payload[0].value)}
          </p>
          {data.percentage !== undefined && (
            <p className="text-gray-400 mt-0.5">Representa: {data.percentage}%</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* GRÁFICO 1: GASTOS POR CATEGORIA (PIE/ROSCA) */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Distribuição por Categoria (Saídas)
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Identifique para onde está indo a maior parte do seu dinheiro.
          </p>
        </div>

        <div className="h-72 w-full">
          {categoryData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              Nenhuma despesa registrada para exibir no gráfico.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1200}
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="outline-none hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  iconType="circle" 
                  formatter={(value) => <span className="text-xs text-gray-600 font-medium">{value}</span>} 
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* GRÁFICO 2: ENTRADAS VS SAÍDAS POR CONTA (BARRAS) */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Movimentação por Conta
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Comparativo de Entradas (Verde) e Saídas (Vermelho) por carteira.
          </p>
        </div>

        <div className="h-72 w-full">
          {accountData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              Nenhuma movimentação bancária no período.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={accountData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis 
                  type="number" 
                  tickFormatter={(val) => `R$ ${val / 1000}k`}
                  style={{ fontSize: '10px', fill: '#9CA3AF' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  style={{ fontSize: '11px', fill: '#374151', fontWeight: 500 }}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), ""]} 
                  contentStyle={{ backgroundColor: '#111827', borderRadius: '8px', borderColor: '#374151' }}
                  labelStyle={{ color: '#fff', fontWeight: 600, fontSize: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend 
                  formatter={(value) => <span className="text-xs text-gray-600 font-medium">{value}</span>}
                />
                <Bar dataKey="Entradas" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} animationDuration={1000} />
                <Bar dataKey="Saídas" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={12} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportsCharts;