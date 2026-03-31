# Frontend: React consumindo a API

**Disciplina:** Desenvolvimento de Sistemas Web

**Professor:** Matheus Cataneo

---

## Objetivos de Aprendizagem

Ao final deste módulo, você será capaz de:

- Criar um projeto React com Vite e entender a estrutura gerada
- Compreender os conceitos de componentes, props e estado (state)
- Usar os Hooks `useState` e `useEffect` para gerenciar dados
- Criar um serviço de comunicação com a API usando Axios
- Construir componentes de formulário e listagem com operações CRUD completas
- Integrar o frontend React com o backend .NET, executando os dois simultaneamente

---

## 1. Conceitos Fundamentais do React

Antes de escrever qualquer código, precisamos entender os blocos de construção do React. Esta seção é essencial — não a pule.

### 1.1. O que é o React?

React é uma biblioteca JavaScript desenvolvida pelo Meta (Facebook) para construir interfaces de usuário. Sua ideia central é dividir a interface em **componentes** — peças reutilizáveis e independentes.

Pense em uma página web como um Lego: cada botão, cada formulário, cada tabela é uma peça (componente). Você monta a página encaixando essas peças. Se uma peça muda, apenas aquela peça é atualizada na tela — o React cuida disso de forma eficiente.

### 1.2. O que é um Componente?

Um componente React é uma função JavaScript que retorna JSX — uma sintaxe especial que mistura JavaScript com estruturas parecidas com HTML.

**Exemplo:**

```jsx
// Um componente simples
function Saudacao({ nome }) {
    return <h1>Olá, {nome}!</h1>;
}

// Usando o componente
<Saudacao nome="Maria" />
```

**Regras dos componentes:**

- O nome deve começar com letra maiúscula (`Saudacao`, não `saudacao`)
- Deve retornar um único elemento raiz (ou um Fragment `<>...</>`)
- Arquivos de componentes têm extensão `.jsx`

### 1.3. O que é JSX?

JSX (JavaScript XML) é uma extensão de sintaxe do JavaScript que permite escrever estruturas semelhantes a HTML dentro do código. O Vite/Babel converte JSX em chamadas JavaScript puras antes de enviar ao navegador.

```jsx
// Isso é JSX:
const elemento = <h1 className="titulo">Bem-vindo!</h1>;

// O que o compilador gera (JavaScript puro):
const elemento = React.createElement("h1", { className: "titulo" }, "Bem-vindo!");
```

**Diferenças importantes do JSX em relação ao HTML:**

- `class` → `className` (pois `class` é palavra reservada em JavaScript)
- `for` → `htmlFor` (nos labels)
- Atributos em camelCase: `onclick` → `onClick`, `onchange` → `onChange`
- Expressões JavaScript entre chaves: `{variavel}`, `{2 + 2}`, `{condicao ? 'sim' : 'nao'}`

### 1.4. O que são Props?

Props (properties) são dados passados de um componente pai para um componente filho. São como argumentos de função.

```jsx
// Componente filho que recebe props
function CartaoProduto({ nome, preco, onDeletar }) {
    return (
        <div>
            <h3>{nome}</h3>
            <p>R$ {preco.toFixed(2)}</p>
            <button onClick={onDeletar}>Deletar</button>
        </div>
    );
}

// Componente pai passando props
function ListaProdutos() {
    return (
        <CartaoProduto
            nome="Notebook Dell"
            preco={4500}
            onDeletar={() => console.log('deletar!')}
        />
    );
}
```

Props são **imutáveis** — um componente filho não pode alterar as props recebidas. Se precisar de dados que mudam, use **state**.

### 1.5. O que é State (Estado)?

O state (estado) são dados internos de um componente que podem mudar ao longo do tempo. Quando o state muda, o React re-renderiza automaticamente o componente com os novos dados.

**O Hook `useState` cria uma variável de estado:**

```jsx
import { useState } from 'react';

function Contador() {
    const [contagem, setContagem] = useState(0);

    return (
        <div>
            <p>Cliques: {contagem}</p>
            <button onClick={() => setContagem(contagem + 1)}>
                Incrementar
            </button>
        </div>
    );
}
```

**Regra fundamental:** nunca modifique o estado diretamente (`contagem = contagem + 1` não funciona). Sempre use a função de atualização (`setContagem(contagem + 1)`).

### 1.6. O que é o Hook useEffect?

O `useEffect` permite executar "efeitos colaterais" em componentes — operações que afetam algo fora do componente, como buscar dados de uma API, configurar temporizadores ou manipular o DOM diretamente.

