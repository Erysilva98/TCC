import { create } from 'zustand';
import type {
  AppState, Transaction, Goal, Account, Asset, Challenge,
  ProfileType, Budget, LessonProgress, CategoryId, Transfer, OnboardingState, PlannedExpense, CreditCard, CreditCardExpense,
} from '@/types';
import { clearState, loadState, saveState } from '@/lib/db';
import { getProfileFromExperience, getProfileFromScore, getProfileRank } from '@/data/profiles';
import { generateChallengesForProfile, getCurrentMonthKey } from '@/data/challenges';
import { canCompleteChallenge, canCompleteLesson } from '@/lib/progress';
import { getLevel } from '@/lib/analytics';
import { getLessonById } from '@/data/lessons';
import { isCardExpenseDue } from '@/lib/forecast';

const DEFAULT_CARDS = ['saldo', 'entradas_saidas', 'gastos_categoria', 'score', 'metas'];

function initialState(): AppState {
  return {
    onboarding: { completed: false, score: 0, profile: null, initialProfile: null },
    transactions: [],
    goals: [],
    accounts: [],
    assets: [],
    challenges: [],
    challengeHistory: [],
    lessonProgress: [],
    budgets: [],
    investmentGoal: 0,
    transfers: [],
    plannedExpenses: [],
    creditCards: [],
    creditCardExpenses: [],
    xp: 0,
    cardOrder: [...DEFAULT_CARDS],
    disabledCards: [],
  };
}

interface StoreActions {
  init: () => Promise<void>;
  completeOnboarding: (score: number) => void;
  addTransaction: (t: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (g: Omit<Goal, 'id' | 'criadaEm' | 'valorAtual'>) => void;
  updateGoal: (id: string, valorAtual: number) => void;
  deleteGoal: (id: string) => void;
  addAccount: (a: Omit<Account, 'id'>) => void;
  updateAccountBalance: (id: string, newSaldo: number) => void;
  deleteAccount: (id: string) => void;
  addAsset: (a: Omit<Asset, 'id'>) => void;
  deleteAsset: (id: string) => void;
  addInvestment: (nome: string, valor: number) => void;
  transferBetweenAccounts: (origemId: string, destinoId: string, valor: number, descricao?: string) => void;
  addXp: (amount: number) => void;
  completeChallenge: (id: string) => void;
  completeLesson: (lessonId: string) => void;
  setBudget: (categoria: CategoryId, limite: number) => void;
  deleteBudget: (categoria: CategoryId) => void;
  setInvestmentGoal: (valor: number) => void;
  addPlannedExpense: (item: Omit<PlannedExpense, 'id' | 'pagamentos' | 'status'>) => void;
  updatePlannedExpense: (id: string, item: Partial<PlannedExpense>) => void;
  deletePlannedExpense: (id: string) => void;
  payPlannedExpense: (id: string, date?: string) => void;
  addCreditCard: (card: Omit<CreditCard, 'id'>) => void;
  updateCreditCard: (id: string, card: Partial<CreditCard>) => void;
  deleteCreditCard: (id: string) => void;
  addCreditCardExpense: (expense: Omit<CreditCardExpense, 'id' | 'pagamentos'>) => void;
  deleteCreditCardExpense: (id: string) => void;
  payCreditCardInvoice: (cardId: string, monthKey: string) => void;
  toggleCard: (cardId: string) => void;
  reorderCards: (newOrder: string[]) => void;
  resetApp: () => Promise<void>;
  _persist: () => void;
  _ensureMonthlyChallenges: () => void;
}

type Store = AppState & StoreActions;

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSave(state: AppState) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveState(state);
  }, 300);
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function updateProfileFromExperience(onboarding: OnboardingState, xp: number): OnboardingState {
  const initialProfile = onboarding.initialProfile ?? onboarding.profile;
  if (!initialProfile) return onboarding;
  return { ...onboarding, initialProfile, profile: getProfileFromExperience(initialProfile, xp) };
}

