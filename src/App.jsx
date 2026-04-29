import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Transactionpage from './components/transactions/TransactionPage';
import AccountPage from './components/accounts/AccountPage';
// import CategoriasPage from './components/categorias/CategoriasPage';
 
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/transactions" replace />} />
        <Route path="/transactions" element={<Transactionpage />} />
        <Route path="/accounts" element={<AccountPage />} />
        {/* Próximas entregas */}
        {/* <Route path="/categorias" element={<CategoriasPage />} /> */}
      </Route>
    </Routes>
  );
}
 
export default App;
 