```jsx
import { useState, useEffect } from 'react';

function ListaProdutos() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        // Substitua pela URL onde a SUA API está rodando
        fetch('http://localhost:PORTA/api/produtos')
            .then(res => res.json())
            .then(data => setProdutos(data));
    }, []);

    return (
        <ul>
            {produtos.map(p => <li key={p.id}>{p.nome}</li>)}
        </ul>
    );
}
```

**O array de dependências controla quando o efeito roda:**

- `[]` (vazio): executa apenas uma vez, quando o componente é montado
- `[variavel]`: executa sempre que `variavel` mudar
- Sem array: executa após cada renderização (pode causar loops)

---

## 2. Criando o Projeto React

### 2.1. Criando o projeto com Vite

Abra um novo terminal (mantenha a API .NET rodando no terminal anterior — ou vamos iniciá-la novamente depois).

Navegue até a pasta raiz do projeto:

```bash
cd C:\Projetos\MeuCrud
```

Crie o projeto React com Vite:

```bash
npm create vite@latest meucrud-frontend -- --template react
```

**Explicando cada parte:**

- `npm create vite@latest` → usa o criador de projetos do Vite na versão mais recente
- `meucrud-frontend` → nome da pasta que será criada
- `--` → separador indicando que os próximos argumentos são do script, não do npm
- `--template react` → usa o template React com JavaScript puro (sem TypeScript)

### 2.2. Instalando as dependências

```bash
cd meucrud-frontend
npm install
```

O comando `npm install` lê o arquivo `package.json` e baixa todas as dependências para a pasta `node_modules`. Esse processo pode demorar alguns minutos na primeira vez.

### 2.3. Verificando que funciona

```bash
npm run dev
```

Abra no navegador: **http://localhost:5173**

Você verá a página padrão do Vite + React. Se aparecer, está funcionando.

Pressione `Ctrl + C` para parar por enquanto.

### 2.4. Instalando o Axios

O Axios é uma biblioteca para fazer requisições HTTP de forma simples e elegante. Ele é mais prático que o `fetch` nativo por:

- Converter automaticamente JSON para objetos JavaScript
- Ter tratamento de erros mais intuitivo
- Suportar interceptores de requisição/resposta
- Permitir cancelamento de requisições

```bash
npm install axios
```

### 2.5. Entendendo a estrutura do projeto gerado

Abra o VS Code na pasta do frontend:

```bash
code .
```

**Estrutura gerada pelo Vite:**

```
meucrud-frontend/
|-- node_modules/       <- NUNCA edite arquivos aqui. São dependências.
|-- public/             <- Arquivos estáticos (favicon, etc.)
|-- src/                <- TODO SEU CÓDIGO FICA AQUI
|   |-- App.jsx         <- Componente raiz
|   |-- App.css         <- Estilos do App
|   |-- main.jsx        <- Ponto de entrada do React
|   +-- index.css       <- Estilos globais
|-- index.html          <- HTML base com a div "root"
|-- package.json        <- Dependências e scripts
+-- vite.config.js      <- Configuração do Vite
```

**Como funciona o fluxo de inicialização:**

1. O navegador carrega o `index.html`
2. `index.html` importa `src/main.jsx`
3. `main.jsx` monta o `App` dentro da div `root`
4. `App` renderiza os demais componentes

### 2.6. Entendendo o main.jsx

O arquivo `src/main.jsx` é o ponto de entrada da aplicação React. Ele já vem pronto e **não precisa ser alterado**. Mas é importante entender o que faz:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**O que cada linha faz:**

- `createRoot(document.getElementById('root'))` → conecta o React à div `root` do `index.html`
- `.render(<App />)` → renderiza o componente `App` dentro dessa div
- `<StrictMode>` → ativa verificações extras durante o desenvolvimento (boas práticas)
- `import './index.css'` → carrega os estilos globais

---

## 3. Limpando os arquivos padrão

O Vite gera código de exemplo que não precisamos. Vamos limpar.

### 3.1. Substituindo o index.css

Abra `src/index.css` e substitua todo o conteúdo por:

```css
/* src/index.css */
/* Reset básico e estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
  color: #333;
  line-height: 1.6;
}
```

### 3.2. Limpando o App.css

Abra `src/App.css` e **delete todo o conteúdo** — deixe o arquivo vazio ou delete-o completamente.

> **Atenção:** Se você optar por **deletar** o arquivo `App.css`, lembre-se de remover também a linha `import './App.css'` do arquivo `App.jsx` quando formos editá-lo. Caso contrário, o React vai dar erro ao tentar importar um arquivo que não existe.

