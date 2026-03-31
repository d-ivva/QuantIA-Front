# Frontend V2: Interface Profissional com Tailwind CSS e Lucide

**Disciplina:** Desenvolvimento de Sistemas Web

**Professor:** Matheus Cataneo

---

## Objetivos de Aprendizagem

Ao final deste módulo, você será capaz de:

- Instalar e configurar o **Tailwind CSS** em um projeto React + Vite
- Usar **utility classes** do Tailwind para estilizar componentes sem escrever CSS manual
- Instalar e utilizar ícones profissionais com **Lucide React**
- Implementar navegação entre páginas com **React Router**
- Criar **Modais** reutilizáveis para formulários e confirmações
- Implementar um sistema de **notificações (Toasts)** usando Context API
- Criar um **layout de sistema** com sidebar de navegação
- Entender e aplicar **Context API** e **Custom Hooks**

---

## 1. O que vamos usar e por quê

Antes de instalar qualquer coisa, vamos entender o que cada ferramenta faz e por que ela existe.

### 1.1. O que é o Tailwind CSS?

Na V1 do nosso frontend, estilizamos os componentes com **objetos de estilo inline** (aqueles `style={{ padding: '10px', backgroundColor: '#fff' }}`). Isso funciona, mas tem problemas:

- Os componentes ficam gigantes com muito CSS misturado no JSX
- Não existe reutilização — cada componente repete os mesmos estilos
- Não tem responsividade, hover, focus, animações de forma prática

O **Tailwind CSS** resolve isso com uma abordagem chamada **utility-first**: em vez de escrever CSS em arquivos separados, você aplica classes utilitárias diretamente no HTML/JSX.

**Comparação — Estilo inline vs Tailwind:**

```jsx
// ❌ V1: Estilo inline (verboso, sem hover/focus)
<button style={{
  padding: '10px 20px',
  backgroundColor: '#2563eb',
  color: '#fff',
  borderRadius: '8px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px'
}}>
  Salvar
</button>

// ✅ V2: Tailwind CSS (compacto, com hover e transição)
<button className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
  Salvar
</button>
```

**Como ler as classes do Tailwind:**

| Classe | O que faz | CSS equivalente |
|---|---|---|
| `px-5` | Padding horizontal | `padding-left: 1.25rem; padding-right: 1.25rem` |
| `py-2.5` | Padding vertical | `padding-top: 0.625rem; padding-bottom: 0.625rem` |
| `bg-blue-600` | Cor de fundo azul | `background-color: #2563eb` |
| `text-white` | Texto branco | `color: #ffffff` |
| `rounded-lg` | Bordas arredondadas | `border-radius: 0.5rem` |
| `text-sm` | Texto pequeno | `font-size: 0.875rem` |
| `hover:bg-blue-700` | Cor ao passar o mouse | `:hover { background-color: #1d4ed8 }` |
| `transition-colors` | Transição suave | `transition: color, background-color 150ms` |

