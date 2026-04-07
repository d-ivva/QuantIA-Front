import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TransacoesPage from './components/transactions/TransactionPage';
// import ContasPage from './components/contas/ContasPage';
// import CategoriasPage from './components/categorias/CategoriasPage';
 
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/transactions" replace />} />
        <Route path="/transactions" element={<TransacoesPage />} />
        {/* Próximas entregas */}
        {/* <Route path="/contas" element={<ContasPage />} /> */}
        {/* <Route path="/categorias" element={<CategoriasPage />} /> */}
      </Route>
    </Routes>
  );
}
 
export default App;
 