---

## 4. Criando o Serviço de API

Vamos organizar toda a comunicação com a API em um arquivo separado, seguindo separação de responsabilidades: os componentes React não precisam saber como as requisições HTTP são feitas.

### 4.1. Criando a estrutura de pastas

Dentro de `src`, crie a pasta `services`:

```bash
mkdir src\services
```

### 4.2. Criando o produtoService.js

Crie o arquivo `src/services/produtoService.js` com o conteúdo abaixo.

> **Importante:** A URL base (`API_URL`) deve apontar para o endereço onde a **sua** API .NET está rodando. A porta pode variar dependendo da configuração do seu projeto — verifique a mensagem `Now listening on: http://localhost:PORTA` que aparece ao rodar `dotnet run`. No exemplo abaixo usamos a porta `5217`, mas **substitua pela porta da sua API**.

```javascript
// src/services/produtoService.js
import axios from 'axios';

// ATENÇÃO: substitua a porta abaixo pela porta onde a SUA API está rodando.
// Verifique o terminal do dotnet run para confirmar.
const API_URL = 'http://localhost:5217/api/produtos';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProdutos = async () => {
  const response = await api.get('/');
  return response.data;
};

export const getProduto = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const criarProduto = async (produto) => {
  const response = await api.post('/', produto);
  return response.data;
};

export const atualizarProduto = async (produto) => {
  const response = await api.put('/', produto);
  return response.data;
};

export const deletarProduto = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
```

**O que cada função faz:**

| Função | Método HTTP | O que faz |
|---|---|---|
| `getProdutos` | GET | Busca todos os produtos |
| `getProduto` | GET | Busca um produto pelo ID |
| `criarProduto` | POST | Cria um novo produto |
| `atualizarProduto` | PUT | Atualiza um produto existente |
| `deletarProduto` | DELETE | Remove um produto pelo ID |

---

## 5. Criando os Componentes

Vamos criar dois componentes separados:

- **ProdutoForm** — responsável pela entrada de dados (criar e editar)
- **ProdutoList** — responsável pela exibição e ações sobre a lista

### 5.1. Criando a pasta de componentes

```bash
mkdir src\components
```

### 5.2. Criando o ProdutoForm.jsx

Crie o arquivo `src/components/ProdutoForm.jsx`. Este componente exibe o formulário para cadastrar novos produtos e também para editar produtos existentes.

```jsx
// src/components/ProdutoForm.jsx
import { useState, useEffect } from 'react';

function ProdutoForm({ produtoEditando, onSalvar, onCancelar }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');

  // Quando receber um produto para editar, preenche o formulário
  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.nome || '');
      setDescricao(produtoEditando.descricao || '');
      setPreco(produtoEditando.preco || '');
      setQuantidade(produtoEditando.quantidade || '');
    } else {
      limparFormulario();
    }
  }, [produtoEditando]);

  const limparFormulario = () => {
    setNome('');
    setDescricao('');
    setPreco('');
    setQuantidade('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const produto = {
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
    };

    // Se estiver editando, inclui o ID no objeto
    if (produtoEditando) {
      produto.id = produtoEditando.id;
    }

    onSalvar(produto);
    limparFormulario();
  };

  return (
    <div style={styles.container}>
      <h2>{produtoEditando ? 'Editar Produto' : 'Novo Produto'}</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.campo}>
          <label htmlFor="nome">Nome:</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="descricao">Descrição:</label>
          <input
            id="descricao"
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="preco">Preço:</label>
          <input
            id="preco"
            type="number"
            step="0.01"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.campo}>
          <label htmlFor="quantidade">Quantidade:</label>
          <input
            id="quantidade"
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.botoes}>
          <button type="submit" style={styles.btnSalvar}>
            {produtoEditando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {produtoEditando && (
            <button type="button" onClick={onCancelar} style={styles.btnCancelar}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '10px',
  },
  campo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
  },
  botoes: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px',
  },
  btnSalvar: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  btnCancelar: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default ProdutoForm;
```

**Conceitos usados neste componente:**

- **Props:** recebe `produtoEditando`, `onSalvar` e `onCancelar` do componente pai
- **useState:** cada campo do formulário tem seu próprio estado
- **useEffect:** observa `produtoEditando` — quando muda, preenche o formulário com os dados do produto
- **handleSubmit:** previne o reload da página (`e.preventDefault()`) e chama `onSalvar` com os dados
- **Estilos inline:** usamos um objeto `styles` para manter o CSS organizado dentro do componente

### 5.3. Criando o ProdutoList.jsx