export const useStore = create<Store>((set, get) => ({
  ...initialState(),

  init: async () => {
    const saved = await loadState();
    if (saved) {
      const merged = { ...initialState(), ...saved };
      merged.plannedExpenses = merged.plannedExpenses.map((expense) => ({ ...expense, pagamentos: expense.pagamentos ?? [], status: expense.status ?? 'ativo' }));
      const currentMonth = getCurrentMonthKey();
      merged.challenges = merged.challenges.filter((challenge) => !(challenge.mes === currentMonth && (challenge.teste || !challenge.nivelMinimo)));
      merged.cardOrder = [...new Set(merged.cardOrder.filter((cardId) => cardId !== 'contas' && cardId !== 'sugestoes'))];
      merged.disabledCards = merged.disabledCards.filter((cardId) => cardId !== 'contas' && cardId !== 'sugestoes');
      for (const cardId of DEFAULT_CARDS) {
        if (!merged.cardOrder.includes(cardId)) merged.cardOrder.push(cardId);
      }
      merged.onboarding = updateProfileFromExperience(merged.onboarding, merged.xp);
      set({ ...merged });
      get()._ensureMonthlyChallenges();
    }
  },

  completeOnboarding: (score) => {
    const profile = getProfileFromScore(score);
    const monthKey = getCurrentMonthKey();
    const challenges = generateChallengesForProfile(profile, monthKey);
    set((s) => ({
      onboarding: { completed: true, score, profile, initialProfile: profile },
      challenges,
      challengeHistory: challenges.filter((challenge) => !challenge.teste).map((challenge) => ({ templateId: challenge.id.replace(`_${monthKey}`, ''), perfil: profile, mes: monthKey })),
    }));
    get()._persist();
  },

  addTransaction: (t) => {
    const transaction: Transaction = { ...t, id: uid() };
    set((s) => {
      const xp = s.xp + 5;
      return { transactions: [transaction, ...s.transactions], xp, onboarding: updateProfileFromExperience(s.onboarding, xp) };
    });
    get()._ensureMonthlyChallenges();
    get()._persist();
  },

  deleteTransaction: (id) => {
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
    get()._persist();
  },

  addGoal: (g) => {
    const goal: Goal = { ...g, id: uid(), criadaEm: new Date().toISOString(), valorAtual: 0 };
    set((s) => {
      const xp = s.xp + 30;
      return { goals: [...s.goals, goal], xp, onboarding: updateProfileFromExperience(s.onboarding, xp) };
    });
    get()._ensureMonthlyChallenges();
    get()._persist();
  },

  updateGoal: (id, valorAtual) => {
    set((s) => ({
      goals: s.goals.map((g) => (g.id === id ? { ...g, valorAtual } : g)),
    }));
    get()._persist();
  },

  deleteGoal: (id) => {
    set((s) => ({ goals: s.goals.filter((g) => g.id !== id) }));
    get()._persist();
  },

  addAccount: (a) => {
    const account: Account = { ...a, id: uid() };
    set((s) => ({ accounts: [...s.accounts, account] }));
    get()._persist();
  },

  updateAccountBalance: (id, newSaldo) => {
    set((s) => ({
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, saldo: newSaldo } : a)),
    }));
    get()._persist();
  },

  deleteAccount: (id) => {
    set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) }));
    get()._persist();
  },

  addAsset: (a) => {
    const asset: Asset = { ...a, id: uid() };
    set((s) => ({ assets: [...s.assets, asset] }));
    get()._persist();
  },

  deleteAsset: (id) => {
    set((s) => ({ assets: s.assets.filter((a) => a.id !== id) }));
    get()._persist();
  },

  addInvestment: (nome, valor) => {
    const asset: Asset = { id: uid(), nome, tipo: 'investimento', valor };
    set((s) => ({ assets: [...s.assets, asset] }));
    get()._persist();
  },

  transferBetweenAccounts: (origemId, destinoId, valor, descricao) => {
    if (origemId === destinoId || valor <= 0) return;
    const transfer: Transfer = {
      id: uid(),
      contaOrigemId: origemId,
      contaDestinoId: destinoId,
      valor,
      data: new Date().toISOString(),
      descricao,
    };
    set((s) => ({
      transfers: [transfer, ...s.transfers],
      accounts: s.accounts.map((a) => {
        if (a.id === origemId) return { ...a, saldo: a.saldo - valor };
        if (a.id === destinoId) return { ...a, saldo: a.saldo + valor };
        return a;
      }),
    }));
    get()._persist();
  },

  addXp: (amount) => {
    set((s) => {
      const xp = Math.max(0, s.xp + amount);
      return { xp, onboarding: updateProfileFromExperience(s.onboarding, xp) };
    });
    get()._ensureMonthlyChallenges();
    get()._persist();
  },

  completeChallenge: (id) => {
    set((s) => {
      const challenge = s.challenges.find((c) => c.id === id);
      if (!challenge || challenge.concluido || !canCompleteChallenge(challenge, s)) return s;
      const xp = s.xp + challenge.xp;
      return {
        challenges: s.challenges.map((c) =>
          c.id === id ? { ...c, concluido: true } : c
        ),
        xp,
        onboarding: updateProfileFromExperience(s.onboarding, xp),
      };
    });
    get()._ensureMonthlyChallenges();
    get()._persist();
  },

  completeLesson: (lessonId) => {
    set((s) => {
      const existing = s.lessonProgress.find((l) => l.lessonId === lessonId);
      if (existing?.concluido || !canCompleteLesson(lessonId, s)) return s;
      const progress: LessonProgress = {
        lessonId,
        concluido: true,
        concluidoEm: new Date().toISOString(),
      };
      const xp = s.xp + (getLessonById(lessonId)?.xp ?? 15);
      return {
        lessonProgress: existing
          ? s.lessonProgress.map((l) => (l.lessonId === lessonId ? progress : l))
          : [...s.lessonProgress, progress],
        xp,
        onboarding: updateProfileFromExperience(s.onboarding, xp),
      };
    });
    get()._ensureMonthlyChallenges();
    get()._persist();
  },

  addPlannedExpense: (item) => {
    set((s) => ({ plannedExpenses: [...s.plannedExpenses, { ...item, id: uid(), status: 'ativo', pagamentos: [] }] }));
    get()._persist();
  },

  updatePlannedExpense: (id, item) => {
    set((s) => ({ plannedExpenses: s.plannedExpenses.map((expense) => expense.id === id ? { ...expense, ...item } : expense) }));
    get()._persist();
  },

  deletePlannedExpense: (id) => {
    set((s) => ({ plannedExpenses: s.plannedExpenses.filter((expense) => expense.id !== id) }));
    get()._persist();
  },

  payPlannedExpense: (id, date = new Date().toISOString()) => {
    set((s) => {
      const expense = s.plannedExpenses.find((item) => item.id === id);
      const paymentKey = date.slice(0, 10);
      if (!expense || (expense.pagamentos ?? []).includes(paymentKey)) return s;
      const month = date.slice(0, 7);
      const paymentDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T12:00:00` : date;
      const parcelada = expense.recorrencia === 'parcelada';
      const nextInstallment = (expense.parcelaAtual ?? 1) + (parcelada ? 1 : 0);
      const finalizado = parcelada && expense.totalParcelas !== undefined && nextInstallment > expense.totalParcelas;
      const transaction: Transaction = { id: uid(), tipo: 'despesa', valor: expense.valor, categoria: expense.categoria, data: paymentDate, descricao: expense.titulo, origem: expense.tipo === 'divida' ? 'divida' : expense.tipo === 'fixa' ? 'fixa' : expense.tipo === 'recorrente' ? 'recorrente' : 'prevista' };
      const xp = s.xp + 5;
      return { transactions: [transaction, ...s.transactions], xp, onboarding: updateProfileFromExperience(s.onboarding, xp), plannedExpenses: s.plannedExpenses.map((item) => item.id === id ? { ...item, pagamentos: [...(item.pagamentos ?? []), paymentKey], parcelaAtual: parcelada ? nextInstallment : item.parcelaAtual, status: finalizado ? 'finalizado' : item.status } : item) };
    });
    get()._ensureMonthlyChallenges(); get()._persist();
  },

  addCreditCard: (card) => { set((s) => ({ creditCards: [...s.creditCards, { ...card, id: uid() }] })); get()._persist(); },
  updateCreditCard: (id, card) => { set((s) => ({ creditCards: s.creditCards.map((item) => item.id === id ? { ...item, ...card } : item) })); get()._persist(); },
  deleteCreditCard: (id) => { set((s) => ({ creditCards: s.creditCards.filter((item) => item.id !== id) })); get()._persist(); },
  addCreditCardExpense: (expense) => { set((s) => ({ creditCardExpenses: [...s.creditCardExpenses, { ...expense, id: uid(), pagamentos: [] }] })); get()._persist(); },
  deleteCreditCardExpense: (id) => { set((s) => ({ creditCardExpenses: s.creditCardExpenses.filter((item) => item.id !== id) })); get()._persist(); },
  payCreditCardInvoice: (cardId, monthKey) => {
    set((s) => {
      const expenses = s.creditCardExpenses.filter((item) => item.cardId === cardId && isCardExpenseDue(item, monthKey) && !item.pagamentos.includes(monthKey));
      if (!expenses.length) return s;
      const transaction: Transaction = { id: uid(), tipo: 'despesa', valor: expenses.reduce((sum, item) => sum + item.valor, 0), categoria: 'outros', data: `${monthKey}-01`, descricao: `Fatura do cartão`, origem: 'cartao' };
      const xp = s.xp + 5;
      return { transactions: [transaction, ...s.transactions], xp, onboarding: updateProfileFromExperience(s.onboarding, xp), creditCardExpenses: s.creditCardExpenses.map((item) => expenses.some((expense) => expense.id === item.id) ? { ...item, pagamentos: [...item.pagamentos, monthKey], parcelaAtual: item.tipo === 'parcelada' ? (item.parcelaAtual ?? 1) + 1 : item.parcelaAtual } : item) };
    });
    get()._ensureMonthlyChallenges(); get()._persist();
  },

  setBudget: (categoria, limite) => {
    set((s) => {
      const existing = s.budgets.find((b) => b.categoria === categoria);
      const budget: Budget = { categoria, limite };
      return {
        budgets: existing
          ? s.budgets.map((b) => (b.categoria === categoria ? budget : b))
          : [...s.budgets, budget],
      };
    });
    get()._persist();
  },

  deleteBudget: (categoria) => {
    set((s) => ({ budgets: s.budgets.filter((budget) => budget.categoria !== categoria) }));
    get()._persist();
  },

  setInvestmentGoal: (valor) => {
    set({ investmentGoal: Math.max(0, valor) });
    get()._persist();
  },

  toggleCard: (cardId) => {
    set((s) => {
      const isDisabled = s.disabledCards.includes(cardId);
      return {
        disabledCards: isDisabled
          ? s.disabledCards.filter((c) => c !== cardId)
          : [...s.disabledCards, cardId],
      };
    });
    get()._persist();
  },

  reorderCards: (newOrder) => {
    set(() => ({ cardOrder: newOrder }));
    get()._persist();
  },

  resetApp: async () => {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
    }
    set({ ...initialState() });
    await clearState();
  },

  _persist: () => {
    const state = get();
    const { init: _init, completeOnboarding: _co, addTransaction: _at, deleteTransaction: _dt,
      addGoal: _ag, updateGoal: _ug, deleteGoal: _dg, addAccount: _aa, updateAccountBalance: _uab,
      deleteAccount: _da, addAsset: _as, deleteAsset: _dsa, addInvestment: _ai,
      transferBetweenAccounts: _tba, addXp: _ax, completeChallenge: _cc,
      completeLesson: _cl, setBudget: _sb, deleteBudget: _db, setInvestmentGoal: _sig, addPlannedExpense: _ape, updatePlannedExpense: _upe, deletePlannedExpense: _dpe, payPlannedExpense: _ppe,
      addCreditCard: _acc, updateCreditCard: _ucc, deleteCreditCard: _dcc, addCreditCardExpense: _acce, deleteCreditCardExpense: _dcce, payCreditCardInvoice: _pcci, toggleCard: _tc, reorderCards: _rc,
      resetApp: _ra, _persist: _p, _ensureMonthlyChallenges: _emc,
      ...rest
    } = state;
    void _init; void _co; void _at; void _dt; void _ag; void _ug; void _dg;
    void _aa; void _uab; void _da; void _as; void _dsa; void _ai; void _tba;
    void _ax; void _cc; void _cl; void _sb; void _db; void _sig; void _ape; void _upe; void _dpe; void _ppe; void _acc; void _ucc; void _dcc; void _acce; void _dcce; void _pcci; void _tc; void _rc; void _ra;
    void _p; void _emc;
    scheduleSave(rest as AppState);
  },

  _ensureMonthlyChallenges: () => {
    const s = get();
    if (!s.onboarding.profile) return;
    const monthKey = getCurrentMonthKey();
    const currentChallenges = s.challenges.filter((challenge) => challenge.mes === monthKey && challenge.perfil === s.onboarding.profile && !challenge.teste);
    if (currentChallenges.length === 4) return;
    const profileRank = getProfileRank(s.onboarding.profile);
    const initialRank = s.onboarding.initialProfile ? getProfileRank(s.onboarding.initialProfile) : profileRank;
    const level = getLevel(s.xp, profileRank, initialRank).level;
    const newChallenges = generateChallengesForProfile(s.onboarding.profile, monthKey, level, s.challengeHistory);
    if (newChallenges.length === 4) {
      const history = [...s.challengeHistory, ...newChallenges.filter((challenge) => !challenge.teste).map((challenge) => ({ templateId: challenge.id.replace(`_${monthKey}`, ''), perfil: challenge.perfil, mes: monthKey }))];
      set({ challenges: [...s.challenges, ...newChallenges], challengeHistory: history });
      get()._persist();
    }
  },
}));
