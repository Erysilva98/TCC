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
  // A parcela pertence a cada mês entre o vencimento inicial e a última
  // parcela. O limite é aplicado em getOccurrencesInMonth; não use o estado
  // de pagamento atual aqui, pois as próximas parcelas continuam previstas.
  if (item.recorrencia === 'parcelada') return true;
  if (item.recorrencia === 'mensal') return true;
  const [year, value] = month.split('-').map(Number);
  const firstDay = new Date(year, value - 1, 1, 12);
  const lastDay = new Date(year, value, 0, 12);
  const due = new Date(`${item.vencimento}T12:00:00`);
  if (item.recorrencia === 'anual') return due.getMonth() === firstDay.getMonth();
  const interval = item.recorrencia === 'quinzenal' ? 15 : 7;
  if (item.recorrencia === 'quinzenal' || item.recorrencia === 'semanal') {
    if (due > lastDay) return false;
    const elapsedDays = Math.max(0, Math.floor((firstDay.getTime() - due.getTime()) / 86400000));
    const nextOccurrence = new Date(due);
    nextOccurrence.setDate(due.getDate() + Math.ceil(elapsedDays / interval) * interval);
    return nextOccurrence <= lastDay;
  }
  return true;
}

export function getOccurrencesInMonth(item: PlannedExpense, month: string): string[] {
  if (!occursInMonth(item, month)) return [];
  if (item.recorrencia === 'parcelada') {
    const [startYear, startMonth] = item.vencimento.slice(0, 7).split('-').map(Number);
    const [year, value] = month.split('-').map(Number);
    const installment = (year - startYear) * 12 + value - startMonth + 1;
    if (installment < 1 || installment > (item.totalParcelas ?? 1)) return [];
    return [`${month}-${item.vencimento.slice(8, 10)}`];
  }
  if (item.recorrencia !== 'semanal' && item.recorrencia !== 'quinzenal') return [`${month}-${item.vencimento.slice(8, 10)}`];
  const [year, value] = month.split('-').map(Number);
  const end = new Date(year, value, 0, 12);
  const due = new Date(`${item.vencimento}T12:00:00`);
  const interval = item.recorrencia === 'semanal' ? 7 : 15;
  const dates: string[] = [];
  let cursor = new Date(due);
  while (cursor < new Date(year, value - 1, 1, 12)) cursor.setDate(cursor.getDate() + interval);
  while (cursor <= end) { dates.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`); cursor.setDate(cursor.getDate() + interval); }
  return dates;
}

export function getMonthlyForecast(plannedExpenses: PlannedExpense[], cards: CreditCard[], cardExpenses: CreditCardExpense[], month = getMonthKey()): MonthlyForecast {
  const active = plannedExpenses.flatMap((item) => getOccurrencesInMonth(item, month).filter((date) => !(item.pagamentos ?? []).includes(date) && !(item.pagamentos ?? []).includes(month) && !(item.ignorados ?? []).includes(date) && (!item.encerradoEm || date < item.encerradoEm)).map((date) => ({ item, date })));
  const fixed = active.filter(({ item }) => item.tipo === 'fixa').reduce((sum, { item }) => sum + item.valor, 0);
  const debts = active.filter(({ item }) => item.tipo === 'divida' || item.recorrencia === 'parcelada').reduce((sum, { item }) => sum + item.valor, 0);
  const planned = active.filter(({ item }) => item.tipo !== 'fixa' && item.tipo !== 'divida' && item.recorrencia !== 'parcelada').reduce((sum, { item }) => sum + item.valor, 0);
  const cardIds = new Set(cards.map((item) => item.id));
  const cardExpensesForMonth = cardExpenses.filter((item) => cardIds.has(item.cardId) && isCardExpenseDue(item, month) && !item.pagamentos.includes(month));
  const cardTotal = cardExpensesForMonth.reduce((sum, item) => sum + item.valor, 0);
  const total = fixed + debts + planned + cardTotal;
  return { total, fixed, debts, cards: cardTotal, planned, pending: total, commitments: active.length + cardExpensesForMonth.length };
}
