import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, XCircle, TrendingDown, Tag } from "lucide-react";
import { getBudgetReport } from "../../services/MonthlyBudgetService";

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value ?? 0);

function statusFromPercentage(pct) {
  if (pct >= 100) return { label: 'Limite ultrapassado', color: 'red',    Icon: XCircle };
  if (pct >= 80)  return { label: 'Atenção',             color: 'yellow', Icon: AlertTriangle };
  return                 { label: 'Dentro do limite',    color: 'green',  Icon: CheckCircle };
}

const barColor = {
  green:  'bg-emerald-500',
  yellow: 'bg-yellow-400',
  red:    'bg-red-500',
};

const badgeColor = {
  green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red:    'bg-red-50 text-red-700 border-red-200',
};

const iconColor = {
  green:  'text-emerald-500',
  yellow: 'text-yellow-500',
  red:    'text-red-500',
};

function MonthlyBudgetReport({ refreshKey }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear]   = useState(now.getFullYear());
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBudgetReport(month, year);
      setReport(data);
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => { load(); }, [load, refreshKey]);

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  const pct = report ? Math.min(report.percentageUsed, 100) : 0;
  const status = report?.hasBudget ? statusFromPercentage(report.percentageUsed) : null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* CABEÇALHO DO RELATÓRIO */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-gray-500" />
          <h2 className="text-sm font-semibold text-gray-700">Gastos × Limite do Mês</h2>
        </div>

        {/* SELETOR DE MÊS/ANO */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div className="flex gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              {MONTHS.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>

            <input
              type="number"
              value={year}
              min="2000"
              max="2100"
              onChange={(e) => setYear(Number(e.target.value))}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 w-20 outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={nextMonth}
            className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* CORPO */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
            Carregando...
          </div>
        ) : !report ? (
          <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
            Erro ao carregar relatório.
          </div>
        ) : !report.hasBudget ? (
          /* SEM LIMITE CADASTRADO */
          <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">
              Sem limite de gastos cadastrado para{' '}
              <span className="font-semibold">{MONTHS[month - 1]}/{year}</span>
            </p>
            {report.spentAmount > 0 && (
              <p className="text-xs text-gray-500">
                Você já gastou{' '}
                <span className="font-semibold text-red-600">
                  {formatCurrency(report.spentAmount)}
                </span>{' '}
                neste mês, mas não há limite definido para comparar.
              </p>
            )}
          </div>
        ) : (
          /* COM LIMITE CADASTRADO */
          <div className="space-y-5">
            {/* STATUS BADGE */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                {MONTHS[month - 1]} / {year}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${badgeColor[status.color]}`}>
                <status.Icon className={`w-3.5 h-3.5 ${iconColor[status.color]}`} />
                {status.label}
              </span>
            </div>

            {/* BARRA DE PROGRESSO */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Gasto: <span className="font-semibold text-gray-700">{formatCurrency(report.spentAmount)}</span></span>
                <span>Limite: <span className="font-semibold text-gray-700">{formatCurrency(report.budgetAmount)}</span></span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${barColor[status.color]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className={`font-semibold ${status.color === 'red' ? 'text-red-600' : 'text-gray-500'}`}>
                  {report.percentageUsed.toFixed(1)}% utilizado
                </span>
                <span className={`font-semibold ${report.remainingAmount < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {report.remainingAmount < 0
                    ? `${formatCurrency(Math.abs(report.remainingAmount))} acima do limite`
                    : `${formatCurrency(report.remainingAmount)} disponível`}
                </span>
              </div>
            </div>

            {/* GASTOS POR CATEGORIA */}
            {report.byCategory.length > 0 && (
              <div className="pt-2 border-t border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  Por categoria
                </p>
                <div className="space-y-2.5">
                  {report.byCategory.map((cat) => (
                    <div key={cat.categoryName}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700 truncate">{cat.categoryName}</span>
                        <span className="text-gray-500 ml-2 shrink-0">
                          {formatCurrency(cat.amount)}
                          <span className="text-gray-400 ml-1">({cat.percentage.toFixed(1)}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 bg-blue-400 rounded-full"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.byCategory.length === 0 && (
              <p className="text-xs text-gray-400 text-center pt-2">
                Nenhuma despesa registrada neste mês.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MonthlyBudgetReport;
