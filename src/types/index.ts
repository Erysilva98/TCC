export type ProfileType = 'explorer' | 'equilibrado' | 'construtor' | 'estrategista' | 'mestre';

export type TransactionType = 'receita' | 'despesa';

export type CategoryId =
  | 'alimentacao'
  | 'transporte'
  | 'moradia'
  | 'lazer'
  | 'saude'
  | 'educacao'
  | 'salario'
  | 'outros';

export interface Transaction {
  id: string;
  tipo: TransactionType;
  valor: number;
  categoria: CategoryId;
  data: string; // ISO date string
  descricao?: string;
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
  lessonProgress: LessonProgress[];
  budgets: Budget[];
  transfers: Transfer[];
  xp: number;
  cardOrder: string[];
  disabledCards: string[];
}