Crie o arquivo `src/components/ProdutoList.jsx`. Este componente exibe a tabela com todos os produtos e os botões de ação.

```jsx
// src/components/ProdutoList.jsx

function ProdutoList({ produtos, onEditar, onDeletar }) {
  if (produtos.length === 0) {
    return (
      <p style={{ textAlign: 'center', color: '#888' }}>
        Nenhum produto cadastrado.
      </p>
    );
  }

  return (
    <div style={styles.container}>
      <h2>Produtos Cadastrados</h2>
      <table style={styles.tabela}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Nome</th>
            <th style={styles.th}>Descrição</th>
            <th style={styles.th}>Preço</th>
            <th style={styles.th}>Qtd</th>
            <th style={styles.th}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td style={styles.td}>{produto.id}</td>
              <td style={styles.td}>{produto.nome}</td>
              <td style={styles.td}>{produto.descricao || '-'}</td>
              <td style={styles.td}>R$ {produto.preco.toFixed(2)}</td>
              <td style={styles.td}>{produto.quantidade}</td>
              <td style={styles.td}>
                <button
                  onClick={() => onEditar(produto)}
                  style={styles.btnEditar}
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeletar(produto.id)}
                  style={styles.btnDeletar}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  tabela: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: '12px 8px',
    textAlign: 'left',
    borderBottom: '2px solid #dee2e6',
    fontSize: '14px',
  },
  td: {
    padding: '10px 8px',
    borderBottom: '1px solid #dee2e6',
    fontSize: '14px',
  },
  btnEditar: {
    padding: '6px 12px',
    backgroundColor: '#2196F3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '6px',
    fontSize: '13px',
  },
  btnDeletar: {
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};

export default ProdutoList;
```

**Conceitos usados neste componente:**

- **Props:** recebe `produtos` (array), `onEditar` e `onDeletar` (funções callback)
- **Renderização condicional:** se a lista estiver vazia, mostra uma mensagem em vez da tabela
- **`.map()`:** percorre o array de produtos e gera uma linha `<tr>` para cada um
- **`key={produto.id}`:** o React exige uma `key` única para cada item em listas — usamos o `id` do produto
- **Callbacks com parâmetro:** `onClick={() => onEditar(produto)}` — usamos arrow function para passar o produto como argumento

---

## 6. Montando o App.jsx

Agora vamos juntar tudo no componente raiz. Abra `src/App.jsx` e **substitua todo o conteúdo** por:

```jsx
// src/App.jsx
import { useState, useEffect } from 'react';
import {
  getProdutos,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from './services/produtoService';
import ProdutoForm from './components/ProdutoForm';
import ProdutoList from './components/ProdutoList';

function App() {
  const [produtos, setProdutos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [erro, setErro] = useState('');

  // Carrega a lista de produtos ao montar o componente
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const data = await getProdutos();
      setProdutos(data);
      setErro('');
    } catch (error) {
      setErro(
        'Não foi possível carregar os produtos. Verifique se a API está rodando.'
      );
      console.error('Erro ao carregar produtos:', error);
    }
  };

  const handleSalvar = async (produto) => {
    try {
      if (produtoEditando) {
        // Atualizar produto existente
        await atualizarProduto(produto);
        setProdutoEditando(null);
      } else {
        // Criar novo produto
        await criarProduto(produto);
      }
      // Recarrega a lista após salvar
      await carregarProdutos();
      setErro('');
    } catch (error) {
      setErro('Erro ao salvar o produto. Verifique os dados e tente novamente.');
      console.error('Erro ao salvar:', error);
    }
  };

  const handleEditar = (produto) => {
    setProdutoEditando(produto);
  };

  const handleCancelar = () => {
    setProdutoEditando(null);
  };

  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await deletarProduto(id);
        // Recarrega a lista após deletar
        await carregarProdutos();
        setErro('');
      } catch (error) {
        setErro('Erro ao deletar o produto.');
        console.error('Erro ao deletar:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.titulo}>CRUD de Produtos</h1>

      {erro && <div style={styles.erro}>{erro}</div>}

      <ProdutoForm
        produtoEditando={produtoEditando}
        onSalvar={handleSalvar}
        onCancelar={handleCancelar}
      />

      <ProdutoList
        produtos={produtos}
        onEditar={handleEditar}
        onDeletar={handleDeletar}
      />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px',
  },
  titulo: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  erro: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    textAlign: 'center',
  },
};

export default App;
```

**O que o App faz — visão geral:**

