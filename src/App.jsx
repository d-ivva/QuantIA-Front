import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TransacoesPage from './components/transacoes/TransactionPage';
// import ContasPage from './components/contas/ContasPage';
// import CategoriasPage from './components/categorias/CategoriasPage';
 
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/transacoes" replace />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        {/* Próximas entregas */}
        {/* <Route path="/contas" element={<ContasPage />} /> */}
        {/* <Route path="/categorias" element={<CategoriasPage />} /> */}
      </Route>
    </Routes>
  );
}
 
export default App;
 