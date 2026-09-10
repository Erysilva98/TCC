import type { CreditCard, CreditCardExpense, PlannedExpense } from '@/types';

export interface MonthlyForecast { total: number; fixed: number; debts: number; cards: number; planned: number; pending: number; commitments: number; }

export function getMonthKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`; }
export function isCardExpenseDue(item: CreditCardExpense, month: string) {
  if (item.tipo === 'unica') return item.dataCompra.slice(0, 7) === month;
  if (item.tipo === 'parcelada') return item.dataCompra.slice(0, 7) <= month && (item.parcelaAtual ?? 1) <= (item.parcelas ?? 1);
  return item.dataCompra.slice(0, 7) <= month;
}

function occursInMonth(item: PlannedExpense, month: string) {
  if (item.status === 'finalizado' || item.dataInicio.slice(0, 7) > month) return false;
  if (item.recorrencia === 'unica') return item.vencimento.slice(0, 7) === month;
  if (item.recorrencia === 'parcelada') return !item.totalParcelas || (item.parcelaAtual ?? 1) <= item.totalParcelas;
  return true;
}

export function getMonthlyForecast(plannedExpenses: PlannedExpense[], cards: CreditCard[], cardExpenses: CreditCardExpense[], month = getMonthKey()): MonthlyForecast {
  const active = plannedExpenses.filter((item) => occursInMonth(item, month) && !(item.pagamentos ?? []).includes(month));
  const fixed = active.filter((item) => item.tipo === 'fixa').reduce((sum, item) => sum + item.valor, 0);
  const debts = active.filter((item) => item.tipo === 'divida' || item.recorrencia === 'parcelada').reduce((sum, item) => sum + item.valor, 0);
  const planned = active.filter((item) => item.tipo !== 'fixa' && item.tipo !== 'divida' && item.recorrencia !== 'parcelada').reduce((sum, item) => sum + item.valor, 0);
  const cardIds = new Set(cards.map((item) => item.id));
  const cardExpensesForMonth = cardExpenses.filter((item) => cardIds.has(item.cardId) && isCardExpenseDue(item, month) && !item.pagamentos.includes(month));
  const cardTotal = cardExpensesForMonth.reduce((sum, item) => sum + item.valor, 0);
  const total = fixed + debts + planned + cardTotal;
  return { total, fixed, debts, cards: cardTotal, planned, pending: total, commitments: active.length + cardExpensesForMonth.length };
}
