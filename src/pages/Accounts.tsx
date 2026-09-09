import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Plus, Trash2, Landmark, PiggyBank, Wallet,
  ArrowLeftRight, X, ArrowRight, Pencil,
} from 'lucide-react';
import { Layout } from '@/components/ui/Layout';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStore } from '@/store/useStore';
import { formatCurrency } from '@/lib/format';
import type { Account } from '@/types';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ACCOUNT_TYPES: { id: Account['tipo']; nome: string; icon: string; cor: string }[] = [
  { id: 'conta_corrente', nome: 'Conta Corrente', icon: 'Landmark', cor: '#3b82f6' },
  { id: 'poupanca', nome: 'Poupança', icon: 'PiggyBank', cor: '#16a34a' },
  { id: 'cartao', nome: 'Cartão', icon: 'CreditCard', cor: '#f97316' },
  { id: 'dinheiro', nome: 'Dinheiro', icon: 'Wallet', cor: '#6b7280' },
];
const NEW_ACCOUNT_TYPES = ACCOUNT_TYPES.filter((type) => type.id === 'conta_corrente' || type.id === 'poupanca');

export function Accounts() {
  const accounts = useStore((s) => s.accounts);
  const transfers = useStore((s) => s.transfers);
  const addAccount = useStore((s) => s.addAccount);
  const deleteAccount = useStore((s) => s.deleteAccount);
  const updateAccountBalance = useStore((s) => s.updateAccountBalance);
  const transferBetweenAccounts = useStore((s) => s.transferBetweenAccounts);

  const [showForm, setShowForm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<Account['tipo']>('conta_corrente');
  const [saldo, setSaldo] = useState('');

  // Transfer state
  const [origemId, setOrigemId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [transferValor, setTransferValor] = useState('');
  const [transferDesc, setTransferDesc] = useState('');

  function handleAdd() {
    if (!nome) return;
    const t = ACCOUNT_TYPES.find((at) => at.id === tipo)!;
    addAccount({ nome, tipo, saldo: parseFloat(saldo.replace(',', '.')) || 0, cor: t.cor });
    setNome(''); setSaldo(''); setShowForm(false);
  }

  function handleEditSave(id: string) {
    const newSaldo = parseFloat(saldo.replace(',', '.'));
    if (isNaN(newSaldo)) return;
    updateAccountBalance(id, newSaldo);
    setEditingId(null);
    setSaldo('');
  }

  function handleTransfer() {
    if (!origemId || !destinoId || !transferValor) return;
    const valor = parseFloat(transferValor.replace(',', '.'));
    if (valor <= 0 || origemId === destinoId) return;
    transferBetweenAccounts(origemId, destinoId, valor, transferDesc || undefined);
    setOrigemId(''); setDestinoId(''); setTransferValor(''); setTransferDesc('');
    setShowTransfer(false);
  }

  const total = accounts.reduce((a, acc) => a + acc.saldo, 0);
  const hasMultiple = accounts.length >= 2;

  return (
    <Layout title="Contas">
      <div className="p-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl text-white mb-4">
        <p className="text-sm opacity-90">Total em contas</p>
        <p className="text-3xl font-extrabold">{formatCurrency(total)}</p>
        {accounts.length > 1 && (
          <p className="text-xs opacity-75 mt-1">{accounts.length} contas cadastradas</p>
        )}
      </div>

      {accounts.length > 1 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {accounts.map((a) => {
            const t = ACCOUNT_TYPES.find((at) => at.id === a.tipo)!;
            const Icon = (Icons as unknown as Record<string, LucideIcon>)[t.icon] || Icons.CreditCard;
            return (
              <div key={a.id} className="p-3 bg-white rounded-xl shadow-card">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5" style={{ color: t.cor }} />
                  <span className="text-[10px] font-medium text-ink-500 truncate">{a.nome}</span>
                </div>
                <p className="text-sm font-bold text-ink-900">{formatCurrency(a.saldo)}</p>
              </div>
            );
          })}
        </div>
      )}

      {accounts.length === 0 && !showForm ? (
        <EmptyState
          icon={CreditCard}
          title="Nenhuma conta"
          description="Cadastre suas contas para organizar suas finanças."
          action={<button onClick={() => setShowForm(true)} className="btn-primary">Adicionar conta</button>}
        />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {accounts.map((a) => {
              const t = ACCOUNT_TYPES.find((at) => at.id === a.tipo)!;
              const Icon = (Icons as unknown as Record<string, LucideIcon>)[t.icon] || Icons.CreditCard;
              const isEditing = editingId === a.id;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="flex items-center gap-3 p-3 bg-white rounded-2xl shadow-card"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: t.cor + '20' }}>
                    <Icon className="w-5 h-5" style={{ color: t.cor }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink-900">{a.nome}</p>
                    <p className="text-xs text-ink-400">{t.nome}</p>
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input
                        autoFocus
                        value={saldo}
                        onChange={(e) => setSaldo(e.target.value.replace(/[^0-9.,-]/g, ''))}
                        placeholder={String(a.saldo)}
                        inputMode="decimal"
                        className="w-20 text-sm text-right bg-ink-50 rounded-lg px-2 py-1 border border-ink-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleEditSave(a.id); }}
                      />
                      <button onClick={() => handleEditSave(a.id)} className="p-1 text-primary-600 hover:bg-primary-50 rounded">
                        <Icons.Check className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingId(null); setSaldo(''); }} className="p-1 text-ink-400 hover:text-ink-900">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-bold text-ink-900">{formatCurrency(a.saldo)}</span>
                      <button
                        onClick={() => { setEditingId(a.id); setSaldo(String(a.saldo)); }}
                        className="p-1.5 text-ink-300 hover:text-primary-600"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteAccount(a.id)} className="p-1.5 text-ink-300 hover:text-danger">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2 mt-4">
        {!showForm && !showTransfer && (
          <>
            <button onClick={() => setShowForm(true)} className="btn-secondary flex-1">
              <Plus className="w-4 h-4" /> Nova conta
            </button>
            {hasMultiple && (
              <button onClick={() => setShowTransfer(true)} className="btn-primary flex-1">
                <ArrowLeftRight className="w-4 h-4" /> Transferir
              </button>
            )}
          </>
        )}
      </div>

      {/* Recent transfers */}
      {transfers.length > 0 && !showTransfer && !showForm && (
        <div className="mt-6">
          <h3 className="text-sm font-bold text-ink-900 mb-2">Transferências recentes</h3>
          <div className="space-y-2">
            {transfers.slice(0, 5).map((tr) => {
              const origem = accounts.find((a) => a.id === tr.contaOrigemId);
              const destino = accounts.find((a) => a.id === tr.contaDestinoId);
              return (
                <div key={tr.id} className="flex items-center gap-2 p-3 bg-white rounded-xl shadow-card">
                  <ArrowRight className="w-4 h-4 text-ink-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink-800 truncate">
                      {origem?.nome || 'Conta removida'} → {destino?.nome || 'Conta removida'}
                    </p>
                    {tr.descricao && <p className="text-[10px] text-ink-400">{tr.descricao}</p>}
                  </div>
                  <span className="text-sm font-bold text-ink-900">{formatCurrency(tr.valor)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add account form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card p-4 mt-3">
          <h3 className="font-bold text-ink-900 mb-3">Nova conta</h3>
          <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da conta" className="input mb-3" />
          <select value={tipo} onChange={(e) => setTipo(e.target.value as Account['tipo'])} className="input mb-3">
            {NEW_ACCOUNT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
          <input value={saldo} onChange={(e) => setSaldo(e.target.value.replace(/[^0-9.,-]/g, ''))} placeholder="Saldo (R$)" inputMode="decimal" className="input mb-4" />
          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="btn-secondary flex-1">Cancelar</button>
            <button onClick={handleAdd} disabled={!nome} className="btn-primary flex-1">Adicionar</button>
          </div>
        </motion.div>
      )}

      {/* Transfer form */}
      {showTransfer && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-ink-900">Transferência entre contas</h3>
            <button onClick={() => setShowTransfer(false)} className="p-1 text-ink-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-ink-500 mb-1 block">De</label>
              <select value={origemId} onChange={(e) => setOrigemId(e.target.value)} className="input">
                <option value="">Selecione a conta de origem</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.nome} ({formatCurrency(a.saldo)})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink-500 mb-1 block">Para</label>
              <select value={destinoId} onChange={(e) => setDestinoId(e.target.value)} className="input">
                <option value="">Selecione a conta de destino</option>
                {accounts.filter((a) => a.id !== origemId).map((a) => (
                  <option key={a.id} value={a.id}>{a.nome} ({formatCurrency(a.saldo)})</option>
                ))}
              </select>
            </div>
            <input
              value={transferValor}
              onChange={(e) => setTransferValor(e.target.value.replace(/[^0-9.,]/g, ''))}
              placeholder="Valor (R$)"
              inputMode="decimal"
              className="input"
            />
            <input
              value={transferDesc}
              onChange={(e) => setTransferDesc(e.target.value)}
              placeholder="Descrição (opcional)"
              className="input"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => setShowTransfer(false)} className="btn-secondary flex-1">Cancelar</button>
            <button
              onClick={handleTransfer}
              disabled={!origemId || !destinoId || !transferValor || origemId === destinoId}
              className="btn-primary flex-1"
            >
              Transferir
            </button>
          </div>
        </motion.div>
      )}
    </Layout>
  );
}
