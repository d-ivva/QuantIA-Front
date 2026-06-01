/**
 * MarketService — dados de mercado via backend próprio.
 * Backend expõe: GET /market/ticker · /market/assets · /market/news
 * Fallback com mock data realista quando o backend não está disponível.
 */
import api from '../lib/api';

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

export const MOCK_TICKER = [
  { symbol: 'PETR4', label: 'Petrobras PN',   value: 38.52,    change: 0.81,    changePercent:  2.14,  type: 'stock'  },
  { symbol: 'VALE3', label: 'Vale ON',         value: 62.30,    change: -0.95,   changePercent: -1.50,  type: 'stock'  },
  { symbol: 'IBOV',  label: 'Ibovespa',        value: 132450,   change: 820,     changePercent:  0.62,  type: 'index'  },
  { symbol: 'BBDC4', label: 'Bradesco PN',     value: 15.82,    change: 0.18,    changePercent:  1.15,  type: 'stock'  },
  { symbol: 'ITUB4', label: 'Itaú PN',         value: 33.24,    change: 0.44,    changePercent:  1.34,  type: 'stock'  },
  { symbol: 'BTC',   label: 'Bitcoin',          value: 364800,   change: -5200,   changePercent: -1.41,  type: 'crypto' },
  { symbol: 'ETH',   label: 'Ethereum',         value: 17840,    change: 320,     changePercent:  1.83,  type: 'crypto' },
  { symbol: 'SOL',   label: 'Solana',           value: 856.40,   change: 12.40,   changePercent:  1.47,  type: 'crypto' },
  { symbol: 'BNB',   label: 'BNB',              value: 2780,     change: -42,     changePercent: -1.49,  type: 'crypto' },
];

export const MOCK_ASSETS = [
  {
    id: 'PETR4', symbol: 'PETR4', name: 'Petrobras PN', type: 'stock',
    value: 38.52, changePercent: 2.14,
    sparkline: [36.80, 37.20, 36.95, 38.10, 37.85, 38.20, 38.52],
  },
  {
    id: 'VALE3', symbol: 'VALE3', name: 'Vale ON', type: 'stock',
    value: 62.30, changePercent: -1.50,
    sparkline: [64.20, 63.80, 64.10, 63.40, 62.90, 62.60, 62.30],
  },
  {
    id: 'ITUB4', symbol: 'ITUB4', name: 'Itaú Unibanco PN', type: 'stock',
    value: 33.24, changePercent: 1.34,
    sparkline: [32.60, 32.40, 32.80, 32.95, 33.10, 33.00, 33.24],
  },
  {
    id: 'BTC', symbol: 'BTC', name: 'Bitcoin', type: 'crypto',
    value: 364800, changePercent: -1.41,
    sparkline: [375200, 372000, 368500, 370100, 366800, 365200, 364800],
  },
  {
    id: 'ETH', symbol: 'ETH', name: 'Ethereum', type: 'crypto',
    value: 17840, changePercent: 1.83,
    sparkline: [16400, 16800, 17100, 17300, 17500, 17680, 17840],
  },
  {
    id: 'SOL', symbol: 'SOL', name: 'Solana', type: 'crypto',
    value: 856.40, changePercent: 1.47,
    sparkline: [820, 835, 828, 842, 848, 851, 856.40],
  },
];

const _ago = (hours) => new Date(Date.now() - hours * 3_600_000).toISOString();
const _min = (min)   => new Date(Date.now() - min  * 60_000).toISOString();

export const MOCK_NEWS = [
  {
    id: 1,
    title: 'Petrobras anuncia pagamento de dividendos de R$ 37,8 bilhões no segundo semestre',
    source: 'InfoMoney', url: '#',
    publishedAt: _min(45), sentiment: 'positive',
  },
  {
    id: 2,
    title: 'Ibovespa fecha em alta de 0,6% com otimismo externo e dados de inflação abaixo do esperado',
    source: 'Valor Econômico', url: '#',
    publishedAt: _ago(2), sentiment: 'positive',
  },
  {
    id: 3,
    title: 'Bitcoin recua abaixo de US$ 68 mil com realização de lucros após máxima histórica',
    source: 'CoinTelegraph Brasil', url: '#',
    publishedAt: _ago(3.5), sentiment: 'negative',
  },
  {
    id: 4,
    title: 'Selic pode ser mantida em 10,5% nas próximas reuniões do COPOM, avalia BTG Pactual',
    source: 'Bloomberg Línea', url: '#',
    publishedAt: _ago(5), sentiment: 'neutral',
  },
  {
    id: 5,
    title: 'Vale reporta produção recorde de minério de ferro no trimestre; ações disparam 3%',
    source: 'Exame', url: '#',
    publishedAt: _ago(7), sentiment: 'positive',
  },
  {
    id: 6,
    title: 'Fed mantém taxa de juros; mercado reage positivamente a perspectiva dovish do chair Powell',
    source: 'Reuters Brasil', url: '#',
    publishedAt: _ago(18), sentiment: 'positive',
  },
  {
    id: 7,
    title: 'Dólar recua para R$ 5,10 com fluxo de capital estrangeiro e melhora do apetite ao risco',
    source: 'Agência Estado', url: '#',
    publishedAt: _ago(22), sentiment: 'positive',
  },
];

// ─── API CALLS ────────────────────────────────────────────────────────────────

export const getTicker = async () => {
  try {
    const { data } = await api.get('/market/ticker');
    return Array.isArray(data) && data.length > 0 ? data : MOCK_TICKER;
  } catch {
    return MOCK_TICKER;
  }
};

export const getAssets = async () => {
  try {
    const { data } = await api.get('/market/assets');
    return Array.isArray(data) && data.length > 0 ? data : MOCK_ASSETS;
  } catch {
    return MOCK_ASSETS;
  }
};

export const getNews = async () => {
  try {
    const { data } = await api.get('/market/news');
    return Array.isArray(data) && data.length > 0 ? data : MOCK_NEWS;
  } catch {
    return MOCK_NEWS;
  }
};
