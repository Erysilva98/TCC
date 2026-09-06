import type { Transaction, CategoryId, Budget } from '@/types';
import { isSameMonth, isPreviousMonth, getMonthKey } from './format';

export function getSaldo(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => acc + (t.tipo === 'receita' ? t.valor : -t.valor), 0);
}

export function getReceitasMes(transactions: Transaction[], ref: Date = new Date()): number {
  return transactions
    .filter((t) => t.tipo === 'receita' && isSameMonth(t.data, ref))
    .reduce((acc, t) => acc + t.valor, 0);
}

export function getDespesasMes(transactions: Transaction[], ref: Date = new Date()): number {
  return transactions
    .filter((t) => t.tipo === 'despesa' && isSameMonth(t.data, ref))
    .reduce((acc, t) => acc + t.valor, 0);
}

export function getGastosPorCategoria(transactions: Transaction[], ref: Date = new Date()): { categoria: CategoryId; valor: number }[] {
  const map = new Map<CategoryId, number>();
  transactions
    .filter((t) => t.tipo === 'despesa' && isSameMonth(t.data, ref))
    .forEach((t) => {
      map.set(t.categoria, (map.get(t.categoria) || 0) + t.valor);
    });
  return Array.from(map.entries())
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);
}

export function getGastosCategoriaMesAnterior(transactions: Transaction[], categoria: CategoryId): number {
  return transactions
    .filter((t) => t.tipo === 'despesa' && t.categoria === categoria && isPreviousMonth(t.data))
    .reduce((acc, t) => acc + t.valor, 0);
}

export function getScoreSaude(transactions: Transaction[], budgets: Budget[]): number {
  const receitas = getReceitasMes(transactions);
  const despesas = getDespesasMes(transactions);
  let score = 50;

  if (receitas > 0) {
    const taxaPoupanca = (receitas - despesas) / receitas;
    if (taxaPoupanca > 0.2) score += 30;
    else if (taxaPoupanca > 0.1) score += 20;
    else if (taxaPoupanca > 0) score += 10;
    else if (taxaPoupanca < -0.2) score -= 30;
    else if (taxaPoupanca < 0) score -= 15;
  }

  if (budgets.length > 0) {
    let dentroOrcamento = 0;
    let totalOrcado = 0;
    for (const b of budgets) {
      const gasto = transactions
        .filter((t) => t.tipo === 'despesa' && t.categoria === b.categoria && isSameMonth(t.data))
        .reduce((acc, t) => acc + t.valor, 0);
      if (gasto <= b.limite) dentroOrcamento++;
      totalOrcado++;
    }
    if (totalOrcado > 0) score += Math.round((dentroOrcamento / totalOrcado) * 20);
  }

  return Math.max(0, Math.min(100, score));
}

export interface Sugestao {
  tipo: 'alerta' | 'positivo' | 'info';
  texto: string;
  icon: string;
}

export function getSugestoes(transactions: Transaction[], budgets: Budget[]): Sugestao[] {
  const sugestoes: Sugestao[] = [];
  const gastosCategoria = getGastosPorCategoria(transactions);

  for (const g of gastosCategoria) {
    const anterior = getGastosCategoriaMesAnterior(transactions, g.categoria);
    if (anterior > 0 && g.valor > anterior * 1.15) {
      const aumento = Math.round((g.valor / anterior - 1) * 100);
      const catNome = g.categoria.charAt(0).toUpperCase() + g.categoria.slice(1);
      sugestoes.push({
        tipo: 'alerta',
        texto: `Você gastou ${aumento}% mais em ${catNome} este mês.`,
        icon: 'TrendingUp',
      });
    }
  }

  for (const b of budgets) {
    const gasto = transactions
      .filter((t) => t.tipo === 'despesa' && t.categoria === b.categoria && isSameMonth(t.data))
      .reduce((acc, t) => acc + t.valor, 0);
    if (gasto > b.limite) {
      const catNome = b.categoria.charAt(0).toUpperCase() + b.categoria.slice(1);
      sugestoes.push({
        tipo: 'alerta',
        texto: `Você ultrapassou o orçamento de ${catNome} em ${Math.round((gasto / b.limite - 1) * 100)}%.`,
        icon: 'AlertTriangle',
      });
    }
  }

  const receitas = getReceitasMes(transactions);
  const despesas = getDespesasMes(transactions);
  if (receitas > 0 && receitas - despesas > receitas * 0.2) {
    sugestoes.push({
      tipo: 'positivo',
      texto: `Parabéns! Você poupou mais de 20% da sua renda este mês.`,
      icon: 'CheckCircle',
    });
  }

  if (transactions.length === 0) {
    sugestoes.push({
      tipo: 'info',
      texto: 'Comece registrando seus primeiros gastos para receber sugestões personalizadas.',
      icon: 'Lightbulb',
    });
  }

  if (sugestoes.length === 0) {
    sugestoes.push({
      tipo: 'info',
      texto: 'Continue registrando suas transações para receber insights personalizados.',
      icon: 'Lightbulb',
    });
  }

  return sugestoes.slice(0, 4);
}

export function getComparacaoMensal(transactions: Transaction[]): { mes: string; receitas: number; despesas: number }[] {
  const result: { mes: string; receitas: number; despesas: number }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const ref = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    result.push({
      mes: monthNames[ref.getMonth()],
      receitas: getReceitasMes(transactions, ref),
      despesas: getDespesasMes(transactions, ref),
    });
  }
  return result;
}

export function getPatrimonio(transactions: Transaction[], assets: { valor: number }[]): number {
  const saldo = getSaldo(transactions);
  const assetTotal = assets.reduce((acc, a) => acc + a.valor, 0);
  return saldo + assetTotal;
}

export function getLevel(xp: number): { level: number; current: number; needed: number; progress: number } {
  const level = Math.floor(xp / 100) + 1;
  const current = xp % 100;
  const needed = 100;
  const progress = (current / needed) * 100;
  return { level, current, needed, progress };
}

export function getDesafiosMes(challenges: Challenge[], ref: Date = new Date()): Challenge[] {
  const key = getMonthKey(ref);
  return challenges.filter((c) => c.mes === key);
}

import type { Challenge } from '@/types';
