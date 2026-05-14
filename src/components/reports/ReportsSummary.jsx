import { useMemo } from "react";

function ReportsSummary({ transactions }) {
  // Formata moeda no padrão brasileiro
  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value || 0);

  // Calcula Totais do Mês atual mantendo compatibilidade com as variações da API
  const { income, expense, balance } = useMemo(() => {
    const income = transactions
      .filter((t) => t.direction === "income" || t.direction === "IN" || t.direction === 0)
      .reduce((s, t) => s + t.amount, 0);

    const expense = transactions
      .filter((t) => t.direction === "expense" || t.direction === "OUT" || t.direction === 1)
      .reduce((s, t) => s + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* RECEITAS */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs text-emerald-700">Receitas</p>
        <p className="text-xl font-bold text-emerald-700">
          {formatCurrency(income)}
        </p>
      </div>

      {/* DESPESAS */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs text-red-700">Despesas</p>
        <p className="text-xl font-bold text-red-700">
          {formatCurrency(expense)}
        </p>
      </div>

      {/* SALDO */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-700">Saldo</p>
        <p
          className={`text-xl font-bold ${
            balance >= 0 ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
}

export default ReportsSummary;