import { useState, useEffect, useMemo } from "react";
import {
  Plus,
  RefreshCw,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  Scale,
} from "lucide-react";
import {
  getTransacoes,
  criarTransacao,
  getContas,
  getCategorias,
  getTiposTransacao,
} from "../../services/TransactionService";
import { useToast } from "../../hooks/useToast";
import TransacaoTable from "./TransactionTable";
import TransacaoFormModal from "./TransactionFormModal";
import TransacaoDeleteDialog from "./TransactionDeleteDialog";

function ResumoCard({ label, valor, icon: Icon, colorClass }) {
  const formatarMoeda = (v) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(v);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center ${colorClass}`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-bold text-gray-800 mt-0.5">
          {formatarMoeda(valor)}
        </p>
      </div>
    </div>
  );
}

function TransacoesPage() {
  const [transacoes, setTransacoes] = useState([]);
  const [contas, setContas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposTransacao, setTiposTransacao] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transacaoEditando, setTransacaoEditando] = useState(null);
  const [transacaoDeletando, setTransacaoDeletando] = useState(null);

  const toast = useToast();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [t, c, cat, tipos] = await Promise.all([
        getTransacoes(),
        getContas(),
        getCategorias(),
        getTiposTransacao(),
      ]);
      setTransacoes(t);
      setContas(c);
      setCategorias(cat);
      setTiposTransacao(tipos);
    } catch (err) {
      toast.error(
        "Não foi possível carregar os dados. Verifique se a API está rodando.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Totais calculados no frontend
  const { totalReceitas, totalDespesas, saldo } = useMemo(() => {
    const totalReceitas = transacoes
      .filter((t) => t.direction === "income")
      .reduce((s, t) => s + t.amount, 0);
    const totalDespesas = transacoes
      .filter((t) => t.direction === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
    };
  }, [transacoes]);

  const handleNovo = () => {
    setTransacaoEditando(null);
    setIsFormModalOpen(true);
  };

  const handleEditar = (transacao) => {
    setTransacaoEditando(transacao);
    setIsFormModalOpen(true);
  };

  const handleSalvar = async (transacao) => {
    try {
      await criarTransacao(transacao);
      toast.success("Transação lançada com sucesso!");
      setIsFormModalOpen(false);
      setTransacaoEditando(null);
      await carregarDados();
    } catch (err) {
      toast.error(
        "Erro ao salvar a transação. Verifique os dados e tente novamente.",
      );
      console.error(err);
    }
  };

  const handleConfirmarDelete = (transacao) => {
    setTransacaoDeletando(transacao);
    setIsDeleteDialogOpen(true);
  };

  const handleDeletar = async () => {
    toast.info("Exclusão de transações ainda não está disponível na API.");
    setIsDeleteDialogOpen(false);
    setTransacaoDeletando(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <ArrowLeftRight className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Transações</h1>
            <p className="text-sm text-gray-500">
              {transacoes.length}{" "}
              {transacoes.length === 1 ? "lançamento" : "lançamentos"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={carregarDados}
            title="Recarregar"
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleNovo}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ResumoCard
          label="Total Receitas"
          valor={totalReceitas}
          icon={TrendingUp}
          colorClass="bg-emerald-100 text-emerald-600"
        />
        <ResumoCard
          label="Total Despesas"
          valor={totalDespesas}
          icon={TrendingDown}
          colorClass="bg-red-100 text-red-600"
        />
        <ResumoCard
          label="Saldo"
          valor={saldo}
          icon={Scale}
          colorClass={
            saldo >= 0
              ? "bg-blue-100 text-blue-600"
              : "bg-orange-100 text-orange-600"
          }
        />
      </div>

      {/* Tabela ou loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-emerald-500 animate-spin" />
          <span className="ml-3 text-gray-500">Carregando transações...</span>
        </div>
      ) : (
        <TransacaoTable
          transacoes={transacoes}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEditar={handleEditar}
          onDeletar={handleConfirmarDelete}
        />
      )}

      {/* Modal de formulário */}
      <TransacaoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setTransacaoEditando(null);
        }}
        transacaoEditando={transacaoEditando}
        onSalvar={handleSalvar}
        contas={contas}
        categorias={categorias}
        tiposTransacao={tiposTransacao} 
      />

      {/* Diálogo de confirmação */}
      <TransacaoDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setTransacaoDeletando(null);
        }}
        onConfirm={handleDeletar}
        transacao={transacaoDeletando}
      />
    </div>
  );
}

export default TransacoesPage;