**Dica:** Você não precisa decorar todas as classes. Consulte a [documentação do Tailwind](https://tailwindcss.com/docs) e use a busca — é muito rápido.

### 1.2. O que é o Lucide React?

Na V1, nossos botões tinham apenas texto: "Editar", "Deletar", "Cadastrar". Em sistemas profissionais, usamos **ícones** para tornar a interface mais intuitiva e visual.

**Lucide** é uma biblioteca de ícones open-source com centenas de ícones consistentes e bonitos. Cada ícone é um componente React que você importa e usa como qualquer outro componente.

```jsx
import { ShoppingCart, Pencil, Trash2, Plus } from 'lucide-react';

// Usar um ícone é como usar um componente
<button>
  <Plus className="w-4 h-4" />
  Novo Produto
</button>
```

**Vantagens do Lucide:**

- Ícones em SVG (vetoriais — não ficam pixelados em nenhum tamanho)
- Cada ícone é importado individualmente (não carrega a biblioteca inteira)
- Estilizáveis com Tailwind: `className="w-5 h-5 text-blue-600"`
- Galeria completa em: [lucide.dev/icons](https://lucide.dev/icons)

### 1.3. O que é o React Router?

Na V1, toda a aplicação vivia em um único componente `App.jsx`. Mas um sistema real tem **múltiplas páginas**: Produtos, Categorias, Detalhes, etc.

O **React Router** permite criar navegação entre páginas sem recarregar o navegador (SPA — Single Page Application). Ele controla qual componente é exibido com base na URL.

```
http://localhost:5173/produtos    → renderiza <ProdutosPage />
http://localhost:5173/categorias  → renderiza <CategoriasPage /> (futuro)
```

### 1.4. O que é um Modal?

Na V1, o formulário de produto ficava fixo no topo da página. Isso funciona, mas ocupa espaço e mistura "criar" com "listar".

Um **Modal** (ou dialog) é uma janela flutuante que aparece sobre o conteúdo da página. É a forma padrão de sistemas profissionais para:

- Formulários de criação/edição
- Confirmações de exclusão
- Exibição de detalhes

O modal tem um **backdrop** (fundo escurecido) que bloqueia a interação com o resto da página até que o usuário feche o modal.

### 1.5. O que é um Toast?

Na V1, usávamos `alert()` ou mensagens inline para avisar o usuário. Em sistemas profissionais, usamos **Toasts** — notificações temporárias que aparecem no canto da tela e desaparecem sozinhas.

**Tipos comuns de toast:**

- **Sucesso** (verde): "Produto cadastrado com sucesso!"
- **Erro** (vermelho): "Não foi possível salvar o produto."
- **Informação** (azul): "Lista atualizada."

### 1.6. O que é Context API?

Para o sistema de toasts funcionar, qualquer componente da aplicação precisa conseguir disparar uma notificação. Mas como fazer isso sem passar props por 5 níveis de componentes?

A **Context API** do React permite compartilhar dados entre componentes sem passar props manualmente. É como uma "variável global" controlada.

```
ToastProvider (no topo da aplicação)
    └── Layout
         └── ProdutosPage
              └── ProdutoFormModal
                   └── useToast()  ← acessa o contexto diretamente!
```

### 1.7. O que é um Custom Hook?

Um **Custom Hook** é uma função que encapsula lógica reutilizável. Em vez de cada componente acessar o Context diretamente, criamos um hook `useToast()` que simplifica o uso:

```jsx
// Sem hook (verboso)
import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';
const context = useContext(ToastContext);
context.success('Produto salvo!');

// Com hook (limpo)
import { useToast } from '../hooks/useToast';
const toast = useToast();
toast.success('Produto salvo!');
```

---

## 2. Instalando as Dependências

### 2.1. Parando o servidor

Se o servidor React estiver rodando, pare com `Ctrl + C`.

### 2.2. Instalando Tailwind CSS, Lucide e React Router

No terminal, dentro da pasta do frontend:

```bash
npm install tailwindcss @tailwindcss/postcss postcss lucide-react react-router-dom
```

**O que cada pacote faz:**

| Pacote | Função |
|---|---|
| `tailwindcss` | O framework CSS utility-first |
| `@tailwindcss/postcss` | Plugin que integra o Tailwind com o PostCSS (processador CSS do Vite) |
| `postcss` | Processador CSS — o Vite usa internamente para transformar seu CSS |
| `lucide-react` | Biblioteca de ícones como componentes React |
| `react-router-dom` | Sistema de rotas/navegação para React |

### 2.3. Configurando o PostCSS

Crie o arquivo `postcss.config.js` **na raiz do projeto** (ao lado do `package.json`):

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

**O que isso faz:** Diz ao Vite para processar o CSS usando o plugin do Tailwind. O Tailwind v4 usa essa abordagem CSS-first — não precisa de `tailwind.config.js`.

### 2.4. Configurando o CSS principal

Abra `src/index.css` e **substitua todo o conteúdo** por:

```css
@import "tailwindcss";

/* Animações customizadas */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
```

**O que mudou:**

- `@import "tailwindcss"` — carrega todo o Tailwind v4 (reset, utilitários, etc.)
- As animações serão usadas nos modais (`fade-in`) e nos toasts (`slide-in`)

### 2.5. Verificando que funciona

```bash
npm run dev
```

Se o servidor iniciar sem erros, a configuração está correta. A página pode parecer "quebrada" agora porque o Tailwind resetou os estilos — é normal, vamos reconstruir tudo.

---

## 3. Nova Estrutura de Pastas

Antes de escrever código, vamos organizar nosso projeto com uma estrutura profissional.

### 3.1. Criando as pastas

```bash
mkdir src\components\layout
mkdir src\components\ui
mkdir src\components\produtos
mkdir src\contexts
mkdir src\hooks
```

### 3.2. Entendendo a nova organização

```
src/
  main.jsx                         ← Ponto de entrada (BrowserRouter + ToastProvider)
  App.jsx                          ← Definição de rotas
  index.css                        ← Tailwind + animações

  components/
    layout/
      Layout.jsx                   ← Estrutura: sidebar + área principal
      Sidebar.jsx                  ← Menu lateral de navegação
    ui/
      Modal.jsx                    ← Modal genérico reutilizável
      ConfirmDialog.jsx            ← Modal de confirmação (deletar)
      Toast.jsx                    ← Componente de notificação individual
      ToastContainer.jsx           ← Container que posiciona os toasts
    produtos/
      ProdutosPage.jsx             ← Página: gerencia estado e orquestra tudo
      ProdutoTable.jsx             ← Tabela com busca
      ProdutoFormModal.jsx         ← Modal com o formulário de criar/editar
      ProdutoDeleteDialog.jsx      ← Confirmação de exclusão

  hooks/
    useToast.js                    ← Hook para disparar notificações

  contexts/
    ToastContext.jsx               ← Provider do sistema de notificações

  services/
    produtoService.js              ← Comunicação com a API (já existe da V1)
```

**Por que essa organização?**

- **`layout/`** — componentes que formam o "esqueleto" da aplicação (sidebar, header)
- **`ui/`** — componentes genéricos reutilizáveis que não dependem de regra de negócio
- **`produtos/`** — tudo relacionado à funcionalidade de produtos. Na leva 3, criaremos `categorias/` e `detalhes/` no mesmo padrão
- **`contexts/`** e **`hooks/`** — lógica compartilhada entre componentes

---

## 4. Sistema de Notificações (Toast)

Vamos começar pelo toast porque ele será usado por todos os outros componentes.

### 4.1. Criando o ToastContext

Crie o arquivo `src/contexts/ToastContext.jsx`:

```jsx
// src/contexts/ToastContext.jsx
import { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);

    // Remove automaticamente após 4 segundos
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg) => addToast('success', msg), [addToast]);
  const error = useCallback((msg) => addToast('error', msg), [addToast]);
  const info = useCallback((msg) => addToast('info', msg), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, removeToast, success, error, info }}>
      {children}
    </ToastContext.Provider>
  );
}
```

**O que cada parte faz:**

- `createContext()` — cria um "canal" de comunicação global
- `ToastProvider` — envolve a aplicação e fornece as funções de toast para todos os filhos
- `useCallback` — otimização: garante que as funções não são recriadas a cada render
- `addToast` — adiciona um toast ao array e agenda sua remoção em 4 segundos
- `success`, `error`, `info` — atalhos para os tipos de toast

### 4.2. Criando o Hook useToast

Crie o arquivo `src/hooks/useToast.js`:

```javascript
// src/hooks/useToast.js
import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}
```

**O que faz:** Encapsula o `useContext` e adiciona uma verificação de segurança — se alguém tentar usar `useToast()` fora do `ToastProvider`, recebe um erro claro em vez de um `undefined` misterioso.

### 4.3. Criando o componente Toast

Crie o arquivo `src/components/ui/Toast.jsx`:

```jsx
// src/components/ui/Toast.jsx
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const config = {
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50 border-green-400',
    text: 'text-green-800',
    iconColor: 'text-green-500',
  },
  error: {
    icon: XCircle,
    bg: 'bg-red-50 border-red-400',
    text: 'text-red-800',
    iconColor: 'text-red-500',
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-400',
    text: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
};

function Toast({ type, message, onClose }) {
  const { icon: Icon, bg, text, iconColor } = config[type] || config.info;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 shadow-lg ${bg} animate-slide-in`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${iconColor}`} />
      <span className={`flex-1 text-sm font-medium ${text}`}>{message}</span>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default Toast;
```

**Destaque — Classes Tailwind condicionais:**

Repare como usamos template strings para montar as classes dinamicamente:

```jsx
className={`flex items-center gap-3 ... ${bg} animate-slide-in`}
```

O `${bg}` será substituído por `bg-green-50 border-green-400` (sucesso), `bg-red-50 border-red-400` (erro), etc.

### 4.4. Criando o ToastContainer

Crie o arquivo `src/components/ui/ToastContainer.jsx`:

```jsx
// src/components/ui/ToastContainer.jsx
import { useToast } from '../../hooks/useToast';
import Toast from './Toast';

function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default ToastContainer;
```

**O que `fixed top-4 right-4 z-[60]` faz:**

- `fixed` — posição fixa na tela (não scrollável)
- `top-4 right-4` — 1rem do topo e da direita
- `z-[60]` — z-index 60 (acima dos modais que usam z-50)

---

## 5. Componentes de UI Reutilizáveis

### 5.1. Criando o Modal genérico

Crie o arquivo `src/components/ui/Modal.jsx`:

```jsx
// src/components/ui/Modal.jsx
import { useEffect } from 'react';
import { X } from 'lucide-react';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  // Fecha o modal ao pressionar Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Impede o scroll do body enquanto o modal está aberto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-xl shadow-2xl w-full ${sizes[size]} mx-4 animate-fade-in`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
```

**Conceitos importantes deste componente:**

- **Renderização condicional:** `if (!isOpen) return null` — o modal não existe no DOM quando fechado
- **Backdrop click:** clicar no fundo escuro fecha o modal
- **`e.stopPropagation()`** — impede que cliques dentro do modal sejam interpretados como cliques no backdrop
- **Escape key:** useEffect registra um listener de teclado quando o modal abre e remove quando fecha (cleanup function)
- **`document.body.style.overflow = 'hidden'`** — bloqueia o scroll da página enquanto o modal está aberto
- **`children`** — o conteúdo do modal é passado como children, tornando o Modal genérico e reutilizável

### 5.2. Criando o ConfirmDialog

Crie o arquivo `src/components/ui/ConfirmDialog.jsx`:

```jsx
// src/components/ui/ConfirmDialog.jsx
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-gray-600 text-sm">{message}</p>
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
```

**Composição de componentes:** O `ConfirmDialog` **reutiliza** o `Modal`. Ele não reimplementa a lógica do backdrop, do Escape, das animações — apenas adiciona o conteúdo específico de confirmação. Isso é um dos princípios mais importantes do React: **composição sobre repetição**.

---

## 6. Layout: Sidebar + Área Principal

### 6.1. Criando a Sidebar

Crie o arquivo `src/components/layout/Sidebar.jsx`:

```jsx
// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { Package, ShoppingCart, Tag, FileText } from 'lucide-react';

const menuItems = [
  { to: '/produtos', label: 'Produtos', icon: ShoppingCart, enabled: true },
  { to: '/categorias', label: 'Categorias', icon: Tag, enabled: false },
  { to: '/detalhes', label: 'Detalhes', icon: FileText, enabled: false },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col flex-shrink-0">
      {/* Logo / Título */}
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">GestãoPro</h1>
            <p className="text-xs text-gray-400">Gerenciador de Produtos</p>
          </div>
        </div>
      </div>

      {/* Menu de Navegação */}
      <nav className="flex-1 px-3 py-4">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Menu
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.to}>
              {item.enabled ? (
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              ) : (
                <span className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 cursor-not-allowed">
                  <item.icon className="w-5 h-5" />
                  {item.label}
                  <span className="ml-auto text-[10px] bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">
                    Em breve
                  </span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">Desenv. Sistemas Web</p>
        <p className="text-xs text-gray-600">Prof. Matheus Cataneo</p>
      </div>
    </aside>
  );
}

export default Sidebar;
```

**Conceitos importantes:**

- **`NavLink`** (do React Router) — funciona como um `<a>`, mas sem recarregar a página. Recebe uma função em `className` que tem acesso a `isActive` — se a rota atual bate com o `to`, o link é considerado ativo
- **Array de configuração (`menuItems`)** — em vez de repetir JSX para cada item do menu, definimos um array e usamos `.map()`. Isso facilita adicionar novas páginas no futuro
- **Items desabilitados** — "Categorias" e "Detalhes" aparecem no menu mas como `<span>` (não clicável), com uma badge "Em breve". Na leva 3, basta mudar `enabled: true`

### 6.2. Criando o Layout

Crie o arquivo `src/components/layout/Layout.jsx`:

```jsx
// src/components/layout/Layout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
```

**O que é o `<Outlet />`?**

O `Outlet` é um componente do React Router que funciona como um "placeholder". Ele renderiza o componente da rota filha atual. Por exemplo:

- Se a URL é `/produtos` → o Outlet renderiza `<ProdutosPage />`
- Se a URL é `/categorias` → o Outlet renderiza `<CategoriasPage />` (futuro)

O Layout permanece fixo (sidebar + fundo cinza), e apenas o conteúdo do Outlet muda.

---

## 7. Componentes de Produto

### 7.1. Criando a Tabela de Produtos

Crie o arquivo `src/components/produtos/ProdutoTable.jsx`:

```jsx
// src/components/produtos/ProdutoTable.jsx
import { Search, Pencil, Trash2, PackageOpen } from 'lucide-react';

function ProdutoTable({ produtos, searchTerm, onSearchChange, onEditar, onDeletar }) {
  // Filtra os produtos pelo termo de busca (nome ou descrição)
  const produtosFiltrados = produtos.filter((p) => {
    const termo = searchTerm.toLowerCase();
    return (
      p.nome.toLowerCase().includes(termo) ||
      (p.descricao && p.descricao.toLowerCase().includes(termo))
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Barra de busca */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>
      </div>

      {/* Tabela */}
      {produtosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <PackageOpen className="w-12 h-12 mb-3" />
          <p className="text-sm font-medium">
            {searchTerm
              ? 'Nenhum produto encontrado para esta busca.'
              : 'Nenhum produto cadastrado.'}
          </p>
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Nome
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Descrição
              </th>
              <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Preço
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Estoque
              </th>
              <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {produtosFiltrados.map((produto) => (
              <tr key={produto.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-gray-900">
                    {produto.nome}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">
                    {produto.descricao || '—'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-medium text-gray-900">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      produto.quantidade > 10
                        ? 'bg-green-100 text-green-800'
                        : produto.quantidade > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {produto.quantidade} un.
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditar(produto)}
                      title="Editar produto"
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeletar(produto)}
                      title="Deletar produto"
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProdutoTable;
```

**Destaques da tabela:**

- **Busca client-side:** o filtro roda no array que já está em memória (não faz nova chamada à API)
- **Badge de estoque colorida:** verde (>10), amarelo (1-10), vermelho (0) — o ternário encadeado escolhe as classes
- **Botões com ícones:** em vez de texto "Editar" e "Deletar", usamos ícones com `title` para tooltip
- **Empty state:** quando não há produtos, mostra um ícone e uma mensagem amigável

### 7.2. Criando o Modal do Formulário

Crie o arquivo `src/components/produtos/ProdutoFormModal.jsx`:

```jsx
// src/components/produtos/ProdutoFormModal.jsx
import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

function ProdutoFormModal({ isOpen, onClose, produtoEditando, onSalvar }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  // Preenche ou limpa o formulário quando o modal abre
  useEffect(() => {
    if (isOpen) {
      if (produtoEditando) {
        setNome(produtoEditando.nome || '');
        setDescricao(produtoEditando.descricao || '');
        setPreco(produtoEditando.preco?.toString() || '');
        setQuantidade(produtoEditando.quantidade?.toString() || '');
      } else {
        setNome('');
        setDescricao('');
        setPreco('');
        setQuantidade('');
      }
    }
  }, [isOpen, produtoEditando]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const produto = {
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
    };

    if (produtoEditando) {
      produto.id = produtoEditando.id;
    }

    onSalvar(produto);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={produtoEditando ? 'Editar Produto' : 'Novo Produto'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Produto
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Notebook Dell XPS 15"
            required
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">
            Descrição <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: 16GB RAM, SSD 512GB"
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">
              Preço (R$)
            </label>
            <input
              id="preco"
              type="number"
              step="0.01"
              min="0"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="0.00"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
          <div>
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">
              Quantidade
            </label>
            <input
              id="quantidade"
              type="number"
              min="0"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="0"
              required
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
          </div>
        </div>

        {/* Botões do formulário */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {produtoEditando ? 'Atualizar' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default ProdutoFormModal;
```

**Diferenças da V1:**

- O formulário agora vive dentro de um modal — não ocupa espaço permanente na página
- `grid grid-cols-2 gap-4` coloca Preço e Quantidade lado a lado
- Os inputs têm `focus:ring-2 focus:ring-blue-500` — um anel azul aparece ao focar (acessibilidade)
- O `useEffect` observa `isOpen` — limpa/preenche o form quando o modal abre

### 7.3. Criando o Diálogo de Exclusão

Crie o arquivo `src/components/produtos/ProdutoDeleteDialog.jsx`:

```jsx
// src/components/produtos/ProdutoDeleteDialog.jsx
import ConfirmDialog from '../ui/ConfirmDialog';

function ProdutoDeleteDialog({ isOpen, onClose, onConfirm, produto }) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Deletar Produto"
      message={
        produto
          ? `Tem certeza que deseja excluir o produto "${produto.nome}"? Esta ação não pode ser desfeita.`
          : ''
      }
    />
  );
}

export default ProdutoDeleteDialog;
```

### 7.4. Criando a Página de Produtos (orquestradora)

Crie o arquivo `src/components/produtos/ProdutosPage.jsx`:

```jsx
// src/components/produtos/ProdutosPage.jsx
import { useState, useEffect } from 'react';
import { Plus, RefreshCw, ShoppingCart } from 'lucide-react';
import {
  getProdutos,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from '../../services/produtoService';
import { useToast } from '../../hooks/useToast';
import ProdutoTable from './ProdutoTable';
import ProdutoFormModal from './ProdutoFormModal';
import ProdutoDeleteDialog from './ProdutoDeleteDialog';

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Controle dos modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [produtoDeletando, setProdutoDeletando] = useState(null);

  const toast = useToast();

  // Carrega produtos ao montar o componente
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const data = await getProdutos();
      setProdutos(data);
    } catch (error) {
      toast.error('Não foi possível carregar os produtos. Verifique se a API está rodando.');
      console.error('Erro ao carregar produtos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Abre o modal para criar novo produto
  const handleNovo = () => {
    setProdutoEditando(null);
    setIsFormModalOpen(true);
  };

  // Abre o modal para editar um produto existente
  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    setIsFormModalOpen(true);
  };

  // Salva (cria ou atualiza) um produto
  const handleSalvar = async (produto) => {
    try {
      if (produtoEditando) {
        await atualizarProduto(produto);
        toast.success(`Produto "${produto.nome}" atualizado com sucesso!`);
      } else {
        await criarProduto(produto);
        toast.success(`Produto "${produto.nome}" cadastrado com sucesso!`);
      }
      setIsFormModalOpen(false);
      setProdutoEditando(null);
      await carregarProdutos();
    } catch (error) {
      toast.error('Erro ao salvar o produto. Verifique os dados e tente novamente.');
      console.error('Erro ao salvar:', error);
    }
  };

  // Abre o diálogo de confirmação para deletar
  const handleConfirmarDelete = (produto) => {
    setProdutoDeletando(produto);
    setIsDeleteDialogOpen(true);
  };

  // Executa a deleção após confirmação
  const handleDeletar = async () => {
    try {
      await deletarProduto(produtoDeletando.id);
      toast.success(`Produto "${produtoDeletando.nome}" removido com sucesso!`);
      setIsDeleteDialogOpen(false);
      setProdutoDeletando(null);
      await carregarProdutos();
    } catch (error) {
      toast.error('Erro ao deletar o produto.');
      console.error('Erro ao deletar:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header da página */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Produtos</h1>
            <p className="text-sm text-gray-500">
              {produtos.length}{' '}
              {produtos.length === 1 ? 'produto cadastrado' : 'produtos cadastrados'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={carregarProdutos}
            title="Recarregar lista"
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleNovo}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-500">Carregando produtos...</span>
        </div>
      ) : (
        <ProdutoTable
          produtos={produtos}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEditar={handleEditar}
          onDeletar={handleConfirmarDelete}
        />
      )}

      {/* Modal de formulário (criar/editar) */}
      <ProdutoFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setProdutoEditando(null);
        }}
        produtoEditando={produtoEditando}
        onSalvar={handleSalvar}
      />

      {/* Diálogo de confirmação de exclusão */}
      <ProdutoDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setProdutoDeletando(null);
        }}
        onConfirm={handleDeletar}
        produto={produtoDeletando}
      />
    </div>
  );
}

export default ProdutosPage;
```

**Comparação com a V1:**

| Aspecto | V1 (App.jsx) | V2 (ProdutosPage.jsx) |
|---|---|---|
| Notificações | `setErro('mensagem')` + div inline | `toast.success('mensagem')` |
| Confirmação de delete | `window.confirm()` | Modal de confirmação |
| Formulário | Componente fixo na tela | Modal que abre/fecha |
| Feedback visual | Mensagem vermelha no topo | Toast animado no canto |
| Loading | Nenhum | Spinner animado |

---

## 8. Conectando Tudo: App.jsx e main.jsx

### 8.1. Reescrevendo o App.jsx

Abra `src/App.jsx` e **substitua todo o conteúdo** por:

```jsx
// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProdutosPage from './components/produtos/ProdutosPage';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/produtos" replace />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        {/* Leva 3: rotas para Categorias e Detalhes */}
        {/* <Route path="/categorias" element={<CategoriasPage />} /> */}
        {/* <Route path="/detalhes" element={<DetalheProdutoPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
```

**O que mudou:**

- O `App.jsx` deixou de ser o "dono" de tudo e passou a ser apenas o **roteador**
- `<Navigate to="/produtos" replace />` — redireciona a rota `/` para `/produtos`
- `<Route element={<Layout />}>` — todas as rotas filhas usam o Layout (sidebar + Outlet)
- As rotas comentadas são placeholder para a leva 3

### 8.2. Atualizando o main.jsx

Abra `src/main.jsx` e **substitua todo o conteúdo** por:

```jsx
// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
        <ToastContainer />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
```

**Por que essa ordem de wrappers importa:**

```
StrictMode          ← verificações extras do React (só em dev)
  └── BrowserRouter ← habilita rotas em toda a aplicação
       └── ToastProvider ← disponibiliza toasts para todos os componentes
            ├── App           ← as rotas e páginas
            └── ToastContainer ← renderiza os toasts (fora do App para ficar "por cima")
```

O `ToastContainer` fica **fora** do `App` para que os toasts apareçam sobre qualquer página, incluindo modais.

---

## 9. Limpeza dos Arquivos da V1

Os arquivos antigos da V1 não são mais usados. Você pode deletá-los:

- `src/components/ProdutoForm.jsx` — substituído por `ProdutoFormModal.jsx`
- `src/components/ProdutoList.jsx` — substituído por `ProdutoTable.jsx`
- `src/App.css` — substituído pelo Tailwind

---

## 10. Executando e Testando

### 10.1. Inicie a API .NET

```bash
cd C:\Projetos\MeuCrud\MeuCrud.Api
dotnet run
```

> Lembre-se: a porta do `produtoService.js` deve bater com a porta exibida no terminal.

### 10.2. Inicie o React

```bash
cd C:\Projetos\MeuCrud\meucrud-frontend
npm run dev
```

### 10.3. Testes no navegador

Abra **http://localhost:5173** e verifique:

- **Layout:** Sidebar escura à esquerda com o menu "Produtos" ativo (azul)
- **Tabela:** Lista de produtos com busca, badges de estoque coloridas
- **Criar:** Clique em "Novo Produto" → modal abre → preencha e cadastre → toast verde aparece
- **Editar:** Clique no ícone de lápis → modal abre preenchido → atualize → toast verde
- **Deletar:** Clique no ícone de lixeira → diálogo de confirmação → confirme → toast verde
- **Busca:** Digite no campo de busca e veja a tabela filtrar em tempo real
- **Empty state:** Se não houver produtos, deve aparecer o ícone de caixa vazia

---

## 11. Estrutura Final do Projeto V2

```
meucrud-frontend/
|-- src/
|   |-- components/
|   |   |-- layout/
|   |   |   |-- Layout.jsx
|   |   |   +-- Sidebar.jsx
|   |   |-- ui/
|   |   |   |-- Modal.jsx
|   |   |   |-- ConfirmDialog.jsx
|   |   |   |-- Toast.jsx
|   |   |   +-- ToastContainer.jsx
|   |   +-- produtos/
|   |       |-- ProdutosPage.jsx
|   |       |-- ProdutoTable.jsx
|   |       |-- ProdutoFormModal.jsx
|   |       +-- ProdutoDeleteDialog.jsx
|   |-- contexts/
|   |   +-- ToastContext.jsx
|   |-- hooks/
|   |   +-- useToast.js
|   |-- services/
|   |   +-- produtoService.js
|   |-- App.jsx
|   |-- main.jsx
|   +-- index.css
|-- postcss.config.js
|-- package.json
+-- vite.config.js
```

---

## 12. Resumo do Módulo

Neste módulo você:

- Instalou e configurou o **Tailwind CSS v4** com PostCSS
- Aprendeu a usar **utility classes** para estilizar sem CSS manual
- Instalou o **Lucide React** e usou ícones profissionais nos componentes
- Configurou o **React Router** para navegação com sidebar
- Criou um **Modal genérico reutilizável** com backdrop, Escape key e animação
- Criou um **ConfirmDialog** por composição (reutilizando o Modal)
- Implementou um **sistema de Toasts** usando Context API e Custom Hook
- Montou um **layout profissional** com sidebar de navegação
- Refatorou o CRUD de Produtos para usar modais, toasts e busca
- Preparou a estrutura para as funcionalidades da leva 3 (Categorias e Detalhes)
