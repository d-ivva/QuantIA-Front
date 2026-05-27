import React, { useState, useEffect, useCallback } from 'react';
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { Calendar } from 'lucide-react';
import { getDashboardData, getAnnualReport } from '../../services/ReportsService';

const darkenColor = (color) => {
  if (!color || !color.startsWith('#')) return 'rgba(0,0,0,0.2)';
  let hex = color.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  r = Math.max(0, r - 35);
  g = Math.max(0, g - 35);
  b = Math.max(0, b - 35);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg outline-none relative z-50 min-w-[180px]">
        <p className="text-sm font-bold text-gray-500 mb-2">{data.categoryName}</p>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span>Valor:</span>
            <span className="text-rose-600 font-bold">{formatCurrency(data.amount)}</span>
          </p>
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span>Representa:</span>
            <span className="text-rose-600 font-bold">{data.percentage}%</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomDailyFlowTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg outline-none relative z-50 min-w-[180px]">
        <p className="text-sm font-bold text-gray-500 mb-2">Dia: {data.day}</p>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span>Receitas:</span>
            <span className="text-emerald-600 font-bold">{formatCurrency(data.income)}</span>
          </p>
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span>Despesas:</span>
            <span className="text-rose-600 font-bold">{formatCurrency(data.expense)}</span>
          </p>
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span>Saldo:</span>
            <span className="text-indigo-600 font-bold">{formatCurrency(data.balance)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomAnnualTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const monthNum = data.month !== undefined ? data.month : data.Month;
    const fullMonthName = new Date(0, monthNum - 1).toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = fullMonthName.charAt(0).toUpperCase() + fullMonthName.slice(1);
    const performanceValue = data.performance !== undefined ? data.performance : data.Performance;

    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg outline-none relative z-50 min-w-[180px]">
        <p className="text-sm font-bold text-gray-500 mb-2">Mês: {capitalizedMonth}</p>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span>Desempenho:</span>
            <span className={`${performanceValue >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-bold`}>
              {formatCurrency(performanceValue)}
            </span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

function ReportsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dashboardData, setDashboardData] = useState(null);
  const [annualData, setAnnualData] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, annual] = await Promise.all([
        getDashboardData(currentMonth, currentYear),
        getAnnualReport(currentYear)
      ]);

      if (dash && dash.dailyFlow) {
        dash.dailyFlow = dash.dailyFlow.map(d => ({
          ...d,
          day: d.day !== undefined ? d.day : d.Day,
          income: d.income !== undefined ? d.income : d.Income,
          expense: d.expense !== undefined ? d.expense : d.Expense,
          balance: d.balance !== undefined ? d.balance : (d.Balance || 0)
        }));
      }

      setDashboardData(dash);
      setAnnualData(annual);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 font-medium">
        Carregando análises consolidadas...
      </div>
    );
  }

  const maxDayExpense = Math.max(...dashboardData.dailyFlow.map(d => d.expense), 1);
  const currentMonthName = new Date(currentYear, currentMonth - 1).toLocaleString('pt-BR', { month: 'long' });
  const capitalizedMonth = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Relatórios</h1>
          <p className="text-sm text-gray-500">Acompanhamento de fluxo financeiro, despesas por categoria e performance geral</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              className="text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
          <p className="text-sm font-medium text-emerald-700 mb-1">Receitas</p>
          <p className="text-2xl font-bold text-emerald-800">{formatCurrency(dashboardData.totalIncome)}</p>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-5">
          <p className="text-sm font-medium text-rose-700 mb-1">Despesas</p>
          <p className="text-2xl font-bold text-rose-800">{formatCurrency(dashboardData.totalExpense)}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm font-medium text-slate-600 mb-1">Saldo</p>
          <p className={`text-2xl font-bold ${dashboardData.netBalance >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
            {formatCurrency(dashboardData.netBalance)}
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="text-sm font-medium text-blue-700 mb-1">Conta com Maior Atividade</p>
          <p className="text-2xl font-bold text-blue-800 truncate">{dashboardData.mostMovedAccount}</p>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Fluxo de Caixa Diário</h3>
            <p className="text-xs text-gray-400">Receitas, despesas e saldo diário correspondente</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dashboardData.dailyFlow} barGap={0} barCategoryGap="25%" margin={{ top: 10, right: 10, left: 15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickMargin={10}
                  label={{ value: `Dias do Mês: ${capitalizedMonth}`, position: 'bottom', fill: '#94a3b8', fontSize: 11, offset: 5 }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `R$${v}`} 
                  width={80}
                  label={{ value: 'Valor em R$', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, offset: 10 }}
                />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomDailyFlowTooltip />} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar name="Receitas" dataKey="income" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar name="Despesas" dataKey="expense" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                <Line name="Saldo" type="monotone" dataKey="balance" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Despesas por Categoria</h3>
            <p className="text-xs text-gray-400">Distribuição proporcional das despesas por categoria</p>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <div className="absolute text-center pointer-events-none z-0">
              <p className="text-xs font-medium text-gray-400 uppercase">Total</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(dashboardData.totalExpense)}</p>
            </div>
            <ResponsiveContainer width="100%" height="100%" className="z-10">
              <PieChart>
                <Pie
                  data={dashboardData.byCategory}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {dashboardData.byCategory.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      stroke={darkenColor(entry.color)}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2 max-h-24 overflow-y-auto pr-2 scrollbar-thin relative z-0">
            {dashboardData.byCategory.map((cat, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded flex-shrink-0" style={{ backgroundColor: cat.color, border: `1px solid ${darkenColor(cat.color)}` }} />
                  <span className="text-gray-600 font-medium truncate max-w-[140px]">{cat.categoryName}</span>
                </div>
                <span className="text-gray-900 font-bold">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Análise de Desempenho Mensal em {currentYear}</h3>
            <p className="text-xs text-gray-400">Performance mensal com base no Limite de Gastos configurado</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={annualData} barCategoryGap="25%" margin={{ top: 10, right: 10, left: 15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="monthName" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickMargin={10}
                  label={{ value: 'Meses do Ano', position: 'bottom', fill: '#94a3b8', fontSize: 11, offset: 5 }}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(v) => `R$${v}`}
                  width={80}
                  label={{ value: 'Valor em R$', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, offset: 10 }} 
                />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomAnnualTooltip />} />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
                <Bar name="Desempenho" dataKey="performance" radius={[4, 4, 4, 4]}>
                  {annualData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.performance >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-2">
            <h3 className="text-base font-bold text-gray-900">Mapa de Calor de Consumo</h3>
            <p className="text-xs text-gray-400">Intensidade volumétrica de despesas por dia do mês atual</p>
          </div>
          <div className="grid grid-cols-7 gap-1.5 pt-4">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((dayLabel, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-gray-400 h-5 flex items-center justify-center">
                {dayLabel}
              </div>
            ))}
            {dashboardData.dailyFlow.map((day) => {
              const ratio = day.expense / maxDayExpense;
              let intensityClass = 'bg-slate-50 text-gray-400 border border-slate-100';
              if (day.expense > 0) {
                if (ratio < 0.25) intensityClass = 'bg-rose-50 text-rose-700 border border-rose-100';
                else if (ratio < 0.5) intensityClass = 'bg-rose-200 text-rose-900 border border-rose-300';
                else if (ratio < 0.75) intensityClass = 'bg-rose-400 text-white border border-rose-500';
                else intensityClass = 'bg-rose-600 text-white font-bold border border-rose-700';
              }
              return (
                <div
                  key={day.day}
                  className={`relative group h-9 rounded flex flex-col items-center justify-center text-[10px] transition-all cursor-default select-none ${intensityClass}`}
                >
                  <span>{day.day}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max bg-white p-3 border border-gray-200 shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
                        <span>Dia:</span>
                        <span className="text-gray-900 font-bold">{day.day}</span>
                      </p>
                      <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
                        <span>Valor:</span>
                        <span className="text-rose-600 font-bold">{formatCurrency(day.expense)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-5 text-[10px] text-gray-400 font-medium">
            <span>Menor Gasto</span>
            <span className="w-3 h-3 bg-rose-50 border border-rose-100 rounded-sm" />
            <span className="w-3 h-3 bg-rose-200 border border-rose-300 rounded-sm" />
            <span className="w-3 h-3 bg-rose-400 border border-rose-500 rounded-sm" />
            <span className="w-3 h-3 bg-rose-600 border border-rose-700 rounded-sm" />
            <span>Maior Gasto</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportsPage;