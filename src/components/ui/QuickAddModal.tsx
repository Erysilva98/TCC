import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ArrowLeft } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { CATEGORIES, DESPESA_CATEGORIES, RECEITA_CATEGORIES } from '@/data/categories';
import type { CategoryId, TransactionType } from '@/types';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface QuickAddModalProps {
  open: boolean;
  onClose: () => void;
}

export function QuickAddModal({ open, onClose }: QuickAddModalProps) {
  const addTransaction = useStore((s) => s.addTransaction);
  const [step, setStep] = useState<'tipo' | 'categoria' | 'valor' | 'confirm'>('tipo');
  const [tipo, setTipo] = useState<TransactionType>('despesa');
  const [categoria, setCategoria] = useState<CategoryId | null>(null);
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  function reset() {
    setStep('tipo');
    setTipo('despesa');
    setCategoria(null);
    setValor('');
    setDescricao('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  function handleSave() {
    if (!categoria || !valor) return;
    addTransaction({
      tipo,
      valor: parseFloat(valor.replace(',', '.')),
      categoria,
      data: new Date().toISOString(),
      descricao: descricao || undefined,
    });
    reset();
    onClose();
  }

  const cats = tipo === 'receita' ? RECEITA_CATEGORIES : DESPESA_CATEGORIES;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-x-4 top-[5.75rem] z-50 bg-white rounded-3xl max-w-md mx-auto max-h-[82vh] overflow-y-auto safe-bottom"
          >
            <div className="flex items-center justify-between p-4 border-b border-ink-100">
              <div className="flex items-center gap-3">
                {step !== 'tipo' && (
                  <button
                    onClick={() => setStep(step === 'confirm' ? 'valor' : step === 'valor' ? 'categoria' : 'tipo')}
                    className="p-1 -ml-1 text-ink-500 hover:text-ink-900"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="font-bold text-ink-900">Nova transação</h2>
              </div>
              <button onClick={handleClose} className="p-1 text-ink-500 hover:text-ink-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <AnimatePresence mode="wait">
                {step === 'tipo' && (
                  <motion.div key="tipo" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-sm text-ink-500 mb-3">Qual o tipo?</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setTipo('despesa'); setStep('categoria'); }}
                        className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-ink-200 hover:border-danger hover:bg-red-50 transition-all"
                      >
                        <Icons.ArrowDownCircle className="w-8 h-8 text-danger" />
                        <span className="font-semibold text-ink-900">Despesa</span>
                      </button>
                      <button
                        onClick={() => { setTipo('receita'); setStep('categoria'); }}
                        className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-ink-200 hover:border-primary-600 hover:bg-primary-50 transition-all"
                      >
                        <Icons.ArrowUpCircle className="w-8 h-8 text-primary-600" />
                        <span className="font-semibold text-ink-900">Receita</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 'categoria' && (
                  <motion.div key="cat" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-sm text-ink-500 mb-3">Escolha a categoria</p>
                    <div className="grid grid-cols-3 gap-2">
                      {cats.map((catId) => {
                        const cat = CATEGORIES[catId];
                        const Icon = (Icons as unknown as Record<string, LucideIcon>)[cat.icon] || Icons.CircleDot;
                        return (
                          <button
                            key={catId}
                            onClick={() => { setCategoria(catId); setStep('valor'); }}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 border-ink-200 hover:border-ink-400 transition-all"
                          >
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: cat.cor + '20' }}>
                              <Icon className="w-5 h-5" style={{ color: cat.cor }} />
                            </div>
                            <span className="text-xs font-medium text-ink-700">{cat.nome}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 'valor' && (
                  <motion.div key="valor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-sm text-ink-500 mb-3">Qual o valor?</p>
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-ink-900 mb-1">
                        {valor ? formatCurrency(parseFloat(valor.replace(',', '.')) || 0) : 'R$ 0,00'}
                      </div>
                    </div>
                    <input
                      type="text"
                      inputMode="decimal"
                      autoFocus
                      value={valor}
                      onChange={(e) => setValor(e.target.value.replace(/[^0-9.,]/g, ''))}
                      onKeyDown={(e) => { if (e.key === 'Enter' && valor) setStep('confirm'); }}
                      placeholder="0,00"
                      className="input text-center text-lg font-semibold mb-3"
                    />
                    <input
                      type="text"
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && valor) setStep('confirm'); }}
                      placeholder="Descrição (opcional)"
                      className="input mb-4"
                    />
                    <button
                      disabled={!valor}
                      onClick={() => setStep('confirm')}
                      className="btn-primary w-full"
                    >
                      Continuar
                    </button>
                  </motion.div>
                )}

                {step === 'confirm' && categoria && (
                  <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                    <p className="text-sm text-ink-500 mb-3">Confirmar transação</p>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between p-3 bg-ink-50 rounded-xl">
                        <span className="text-ink-500">Tipo</span>
                        <span className="font-semibold text-ink-900">{tipo === 'receita' ? 'Receita' : 'Despesa'}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-ink-50 rounded-xl">
                        <span className="text-ink-500">Categoria</span>
                        <span className="font-semibold text-ink-900">{CATEGORIES[categoria].nome}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-ink-50 rounded-xl">
                        <span className="text-ink-500">Valor</span>
                        <span className="font-semibold text-ink-900">{formatCurrency(parseFloat(valor.replace(',', '.')) || 0)}</span>
                      </div>
                      {descricao && (
                        <div className="flex justify-between p-3 bg-ink-50 rounded-xl">
                          <span className="text-ink-500">Descrição</span>
                          <span className="font-semibold text-ink-900">{descricao}</span>
                        </div>
                      )}
                    </div>
                    <button onClick={handleSave} className="btn-primary w-full">
                      <Check className="w-5 h-5" /> Salvar transação
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
