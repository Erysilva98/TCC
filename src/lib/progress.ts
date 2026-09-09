import type { AppState, Challenge } from '@/types';
import { getLessonById } from '@/data/lessons';

/** Regras verificáveis para liberar os desafios mensais. */
export function canCompleteChallenge(challenge: Challenge, state: Pick<AppState, 'transactions' | 'goals' | 'accounts' | 'assets' | 'budgets' | 'lessonProgress'>): boolean {
  const baseId = challenge.id.replace(/_\d{4}-\d{2}$/, '');
  const expenses = state.transactions.filter((transaction) => transaction.tipo === 'despesa');
  const incomes = state.transactions.filter((transaction) => transaction.tipo === 'receita');
  const completedLessons = new Set(state.lessonProgress.filter((lesson) => lesson.concluido).map((lesson) => lesson.lessonId));

  if (challenge.validacao) {
    const validations: Record<string, boolean> = {
      sempre: true, despesa_1: expenses.length >= 1, despesas_3: expenses.length >= 3,
      receita_1: incomes.length >= 1, categorias_2: new Set(expenses.map((item) => item.categoria)).size >= 2,
      meta_1: state.goals.length >= 1, conta_1: state.accounts.length >= 1, contas_2: state.accounts.length >= 2,
      orcamento_1: state.budgets.length >= 1, saldo_guardado: state.accounts.some((item) => item.saldo > 0) || state.assets.some((item) => item.valor > 0),
      investimento_1: state.assets.some((item) => item.tipo === 'investimento'), ativo_1: state.assets.length >= 1,
      movimentos_3: state.transactions.length >= 3, saldo_positivo: incomes.reduce((sum, item) => sum + item.valor, 0) >= expenses.reduce((sum, item) => sum + item.valor, 0),
    };
    return validations[challenge.validacao] ?? false;
  }

  switch (baseId) {
    case 'exp_reg15': return expenses.length >= 15;
    case 'exp_cat': return expenses.length > 0;
    case 'exp_aula': return completedLessons.size > 0;
    case 'eq_orc': return state.budgets.length >= 3;
    case 'eq_contas': return state.accounts.length >= 2;
    case 'eq_guardar': return incomes.length > 0 && (state.accounts.some((account) => account.saldo > 0) || state.assets.some((asset) => asset.valor > 0));
    case 'con_meta': return state.goals.length > 0;
    case 'con_inv': return completedLessons.has('l4');
    case 'con_red': return expenses.length >= 2;
    case 'est_rel': return state.transactions.length >= 3;
    case 'est_pat': return state.assets.length > 0;
    case 'est_otm': return expenses.length > 0 && incomes.reduce((sum, transaction) => sum + transaction.valor, 0) >= expenses.reduce((sum, transaction) => sum + transaction.valor, 0);
    case 'est_mestre_teste': return true;
    default: return false;
  }
}

export function getChallengeProgress(challenge: Challenge, state: Pick<AppState, 'transactions' | 'goals' | 'accounts' | 'assets' | 'budgets' | 'lessonProgress'>): { current: number; target: number } {
  const baseId = challenge.id.replace(/_\d{4}-\d{2}$/, '');
  const expenses = state.transactions.filter((transaction) => transaction.tipo === 'despesa');
  const completedLessons = state.lessonProgress.filter((lesson) => lesson.concluido).length;
  const values: Record<string, [number, number]> = {
    exp_reg15: [expenses.length, 15], exp_cat: [expenses.length, 1], exp_aula: [completedLessons, 1],
    eq_orc: [state.budgets.length, 3], eq_contas: [state.accounts.length, 2], eq_guardar: [state.transactions.filter((transaction) => transaction.tipo === 'receita').length, 1],
    con_meta: [state.goals.length, 1], con_inv: [state.lessonProgress.some((lesson) => lesson.lessonId === 'l4' && lesson.concluido) ? 1 : 0, 1], con_red: [expenses.length, 2],
    est_rel: [state.transactions.length, 3], est_pat: [state.assets.length, 1], est_otm: [canCompleteChallenge(challenge, state) ? 1 : 0, 1], est_mestre_teste: [1, 1],
  };
  const [current, target] = values[baseId] ?? [0, 1];
  return { current: Math.min(current, target), target };
}

type LessonState = Pick<AppState, 'transactions' | 'goals' | 'accounts' | 'assets' | 'budgets'>;

export function canCompleteLesson(lessonId: string, state: LessonState): boolean {
  const expenses = state.transactions.filter((transaction) => transaction.tipo === 'despesa');
  const lesson = getLessonById(lessonId);
  if (lesson?.desafioPratico) {
    const validations: Record<string, boolean> = {
      transacao: state.transactions.length >= 1,
      categorias: new Set(expenses.map((item) => item.categoria)).size >= 2,
      meta: state.goals.length >= 1,
      orcamento: state.budgets.length >= 1,
      conta: state.accounts.length >= 1,
      ativo: state.assets.length >= 1,
      investimento: state.assets.some((item) => item.tipo === 'investimento'),
    };
    return validations[lesson.desafioPratico.validacao] ?? false;
  }
  switch (lessonId) {
    case 'l1': return state.transactions.length >= 1;
    case 'l2': return expenses.length >= 1;
    case 'l3': return state.accounts.some((account) => account.saldo > 0);
    case 'l4': return state.assets.some((asset) => asset.tipo === 'investimento' && asset.valor > 0);
    case 'l5': return new Set(expenses.map((transaction) => transaction.categoria)).size >= 2;
    case 'l6': return state.goals.length >= 1;
    case 'l7': return state.budgets.length >= 1;
    case 'l8': return state.assets.length >= 1;
    default: return false;
  }
}

export function getLessonTask(lessonId: string): { label: string; path: string } {
  const lesson = getLessonById(lessonId);
  if (lesson?.desafioPratico) return { label: lesson.desafioPratico.descricao, path: lesson.desafioPratico.rota };
  const tasks: Record<string, { label: string; path: string }> = {
    l1: { label: 'Registre uma transação no app.', path: '/gastos' },
    l2: { label: 'Registre uma despesa e classifique-a por categoria.', path: '/gastos' },
    l3: { label: 'Cadastre uma conta com saldo para sua reserva.', path: '/contas' },
    l4: { label: 'Cadastre seu primeiro investimento.', path: '/investimentos' },
    l5: { label: 'Registre despesas em pelo menos duas categorias.', path: '/gastos' },
    l6: { label: 'Crie uma meta financeira com valor e prazo.', path: '/metas' },
    l7: { label: 'Defina um orçamento para uma categoria.', path: '/perfil' },
    l8: { label: 'Cadastre um item de patrimônio ou investimento.', path: '/patrimonio' },
  };
  return tasks[lessonId] ?? { label: 'Realize uma ação financeira no app.', path: '/dashboard' };
}