- **`produtos`** — estado com a lista de todos os produtos (vem da API)
- **`produtoEditando`** — quando o usuário clica em "Editar", guardamos o produto aqui; o formulário se preenche automaticamente
- **`erro`** — mensagem de erro exibida quando algo dá errado
- **`carregarProdutos()`** — busca a lista da API e atualiza o estado
- **`handleSalvar()`** — decide se cria ou atualiza, depois recarrega a lista
- **`handleDeletar()`** — pede confirmação, deleta e recarrega a lista

> **Observação:** Note que não importamos `App.css` — já esvaziamos ou deletamos esse arquivo na seção 3.2. Se você deletou o arquivo, certifique-se de que a linha `import './App.css'` **não** existe no seu `App.jsx`.

---

## 7. Executando o projeto completo

### 7.1. Terminal 1 — API .NET

Abra o primeiro terminal e inicie a API:

```bash
cd C:\Projetos\MeuCrud\MeuCrud.Api
dotnet run
```

Aguarde a mensagem: **Now listening on: http://localhost:PORTA**

> **Atenção:** Anote a porta exibida (ex: 5217, 5237, etc.). Se for diferente da que você configurou no `produtoService.js`, altere a constante `API_URL` para bater com a porta correta.

### 7.2. Terminal 2 — React

Abra um segundo terminal (sem fechar o primeiro) e inicie o React:

```bash
cd C:\Projetos\MeuCrud\meucrud-frontend
npm run dev
```

Aguarde a mensagem: **Local: http://localhost:5173**

### 7.3. Testando o CRUD completo no navegador

Abra o navegador em: **http://localhost:5173**

Você deve ver o formulário "Novo Produto". Teste:

- **Teste 1 — Create:** cadastre um produto e verifique se aparece na tabela.
- **Teste 2 — Read:** recarregue a página (F5) e verifique se os produtos continuam.
- **Teste 3 — Update:** edite um produto e veja a tabela atualizar.
- **Teste 4 — Delete:** delete um produto e confirme que some da lista.

Se todos os testes passaram, você tem um CRUD completo e funcional.

---

## 8. Estrutura final do projeto ao final deste módulo

```
meucrud-frontend/
|-- src/
|   |-- components/
|   |   |-- ProdutoForm.jsx
|   |   +-- ProdutoList.jsx
|   |-- services/
|   |   +-- produtoService.js
|   |-- App.jsx
|   |-- main.jsx
|   +-- index.css
|-- package.json
+-- vite.config.js
```

---

## 9. Solução de Problemas Comuns

### Erro: Não foi possível carregar os produtos

**Causa:** o React não conseguiu se conectar à API .NET.

**Soluções:**

- Verifique se a API está rodando em outro terminal (`dotnet run`)
- Verifique se a porta no `produtoService.js` bate com a porta exibida pelo `dotnet run`
- Abra o console do navegador (F12 → Console) e veja a mensagem detalhada

### CORS error: No 'Access-Control-Allow-Origin' header

**Causa:** a origem do React (`http://localhost:5173`) não está autorizada no CORS da API.

**Solução:** verifique o `Program.cs` da API — confirme que a política de CORS permite a origem do React e que `UseCors` está antes de `MapControllers`.

### Network Error no console do navegador

**Causa:** a API não está rodando ou a URL está errada.

**Solução:** confirme se a URL base no `produtoService.js` está correta e se a API está rodando. Lembre-se: a porta pode variar de máquina para máquina.

### O formulário limpa mas o produto não aparece na lista

**Causa:** a função de recarregar a lista não foi chamada após o POST.

**Solução:** verifique se existe uma chamada para `carregarProdutos()` após criar o produto no `handleSalvar`.

### A tabela mostra dados antigos após editar

**Causa:** a lista não foi recarregada após o PUT.

**Solução:** confirme que `carregarProdutos()` é chamada após atualizar o produto.

### Erro ao importar App.css (module not found)

**Causa:** o arquivo `App.css` foi deletado, mas o `import './App.css'` ainda existe no `App.jsx`.

**Solução:** remova a linha `import './App.css'` do `App.jsx`, ou recrie o arquivo `App.css` vazio.

---

## Resumo do Módulo

Neste módulo você:

- Criou um projeto React com Vite e instalou o Axios
- Aprendeu os conceitos de componentes, props, state, `useState` e `useEffect`
- Criou o serviço de API (`produtoService.js`) centralizando as chamadas HTTP
- Construiu os componentes `ProdutoForm` e `ProdutoList` com CRUD completo
- Montou o `App.jsx` integrando formulário e listagem
- Executou o sistema completo (React + .NET + PostgreSQL) simultaneamente
