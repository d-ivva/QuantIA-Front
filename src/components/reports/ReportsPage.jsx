import React, { useState, useEffect, useCallback } from 'react';
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
import { ArrowUpCircle, ArrowDownCircle, Scale, Building2, Calendar } from 'lucide-react';
import { getDashboardData, getAnnualReport } from '../../services/ReportsService';

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

  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const maxDayExpense = Math.max(...dashboardData.dailyFlow.map(d => d.expense), 1);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Análise Financeira Geral</h1>
          <p className="text-sm text-gray-500">Acompanhamento tático de fluxos, categorias e limites</p>
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

      {/* 1. KPIs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
            <ArrowUpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Receitas</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{formatCurrency(dashboardData.totalIncome)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 text-rose-600 rounded-lg">
            <ArrowDownCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Despesas</p>
            <p className="text-xl font-bold text-gray-900 mt-0.5">{formatCurrency(dashboardData.totalExpense)}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Saldo Líquido</p>
            <p className={`text-xl font-bold mt-0.5 ${dashboardData.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(dashboardData.netBalance)}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Conta Ativa</p>
            <p className="text-lg font-bold text-gray-900 mt-0.5 truncate max-w-[160px]">{dashboardData.mostMovedAccount}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Gráfico Diário de Fluxo de Caixa */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Fluxo de Caixa Diário</h3>
            <p className="text-xs text-gray-400">Entradas, saídas e comportamento de liquidez diária</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={dashboardData.dailyFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `R$${v}`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Bar name="Receitas" dataKey="income" fill="#10b981" radius={[3, 3, 0, 0]} />
                <Bar name="Despesas" dataKey="expense" fill="#f43f5e" radius={[3, 3, 0, 0]} />
                <Line name="Tendência" type="monotone" dataKey={(d) => d.income - d.expense} stroke="#6366f1" strokeWidth={2} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Donut de Categorias com cores dinâmicas */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Despesas por Categoria</h3>
            <p className="text-xs text-gray-400">Distribuição proporcional dos maiores gargalos de consumo</p>
          </div>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.byCategory}
                  dataKey="amount"
                  nameKey="categoryName"
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {dashboardData.byCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-xs font-medium text-gray-400 uppercase">Total Gasto</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(dashboardData.totalExpense)}</p>
            </div>
          </div>
          <div className="mt-4 space-y-1.5 max-h-24 overflow-y-auto pr-1">
            {dashboardData.byCategory.map((cat, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600 font-medium truncate max-w-[140px]">{cat.categoryName}</span>
                </div>
                <span className="text-gray-900 font-bold">{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. Gráfico Anual Divergente (Meta vs Desempenho) */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">Estou melhorando ou piorando?</h3>
            <p className="text-xs text-gray-400">Performance mensal com base no teto orçamentário configurado</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={annualData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="monthName" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
                <Bar dataKey="performance">
                  {annualData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.performance >= 0 ? '#10b981' : '#f43f5e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5. Gráfico de Calor (Heatmap de Intensidade de Gastos) */}
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
              let intensityClass = 'bg-slate-50 text-gray-400';
              if (day.expense > 0) {
                if (ratio < 0.25) intensityClass = 'bg-rose-50 text-rose-700';
                else if (ratio < 0.5) intensityClass = 'bg-rose-100 text-rose-800';
                else if (ratio < 0.75) intensityClass = 'bg-rose-300 text-white';
                else intensityClass = 'bg-rose-500 text-white font-bold';
              }
              return (
                <div
                  key={day.day}
                  title={`Dia ${day.day}: ${formatCurrency(day.expense)}`}
                  className={`h-9 rounded flex flex-col items-center justify-center text-[10px] transition-all cursor-default select-none ${intensityClass}`}
                >
                  <span>{day.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-end gap-1.5 mt-5 text-[10px] text-gray-400 font-medium">
            <span>Menor Gasto</span>
            <span className="w-2.5 h-2.5 bg-rose-50 rounded" />
            <span className="w-2.5 h-2.5 bg-rose-100 rounded" />
            <span className="w-2.5 h-2.5 bg-rose-300 rounded" />
            <span className="w-2.5 h-2.5 bg-rose-500 rounded" />
            <span>Maior Gasto</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ReportsPage;