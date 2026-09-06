import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Landmark, Plus, Trash2, Home, Car, TrendingUp, CircleDot } from 'lucide-react';
import { Layout } from '@/components/ui/Layout';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/format';
import { getSaldo } from '@/lib/analytics';
import type { Asset } from '@/types';

const ASSET_TYPES: { id: Asset['tipo']; nome: string; icon: string; cor: string }[] = [
  { id: 'imovel', nome: 'Imóvel', icon: 'Home', cor: '#8b5cf6' },
  { id: 'investimento', nome: 'Investimento', icon: 'TrendingUp', cor: '#16a34a' },
  { id: 'veiculo', nome: 'Veículo', icon: 'Car', cor: '#3b82f6' },
  { id: 'outro', nome: 'Outro', icon: 'CircleDot', cor: '#6b7280' },
];

export function Patrimony() {
  const assets = useStore((s) => s.assets);
  const transactions = useStore((s) => s.transactions);
  const addAsset = useStore((s) => s.addAsset);
  const deleteAsset = useStore((s) => s.deleteAsset);
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<Asset['tipo']>('investimento');
  const [valor, setValor] = useState('');

  function handleAdd() {
    if (!nome || !valor) return;
    addAsset({ nome, tipo, valor: parseFloat(valor.replace(',', '.')) });
    setNome(''); setValor(''); setShowForm(false);
  }

  const saldo = getSaldo(transactions);
  const totalAssets = assets.reduce((a, ast) => a + ast.valor, 0);
  const patrimonio = saldo + totalAssets;

  return (
    <Layout title="Patrimônio">
      <div className="p-4 bg-gradient-to-br from-accent-600 to-accent-700 rounded-2xl text-white mb-4">
        <p className="text-sm opacity-90">Patrimônio Total</p>
        <p className="text-3xl font-extrabold">{formatCurrency(patrimonio)}</p>
        <div className="flex gap-4 mt-3 text-xs">
          <div>
            <span className="opacity-75">Líquido</span>
            <p className="font-semibold">{formatCurrency(saldo)}</p>
          </div>
          <div>
            <span className="opacity-75">Bens</span>
            <p className="font-semibold">{formatCurrency(totalAssets)}</p>
          </div>
        </div>
      </div>

      {assets.length === 0 && !showForm ? (
        <EmptyState
          icon={Landmark}
          title="Nenhum bem cadastrado"
          description="Cadastre imóveis, investimentos e veículos para acompanhar seu patrimônio."
          action={<button onClick={() => setShowForm(true)} className="btn-primary">Adicionar bem</button>}
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {assets.map((a) => {
              const t = ASSET_TYPES.find((at) => at.id === a.tipo)!;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-card"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.cor + '20' }}>
                    <Landmark className="w-5 h-5" style={{ color: t.cor }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">{a.nome}</p>
                    <p className="text-xs text-ink-400">{t.nome}</p>
                  </div>
                  <span className="text-sm font-bold text-ink-900">{formatCurrency(a.valor)}</span>
                  <button onClick={() => deleteAsset(a.id)} className="p-1.5 text-ink-300 hover:text-danger">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card p-4 mt-3">
          <h3 className="font-bold text-ink-900 mb-3">Novo bem</h3>
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do bem" className="input mb-3" />
          <select value={tipo} onChange={(e) => setTipo(e.target.value as Asset['tipo'])} className="input mb-3">
            {ASSET_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
          <input value={valor} onChange={(e) => setValor(e.target.value.replace(/[^0-9.,]/g, ''))} placeholder="Valor (R$)" inputMode="decimal" className="input mb-4" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleAdd} disabled={!nome || !valor} className="btn-primary flex-1">Adicionar</button>
          </div>
        </motion.div>
      )}

      {!showForm && assets.length > 0 && (
        <button onClick={() => setShowForm(true)} className="btn-secondary w-full mt-4">
          <Plus className="w-4 h-4" /> Adicionar bem
        </button>
      )}
    </Layout>
  );
}
