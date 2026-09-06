import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PiggyBank, TrendingUp, BookOpen, ArrowRight, Plus, Trash2, X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/ui/Layout';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/format';
import { getSaldo } from '@/lib/analytics';

export function Investments() {
  const navigate = useNavigate();
  const assets = useStore((s) => s.assets);
  const transactions = useStore((s) => s.transactions);
  const addInvestment = useStore((s) => s.addInvestment);
  const deleteAsset = useStore((s) => s.deleteAsset);

  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [valor, setValor] = useState('');

  const investimentos = assets.filter((a) => a.tipo === 'investimento');
  const totalInvest = investimentos.reduce((acc, a) => acc + a.valor, 0);
  const saldo = getSaldo(transactions);
  const patrimonioTotal = saldo + assets.reduce((acc, a) => acc + a.valor, 0);

  function handleAdd() {
    if (!nome || !valor) return;
    addInvestment(nome, parseFloat(valor.replace(',', '.')));
    setNome(''); setValor(''); setShowForm(false);
  }

  return (
    <Layout title="Investimentos">
      <div className="p-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl text-white mb-4">
        <div className="flex items-center gap-2 mb-1">
          <PiggyBank className="w-5 h-5" />
          <p className="text-sm opacity-90">Total Investido</p>
        </div>
        <p className="text-3xl font-extrabold">{formatCurrency(totalInvest)}</p>
        <p className="text-xs opacity-75 mt-2">
          {patrimonioTotal > 0
            ? `${((totalInvest / patrimonioTotal) * 100).toFixed(0)}% do seu patrimônio`
            : 'Cadastre seus investimentos'}
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-ink-900 text-sm">Seus Investimentos</h2>
          {!showForm && (
            <button onClick={() => setShowForm(true)} className="text-xs text-primary-600 font-medium flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Adicionar
            </button>
          )}
        </div>

        {investimentos.length === 0 && !showForm ? (
          <p className="text-sm text-ink-400 text-center py-6">
            Nenhum investimento cadastrado ainda.
          </p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {investimentos.map((inv) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex items-center gap-3 p-3 bg-ink-50 rounded-xl"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{inv.nome}</p>
                    <p className="text-xs text-ink-400">Investimento</p>
                  </div>
                  <span className="text-sm font-bold text-ink-900">{formatCurrency(inv.valor)}</span>
                  <button onClick={() => deleteAsset(inv.id)} className="p-1.5 text-ink-300 hover:text-danger">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3 p-3 bg-ink-50 rounded-xl space-y-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-ink-900">Novo investimento</h3>
              <button onClick={() => setShowForm(false)} className="p-1 text-ink-400">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do investimento"
              className="input text-sm py-2"
            />
            <input
              value={valor}
              onChange={(e) => setValor(e.target.value.replace(/[^0-9.,]/g, ''))}
              placeholder="Valor (R$)"
              inputMode="decimal"
              className="input text-sm py-2"
            />
            <button onClick={handleAdd} disabled={!nome || !valor} className="btn-primary w-full text-sm py-2">
              Adicionar investimento
            </button>
          </motion.div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-ink-900 text-sm">Aprenda a Investir</h2>
        </div>
        <p className="text-sm text-ink-600 mb-3">
          Conclua aulas sobre investimentos para tomar melhores decisões.
        </p>
        <button onClick={() => navigate('/aprender')} className="btn-secondary w-full">
          Ver aulas <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </Layout>
  );
}
