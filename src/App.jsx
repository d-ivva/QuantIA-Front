import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Transactionpage from './components/transactions/TransactionPage';
import AccountPage from './components/accounts/AccountPage';
import CategoriesPage from "./components/categories/CategoriesPage";
import TransactionTypePage from "./components/transactionTypes/TransactionTypePage";
import MonthlyBudgetsPage from "./components/monthlyBudgets/MonthlyBudgetsPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/transactions" replace />} />
        <Route path="/transactions" element={<Transactionpage />} />
        <Route path="/accounts" element={<AccountPage />} />
        <Route path="/transaction-types" element={<TransactionTypePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/monthly-budgets" element={<MonthlyBudgetsPage />} />
      </Route>
    </Routes>
  );
}
 
export default App;
 