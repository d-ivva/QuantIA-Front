import { useState, useEffect } from "react";
import { BarChart2 } from "lucide-react";
import { useToast } from "../../hooks/useToast"; 
import { getBudgetReport } from "../../services/MonthlyBudgetService";
import { getTransactions } from "../../services/TransactionService";
import ReportsSummary from "./ReportsSummary";
import ReportsCharts from "./ReportsCharts";
import ReportsFilters from "./ReportsFilters";

function ReportsPage() {
  const toast = useToast();
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  const [budgetReport, setBudgetReport] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Busca relatórios de meta e todas as transações em paralelo
      const [reportData, allTransactions] = await Promise.all([
        getBudgetReport(selectedMonth, selectedYear),
        getTransactions()
      ]);

      setBudgetReport(reportData);

      const filteredTransactions = allTransactions.filter(t => {
        if (!t.transactionDate) return false;
        const date = new Date(t.transactionDate);
        return date.getMonth() + 1 === selectedMonth && date.getFullYear() === selectedYear;
      });
      
      setTransactions(filteredTransactions);
    } catch (err) {
      console.error("Erro ao carregar dados do dashboard:", err);
      toast.error("Não foi possível carregar os dados do relatório mensais.");
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que o usuário mudar o mês ou o ano
  useEffect(() => {
    fetchDashboardData();
  }, [selectedMonth, selectedYear]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* HEADER (Idêntico ao padrão de TransactionsPage) */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-800">Relatórios</h1>
          </div>
          <p className="text-sm text-gray-500">
            Acompanhe seu fluxo de caixa, distribuição de despesas e projeções financeiras.
          </p>
        </div>
        
        <ReportsFilters 
          selectedMonth={selectedMonth} 
          onMonthChange={setSelectedMonth}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          disabled={loading}
        />
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL CENTRAL */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm text-gray-500 font-medium">Consolidando relatórios do período...</p>
        </div>
      ) : (
        <>
          {/* CARDS SUPERIORES */}
          <ReportsSummary 
            transactions={transactions} 
          />

          {/* GRÁFICOS INTERATIVOS */}
          <ReportsCharts 
            budgetReport={budgetReport} 
            transactions={transactions} 
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </>
      )}
    </div>
  );
}

export default ReportsPage;