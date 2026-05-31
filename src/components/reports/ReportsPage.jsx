import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LineChart, BarChart, Bar, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, ReferenceLine, ReferenceArea
} from 'recharts';
import { Calendar, CreditCard, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getDashboardData, getAnnualReport } from '../../services/ReportsService';
import { getAccounts } from '../../services/AccountService';

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
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg outline-none relative z-50 min-w-[210px]">
        <p className="text-sm font-bold text-gray-700 mb-2 pb-2 border-b border-gray-100">Dia {data.day}</p>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>Receitas acum.:</span>
            <span className="text-emerald-600 font-bold">{formatCurrency(data.cumIncome)}</span>
          </p>
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 inline-block"/>Despesas acum.:</span>
            <span className="text-rose-600 font-bold">{formatCurrency(data.cumExpense)}</span>
          </p>
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500 inline-block"/>Saldo acum.:</span>
            <span className="text-indigo-600 font-bold">{formatCurrency(data.balance)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomAnnualTooltip = ({ active, payload, annualView }) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    const fullMonthName = new Date(0, d.month - 1).toLocaleString('pt-BR', { month: 'long' });
    const capitalizedMonth = fullMonthName.charAt(0).toUpperCase() + fullMonthName.slice(1);
    const isGeneral = annualView === 'general';
    const perfVal   = isGeneral ? d.balance : d.performance;

    return (
      <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg outline-none relative z-50 min-w-[210px]">
        <p className="text-sm font-bold text-gray-700 mb-2 pb-2 border-b border-gray-100">{capitalizedMonth}</p>
        <div className="space-y-1.5">
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Entradas:
            </span>
            <span className="text-emerald-600 font-bold">{formatCurrency(d.income)}</span>
          </p>
          <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              Saídas:
            </span>
            <span className="text-rose-600 font-bold">{formatCurrency(d.expense)}</span>
          </p>
          {!isGeneral && (
            <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                Meta de gastos:
              </span>
              {d.budgetAmount > 0
                ? <span className="text-amber-600 font-bold">{formatCurrency(d.budgetAmount)}</span>
                : <span className="text-gray-400 italic">Nenhuma meta cadastrada.</span>
              }
            </p>
          )}
          <div className="pt-1.5 mt-1 border-t border-gray-100">
            <p className="text-xs text-gray-500 font-medium flex items-center justify-between gap-4">
              <span>{isGeneral ? 'Saldo:' : 'Desempenho:'}</span>
              <span className={`${perfVal >= 0 ? 'text-emerald-600' : 'text-rose-600'} font-bold`}>
                {formatCurrency(perfVal)}
              </span>
            </p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};


function ReportsPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [annualData, setAnnualData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accountsLoading, setAccountsLoading] = useState(true);

  // Zoom / Pan state
  const [zoomLeft, setZoomLeft]   = useState('dataMin');
  const [zoomRight, setZoomRight] = useState('dataMax');
  const [refAreaLeft, setRefAreaLeft]   = useState('');
  const [refAreaRight, setRefAreaRight] = useState('');
  const [isSelecting, setIsSelecting]   = useState(false);
  const isZoomed = zoomLeft !== 'dataMin' || zoomRight !== 'dataMax';

  // Filtro de linha do gráfico de Fluxo de Caixa
  // 'all' | 'expense' | 'income' | 'balance'
  const [flowView, setFlowView] = useState('all');

  // Filtro de modo do gráfico Análise de Desempenho Mensal
  // 'general' = receita - despesa | 'budget' = desempenho vs limite
  const [annualView, setAnnualView] = useState('budget');

  // Carrega lista de contas uma única vez
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setAccountsLoading(true);
        const data = await getAccounts();
        setAccounts(data ?? []);
      } catch (error) {
        console.error('Erro ao carregar contas:', error);
        setAccounts([]);
      } finally {
        setAccountsLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dash, annual] = await Promise.all([
        getDashboardData(currentMonth, currentYear, selectedAccountId),
        getAnnualReport(currentYear, selectedAccountId)
      ]);

      if (dash && dash.dailyFlow) {
        dash.dailyFlow = dash.dailyFlow.map(d => ({
          ...d,
          day:     d.day     !== undefined ? d.day     : d.Day,
          income:  d.income  !== undefined ? d.income  : d.Income,
          expense: d.expense !== undefined ? d.expense : d.Expense,
          balance: d.balance !== undefined ? d.balance : (d.Balance || 0)
        }));
      }

      // Normaliza annualData para camelCase independente da versão do backend
      const normalizedAnnual = (annual ?? []).map(m => ({
        month:        m.month        ?? m.Month        ?? 0,
        monthName:    m.monthName    ?? m.MonthName    ?? '',
        income:       m.income       ?? m.Income       ?? 0,
        expense:      m.expense      ?? m.Expense      ?? 0,
        budgetAmount: m.budgetAmount ?? m.BudgetAmount ?? 0,
        balance:      m.balance      ?? m.Balance      ?? 0,
        performance:  m.performance  ?? m.Performance  ?? 0,
      }));

      setDashboardData(dash);
      setAnnualData(normalizedAnnual);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [currentMonth, currentYear, selectedAccountId]);

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

  const selectedAccountName = selectedAccountId
    ? (accounts.find(a => a.id === selectedAccountId)?.name ?? 'Conta')
    : 'Todos';

  // Dados cumulativos para o gráfico de Fluxo de Caixa
  const cumulativeFlow = dashboardData.dailyFlow.reduce((acc, d) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : { cumIncome: 0, cumExpense: 0 };
    acc.push({
      ...d,
      cumIncome:  prev.cumIncome  + (d.income  ?? 0),
      cumExpense: prev.cumExpense + (d.expense ?? 0),
    });
    return acc;
  }, []);

  // Handlers de zoom
  const handleZoomMouseDown = (e) => {
    if (e && e.activeLabel !== undefined) {
      setRefAreaLeft(e.activeLabel);
      setRefAreaRight(e.activeLabel);
      setIsSelecting(true);
    }
  };

  const handleZoomMouseMove = (e) => {
    if (isSelecting && e && e.activeLabel !== undefined) {
      setRefAreaRight(e.activeLabel);
    }
  };

  const handleZoomMouseUp = () => {
    if (!isSelecting) return;
    setIsSelecting(false);
    if (refAreaLeft === '' || refAreaRight === '' || refAreaLeft === refAreaRight) {
      setRefAreaLeft(''); setRefAreaRight('');
      return;
    }
    const l = Math.min(Number(refAreaLeft), Number(refAreaRight));
    const r = Math.max(Number(refAreaLeft), Number(refAreaRight));
    setZoomLeft(l);
    setZoomRight(r);
    setRefAreaLeft('');
    setRefAreaRight('');
  };

  const resetZoom = () => {
    setZoomLeft('dataMin');
    setZoomRight('dataMax');
    setRefAreaLeft('');
    setRefAreaRight('');
    setIsSelecting(false);
  };

  const panStep = () => {
    if (zoomLeft === 'dataMin') return 5;
    const range = Number(zoomRight) - Number(zoomLeft);
    return Math.max(1, Math.round(range * 0.4));
  };

  const panLeft = () => {
    if (zoomLeft === 'dataMin') return;
    const step = panStep();
    const newLeft  = Math.max(1, Number(zoomLeft)  - step);
    const newRight = Math.max(newLeft + 1, Number(zoomRight) - step);
    setZoomLeft(newLeft);
    setZoomRight(newRight);
  };

  const panRight = () => {
    if (zoomRight === 'dataMax') return;
    const step = panStep();
    const maxDay = cumulativeFlow.length;
    const newRight = Math.min(maxDay, Number(zoomRight) + step);
    const newLeft  = Math.min(newRight - 1, Number(zoomLeft)  + step);
    setZoomLeft(newLeft);
    setZoomRight(newRight);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Relatórios</h1>
          <p className="text-sm text-gray-500">
            Acompanhamento de fluxo financeiro, despesas por categoria e performance geral
            {selectedAccountId && (
              <span className="ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                {selectedAccountName}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Select de Mês */}
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

          {/* Select de Ano */}
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

          {/* Select de Conta */}
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <CreditCard className="w-4 h-4 text-gray-400" />
            <select
              value={selectedAccountId ?? ''}
              onChange={(e) => setSelectedAccountId(e.target.value ? Number(e.target.value) : null)}
              className="text-sm font-medium text-gray-700 bg-transparent outline-none cursor-pointer"
              disabled={accountsLoading}
            >
              <option value="">Todos</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
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
        {/* Fluxo de Caixa Diário — LineChart com Zoom/Pan */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-gray-900">Fluxo de Caixa Diário</h3>
              <p className="text-xs text-gray-400">Acumulado de receitas, despesas e saldo ao longo do mês</p>
            </div>
            {/* Controles: filtro de linha + zoom/pan */}
            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
              {/* Select de visualização */}
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
                {[
                  { value: 'all',     label: 'Todos' },
                  { value: 'income',  label: 'Receitas' },
                  { value: 'expense', label: 'Despesas' },
                  { value: 'balance', label: 'Saldo' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setFlowView(opt.value)}
                    className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                      flowView === opt.value
                        ? opt.value === 'income'  ? 'bg-emerald-500 text-white'
                          : opt.value === 'expense' ? 'bg-rose-500 text-white'
                          : opt.value === 'balance' ? 'bg-indigo-500 text-white'
                          : 'bg-gray-700 text-white'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Toolbar zoom/pan */}
              <div className="flex items-center gap-1">
                <button
                  onClick={panLeft}
                  disabled={!isZoomed}
                  title="Navegar para esquerda"
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={panRight}
                  disabled={!isZoomed}
                  title="Navegar para direita"
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={resetZoom}
                  disabled={!isZoomed}
                  title="Resetar zoom"
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                {!isZoomed && (
                  <span className="text-[10px] text-gray-400 ml-1 hidden sm:inline">Arraste p/ zoom</span>
                )}
                {isZoomed && (
                  <span className="text-[10px] text-blue-500 font-semibold ml-1 hidden sm:inline">
                    Dias {zoomLeft}–{zoomRight}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div
            className="h-80"
            style={{ userSelect: 'none' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={cumulativeFlow}
                margin={{ top: 10, right: 10, left: 15, bottom: 25 }}
                onMouseDown={handleZoomMouseDown}
                onMouseMove={handleZoomMouseMove}
                onMouseUp={handleZoomMouseUp}
                onMouseLeave={() => { if (isSelecting) { setIsSelecting(false); setRefAreaLeft(''); setRefAreaRight(''); } }}
              >
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.12}/>
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  allowDataOverflow
                  domain={[zoomLeft, zoomRight]}
                  type="number"
                  label={{ value: `Dias do Mês: ${capitalizedMonth}`, position: 'bottom', fill: '#94a3b8', fontSize: 11, offset: 5 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => {
                    if (Math.abs(v) >= 1000) return `R$${(v/1000).toFixed(0)}k`;
                    return `R$${v}`;
                  }}
                  width={72}
                  label={{ value: 'Acumulado (R$)', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10, offset: 10 }}
                />
                <Tooltip
                  content={<CustomDailyFlowTooltip />}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 2' }}
                />
                <Legend
                  verticalAlign="top"
                  height={32}
                  iconType="plainline"
                  iconSize={20}
                  formatter={(value) => <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{value}</span>}
                />

                {/* Linhas principais — condicionadas pelo filtro flowView */}
                <Line
                  name="Receitas"
                  type="monotone"
                  dataKey="cumIncome"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#10b981' }}
                  animationDuration={600}
                  hide={flowView !== 'all' && flowView !== 'income'}
                />
                <Line
                  name="Despesas"
                  type="monotone"
                  dataKey="cumExpense"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0, fill: '#f43f5e' }}
                  animationDuration={600}
                  hide={flowView !== 'all' && flowView !== 'expense'}
                />
                <Line
                  name="Saldo"
                  type="monotone"
                  dataKey="balance"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff', fill: '#6366f1' }}
                  strokeDasharray="6 3"
                  animationDuration={600}
                  hide={flowView !== 'all' && flowView !== 'balance'}
                />

                {/* Linha de referência no zero */}
                <ReferenceLine y={0} stroke="#e2e8f0" strokeWidth={1.5} />

                {/* ReferenceArea para seleção de zoom */}
                {isSelecting && refAreaLeft !== '' && refAreaRight !== '' && (
                  <ReferenceArea
                    x1={Math.min(Number(refAreaLeft), Number(refAreaRight))}
                    x2={Math.max(Number(refAreaLeft), Number(refAreaRight))}
                    strokeOpacity={0.4}
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.08}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Despesas por Categoria — PieChart (sem alteração) */}
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
        {/* Análise de Desempenho Mensal — BarChart com filtro de modo */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-gray-900">Análise de Desempenho Mensal em {currentYear}</h3>
              <p className="text-xs text-gray-400">
                {annualView === 'budget'
                  ? 'Diferença entre o limite de gastos e as despesas de cada mês'
                  : 'Diferença entre receitas e despesas de cada mês'}
              </p>
            </div>
            {/* Filtro de modo — mesmo estilo do Fluxo de Caixa */}
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0">
              {[
                { value: 'budget',  label: 'Com Limite' },
                { value: 'general', label: 'Geral' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setAnnualView(opt.value)}
                  className={`px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                    annualView === opt.value
                      ? 'bg-gray-700 text-white'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
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
                  tickFormatter={(v) => {
                    if (Math.abs(v) >= 1000) return `R$${(v / 1000).toFixed(0)}k`;
                    return `R$${v}`;
                  }}
                  width={80}
                  label={{ value: 'Valor em R$', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11, offset: 10 }}
                />
                <Tooltip cursor={{ fill: '#f1f5f9' }} content={<CustomAnnualTooltip annualView={annualView} />} />
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1.5} />
                <Bar
                  name={annualView === 'budget' ? 'Desempenho ' : 'Saldo Mensal'}
                  dataKey={annualView === 'budget' ? 'performance' : 'balance'}
                  radius={[4, 4, 4, 0]}
                >
                  {annualData.map((entry, index) => {
                    const val = annualView === 'budget' ? entry.performance : entry.balance;
                    return <Cell key={`cell-${index}`} fill={val >= 0 ? '#10b981' : '#f43f5e'} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mapa de Calor de Consumo (sem alteração) */}
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