import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, Trash2, Check } from 'lucide-react';
import { Layout } from '@/components/ui/Layout';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/format';
import { CATEGORIES } from '@/data/categories';
import type { CategoryId } from '@/types';

export function Goals() {
  const goals = useStore((s) => s.goals);
  const addGoal = useStore((s) => s.addGoal);
  const updateGoal = useStore((s) => s.updateGoal);
  const deleteGoal = useStore((s) => s.deleteGoal);
  const [showForm, setShowForm] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState<CategoryId>('outros');

  function handleAdd() {
    if (!titulo || !valor) return;
    addGoal({ titulo, valorAlvo: parseFloat(valor.replace(',', '.')), categoria });
    setTitulo(''); setValor(''); setShowForm(false);
  }

  return (
    <Layout title="Metas">
      {goals.length === 0 && !showForm ? (
        <>
          <EmptyState
            icon={Target}
            title="Nenhuma meta ainda"
            description="Defina metas financeiras e acompanhe seu progresso."
            action={<button onClick={() => setShowForm(true)} className="btn-primary">Criar primeira meta</button>}
          />
        </>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {goals.map((g) => {
              const pct = Math.min(100, (g.valorAtual / g.valorAlvo) * 100);
              const cat = CATEGORIES[g.categoria || 'outros'];
              const done = g.valorAtual >= g.valorAlvo;
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-2xl shadow-card p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {done && <Check className="w-4 h-4 text-primary-600" />}
                      <h3 className="font-semibold text-ink-900">{g.titulo}</h3>
                    </div>
                    <button onClick={() => deleteGoal(g.id)} className="p-1 text-ink-300 hover:text-danger">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between text-xs text-ink-500 mb-1.5">
                    <span>{formatCurrency(g.valorAtual)}</span>
                    <span>{formatCurrency(g.valorAlvo)}</span>
                  </div>
                  <div className="h-3 bg-ink-100 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${done ? 'bg-primary-600' : 'bg-primary-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-ink-400">{cat.nome} • {Math.round(pct)}%</span>
                    {!done && (
                      <button
                        onClick={() => {
                          const add = prompt('Quanto adicionar?', '50');
                          if (add) updateGoal(g.id, g.valorAtual + parseFloat(add.replace(',', '.')));
                        }}
                        className="text-xs font-medium text-primary-600 hover:underline"
                      >
                        Adicionar valor
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-card p-4 mt-3"
        >
          <h3 className="font-bold text-ink-900 mb-3">Nova meta</h3>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título da meta" className="input mb-3" />
          <input value={valor} onChange={(e) => setValor(e.target.value.replace(/[^0-9.,]/g, ''))} placeholder="Valor alvo (R$)" inputMode="decimal" className="input mb-3" />
          <select value={categoria} onChange={(e) => setCategoria(e.target.value as CategoryId)} className="input mb-4">
            {Object.values(CATEGORIES).map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleAdd} disabled={!titulo || !valor} className="btn-primary flex-1">Criar meta</button>
          </div>
        </motion.div>
      )}

      {!showForm && goals.length > 0 && (
        <button onClick={() => setShowForm(true)} className="btn-secondary w-full mt-4">
          <Plus className="w-4 h-4" /> Nova meta
        </button>
      )}
    </Layout>
  );
}
