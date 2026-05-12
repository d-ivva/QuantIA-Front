import { useState, useEffect, useRef } from 'react';
import { Bot, Send, Plus, KeyRound, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sendMessage, clearChatHistory, generateSessionId } from '../../services/AiChatService';
import { getAiConfigs, hasAiConfig } from '../../services/AiConfigService';
import { useToast } from '../../hooks/useToast';

function AiChatPage() {
  const [configChecked, setConfigChecked] = useState(false);
  const [hasConfig, setHasConfig] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [provider, setProvider] = useState('');
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    checkConfig();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const checkConfig = async () => {
    try {
      const [has, cfgs] = await Promise.all([hasAiConfig(), getAiConfigs()]);
      const active = cfgs.filter((c) => c.isActive);
      setHasConfig(has);
      setConfigs(active);
      if (active.length > 0) setProvider(active[0].provider);
    } catch {
      setHasConfig(false);
    } finally {
      setConfigChecked(true);
    }
  };

  const handleNewChat = async () => {
    if (messages.length > 0) {
      try {
        await clearChatHistory(sessionId);
      } catch {
        // best effort
      }
    }
    setSessionId(generateSessionId());
    setMessages([]);
    setInput('');
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    resizeTextarea();
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setSending(true);

    try {
      const response = await sendMessage(provider, sessionId, text);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.response },
      ]);
    } catch (err) {
      const msg = err.response?.data?.message || 'Erro ao enviar mensagem. Verifique sua chave de API.';
      toast.error(msg);
      setMessages((prev) => prev.slice(0, -1));
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!configChecked) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        Carregando...
      </div>
    );
  }

  if (!hasConfig) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
          <Bot className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Nenhuma IA configurada</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Para usar o assistente QuantIA, cadastre uma chave de API de um provedor de IA.
        </p>
        <Link
          to="/ai-config"
          className="mt-5 flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-medium transition"
        >
          <KeyRound className="w-4 h-4" />
          Configurar IA
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-800">Assistente QuantIA</h1>
            <p className="text-xs text-gray-500">Especialista em educação financeira</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {configs.length > 1 ? (
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="text-sm border rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {configs.map((c) => (
                <option key={c.id} value={c.provider}>
                  {c.provider}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">
              {provider}
            </span>
          )}
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border rounded-lg hover:bg-gray-50 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Novo chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {messages.length === 0 && !sending ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <Bot className="w-7 h-7 text-emerald-600" />
            </div>
            <p className="text-gray-700 font-medium text-lg">Olá! Sou o assistente QuantIA</p>
            <p className="text-sm text-gray-400 mt-2 max-w-md">
              Posso ajudar com dúvidas sobre educação financeira e analisar seus dados financeiros.
              O que gostaria de saber?
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md w-full">
              {[
                'Como está meu orçamento este mês?',
                'Quais são minhas maiores despesas?',
                'Como posso economizar mais dinheiro?',
                'O que é a regra 50/30/20?',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setInput(suggestion);
                    textareaRef.current?.focus();
                  }}
                  className="text-left text-sm text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2.5 hover:bg-emerald-50 hover:border-emerald-300 transition"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="w-7 h-7 bg-emerald-100 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="flex gap-3 items-end max-w-3xl mx-auto">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre seus dados financeiros ou educação financeira..."
            rows={1}
            disabled={sending}
            className="flex-1 border rounded-xl px-4 py-2.5 text-sm text-gray-800 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 overflow-hidden"
            style={{ minHeight: '42px', maxHeight: '128px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 flex items-center justify-center bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Enter para enviar · Shift+Enter para nova linha
        </p>
      </div>
    </div>
  );
}

export default AiChatPage;
