import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Search, Filter } from 'lucide-react';
import { Layout } from '@/components/ui/Layout';
import { FAB } from '@/components/ui/FAB';
import { QuickAddModal } from '@/components/ui/QuickAddModal';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/data/categories';
import { formatCurrency, formatDate, getMonthName, isSameMonth } from '@/lib/format';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CategoryId } from '@/types';

export function Transactions() {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<'all' | 'receita' | 'despesa'>('all');
  const [search, setSearch] = useState('');
  const transactions = useStore((s) => s.transactions);
  const deleteTransaction = useStore((s) => s.deleteTransaction);

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (filter !== 'all' && t.tipo !== filter) return false;
      if (search && !t.descricao?.toLowerCase().includes(search.toLowerCase()) &&
          !CATEGORIES[t.categoria].nome.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [transactions, filter, search]);

  const monthTx = transactions.filter((t) => isSameMonth(t.data));
  const monthDespesas = monthTx.filter((t) => t.tipo === 'despesa').reduce((a, t) => a + t.valor, 0);
  const monthReceitas = monthTx.filter((t) => t.tipo === 'receita').reduce((a, t) => a + t.valor, 0);

  return (
    <Layout title="Gastos">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-primary-50 rounded-2xl">
          <p className="text-xs text-primary-700 font-medium">Receitas de {getMonthName()}</p>
          <p className="text-lg font-bold text-primary-700">{formatCurrency(monthReceitas)}</p>
        </div>
        <div className="p-3 bg-red-50 rounded-2xl">
          <p className="text-xs text-danger font-medium">Despesas de {getMonthName()}</p>
          <p className="text-lg font-bold text-danger">{formatCurrency(monthDespesas)}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="input pl-9 py-2 text-sm"
          />
        </div>
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-card">
          {(['all', 'receita', 'despesa'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-primary-600 text-white' : 'text-ink-500'
              }`}
            >
              {f === 'all' ? 'Todos' : f === 'receita' ? 'Receitas' : 'Despesas'}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Icons.Receipt}
          title="Nenhuma transação"
          description="Toque no botão + para registrar seu primeiro gasto ou receita."
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((t, i) => {
              const cat = CATEGORIES[t.categoria as CategoryId];
              const Icon = (Icons as unknown as Record<string, LucideIcon>)[cat.icon] || Icons.CircleDot;
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-card group"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cat.cor + '20' }}>
                    <Icon className="w-5 h-5" style={{ color: cat.cor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">
                      {t.descricao || cat.nome}
                    </p>
                    <p className="text-xs text-ink-400">{cat.nome} • {formatDate(t.data)}</p>
                  </div>
                  <span className={`text-sm font-bold ${t.tipo === 'receita' ? 'text-primary-600' : 'text-ink-900'}`}>
                    {t.tipo === 'receita' ? '+' : '-'}{formatCurrency(t.valor)}
                  </span>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="p-1.5 text-ink-300 hover:text-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <FAB onClick={() => setShowAdd(true)} />
      <QuickAddModal open={showAdd} onClose={() => setShowAdd(false)} />
    </Layout>
  );
}
