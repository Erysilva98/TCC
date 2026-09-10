export type ProfileType = 'explorer' | 'equilibrado' | 'construtor' | 'estrategista' | 'mestre';

export type TransactionType = 'receita' | 'despesa';

export type CategoryId =
  | 'alimentacao'
  | 'transporte'
  | 'moradia'
  | 'lazer'
  | 'saude'
  | 'educacao'
  | 'cartao_credito'
  | 'investimentos_economia'
  | 'salario'
  | 'outros';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  valor: number;
  categoria: CategoryId;
  data: string; // ISO date string
  descricao?: string;
  origem?: 'divida' | 'prevista' | 'cartao' | 'fixa' | 'recorrente';
}

export type PlannedExpenseType = 'divida' | 'fixa' | 'recorrente' | 'avulsa' | 'outro';
export type Recurrence = 'unica' | 'mensal' | 'quinzenal' | 'semanal' | 'anual' | 'parcelada';

export interface PlannedExpense {
  id: string;
  titulo: string;
  categoria: CategoryId;
  valor: number;
  tipo: PlannedExpenseType;
  dataInicio: string;
  vencimento: string;
  recorrencia: Recurrence;
  repeticoes?: number;
  totalParcelas?: number;
  parcelaAtual?: number;
  observacao?: string;
  status: 'ativo' | 'finalizado';
  pagamentos: string[];
  ignorados?: string[];
  encerradoEm?: string;
}

export interface CreditCard {
  id: string;
  nome: string;
  bandeira?: string;
  cor: string;
  limite?: number;
  diaFechamento: number;
  diaVencimento: number;
  observacao?: string;
}

export interface CreditCardExpense {
  id: string;
  cardId: string;
  titulo: string;
  categoria: CategoryId;
  valor: number;
  dataCompra: string;
  tipo: 'unica' | 'parcelada' | 'recorrente';
  parcelas?: number;
  parcelaAtual?: number;
  observacao?: string;
  pagamentos: string[];
}

export interface Goal {
  id: string;
  titulo: string;
  valorAlvo: number;
  valorAtual: number;
  categoria?: CategoryId;
  prazo?: string;
  criadaEm: string;
}

export interface Account {
  id: string;
  nome: string;
  tipo: 'conta_corrente' | 'poupanca' | 'cartao' | 'dinheiro';
  saldo: number;
  cor: string;
}

export interface Asset {
  id: string;
  nome: string;
  tipo: 'imovel' | 'investimento' | 'veiculo' | 'outro';
  valor: number;
}

export interface Challenge {
  id: string;
  titulo: string;
  descricao: string;
  xp: number;
  perfil: ProfileType;
  concluido: boolean;
  mes: string; // YYYY-MM
  nivelMinimo?: number;
  categoria?: string;
  validacao?: string;
  teste?: boolean;
}

export interface ChallengeHistoryEntry {
  templateId: string;
  perfil: ProfileType;
  mes: string;
}

export interface LessonProgress {
  lessonId: string;
  concluido: boolean;
  concluidoEm?: string;
}

export interface OnboardingState {
  completed: boolean;
  score: number;
  profile: ProfileType | null;
  initialProfile?: ProfileType | null;
}

export interface Budget {
  categoria: CategoryId;
  limite: number;
}

export interface Transfer {
  id: string;
  contaOrigemId: string;
  contaDestinoId: string;
  valor: number;
  data: string;
  descricao?: string;
}

export interface AppState {
  onboarding: OnboardingState;
  transactions: Transaction[];
  goals: Goal[];
  accounts: Account[];
  assets: Asset[];
  challenges: Challenge[];
  challengeHistory: ChallengeHistoryEntry[];
  lessonProgress: LessonProgress[];
  budgets: Budget[];
  investmentGoal: number;
  transfers: Transfer[];
  plannedExpenses: PlannedExpense[];
  creditCards: CreditCard[];
  creditCardExpenses: CreditCardExpense[];
  xp: number;
  cardOrder: string[];
  disabledCards: string[];
}
