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
  Label,
} from "recharts";

// Função auxiliar para escurecer uma cor hex (usada na borda das fatias)
const darkenColor = (hex, percent = 20) => {
  const f = parseInt(hex.slice(1), 16),
    t = 0,
    p = percent / 100,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
};

function ReportsCharts({ budgetReport, transactions }) {
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // 1. DADOS DO FLUXO DE CAIXA MENSAL
  const fluxoData = useMemo(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach((t) => {
      if (t.direction === "income" || t.direction === "IN" || t.direction === 0) {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    return [{ name: "Balanço Mensal", Receitas: income, Despesas: expense }];
  }, [transactions]);

  // 2. MAPEAMENTO DINÂMICO DE CORES DAS CATEGORIAS
  const categoryColorMap = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.category?.name && t.category?.color) {
        map[t.category.name] = t.category.color;
      }
    });
    return map;
  }, [transactions]);

  // 3. DADOS DE GASTOS POR CATEGORIA
  const categoryData = useMemo(() => {
    if (!budgetReport?.byCategory) return [];
    return budgetReport.byCategory.map((item) => ({
      name: item.categoryName,
      value: item.amount,
      percentage: item.percentage,
      color: categoryColorMap[item.categoryName] || "#6B7280",
    }));
  }, [budgetReport, categoryColorMap]);

  // 4. DADOS DE MOVIMENTAÇÃO POR CONTA
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

  // TOOLTIP DINÂMICO
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      // Lógica para o Gráfico de Pizza (Mantém o "perfeito" conforme solicitado)
      if (data.percentage !== undefined) {
        return (
          <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700 text-xs">
            <p className="font-semibold mb-1">{data.name}</p>
            <p className="text-red-400">
              Valor: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-gray-400 mt-0.5">Representa: {data.percentage}%</p>
          </div>
        );
      }

      // Lógica para os Gráficos de Barra (Demonstra relação Receita/Despesa com suas cores)
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700 text-xs">
          <p className="font-semibold mb-2">{data.name || "Resumo"}</p>
          <div className="space-y-1">
            {payload.map((p, index) => (
              <p key={index} className="font-medium" style={{ color: p.color }}>
                {p.name}: {formatCurrency(p.value)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* GRÁFICO 1: FLUXO DE CAIXA MENSAL */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-6">
          Fluxo de Caixa Mensal
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={fluxoData} 
              layout="vertical" 
              margin={{ top: 5, right: 30, left: 40, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
              <XAxis type="number" tickFormatter={(val) => `R$ ${val}`} style={{ fontSize: '11px', fill: '#9CA3AF' }}>
                <Label value="Montante (R$)" offset={-10} position="insideBottom" style={{ fontSize: '12px', fill: '#6B7280' }} />
              </XAxis>
              <YAxis 
                dataKey="name" 
                type="category" 
                style={{ fontSize: '11px', fill: '#374151', fontWeight: 600 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" />
              <Bar dataKey="Receitas" fill="#10B981" radius={[0, 4, 4, 0]} barSize={40} />
              <Bar dataKey="Despesas" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GRÁFICO 2: GASTOS POR CATEGORIA */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
            Gastos por Categoria
          </h3>
          <div className="h-72 w-full">
            {categoryData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Nenhuma despesa no período.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={darkenColor(entry.color, 15)} 
                        strokeWidth={1}
                        className="outline-none hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* GRÁFICO 3: MOVIMENTAÇÃO POR CONTA */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
            Movimentação por Conta
          </h3>
          <div className="h-72 w-full">
            {accountData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                Nenhuma movimentação no período.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={accountData} 
                  layout="vertical" 
                  margin={{ left: 20, right: 30, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                  <XAxis type="number" tickFormatter={(val) => `R$ ${val / 1000}k`} style={{ fontSize: '10px', fill: '#9CA3AF' }}>
                    <Label value="Total Acumulado" offset={-10} position="insideBottom" style={{ fontSize: '11px', fill: '#6B7280' }} />
                  </XAxis>
                  <YAxis type="category" dataKey="name" width={80} style={{ fontSize: '11px', fontWeight: 500 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Entradas" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12} />
                  <Bar dataKey="Saídas" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsCharts;