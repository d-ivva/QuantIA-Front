import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import Transactionpage from './components/transactions/TransactionPage';
import AccountPage from './components/accounts/AccountPage';
import CategoriesPage from "./components/categories/CategoriesPage";
import TransactionTypePage from "./components/transactionTypes/TransactionTypePage";
import MonthlyBudgetsPage from "./components/monthlyBudgets/MonthlyBudgetsPage";
import AiChatPage from "./components/aiChat/AiChatPage";
import AiConfigPage from "./components/aiConfig/AiConfigPage";
import ReportsPage from "./components/reports/ReportsPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/transactions" element={<Transactionpage />} />
        <Route path="/accounts" element={<AccountPage />} />
        <Route path="/transaction-types" element={<TransactionTypePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/monthly-budgets" element={<MonthlyBudgetsPage />} />
        <Route path="/ai-chat" element={<AiChatPage />} />
        <Route path="/ai-config" element={<AiConfigPage />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Route>
    </Routes>
  );
}
 
export default App;
 