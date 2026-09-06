import type { ProfileType } from '@/types';

export interface ProfileConfig {
  id: ProfileType;
  nome: string;
  descricao: string;
  cor: string;
  corLight: string;
  icon: string;
  objetivo: string;
  menu: { label: string; path: string; icon: string }[];
  features: {
    orcamento: boolean;
    contas: boolean;
    metas: boolean;
    patrimonio: boolean;
    analises: boolean;
    investimentos: boolean;
    aprender: boolean;
    comparacaoMensal: boolean;
  evolucao: boolean;
  planejamento: boolean;
  relatoriosAvancados: boolean;
  sugestoes: boolean;
  scoreSaude: boolean;
  metasAvancadas: boolean;
  contasOrganizadas: boolean;
  reducaoCategoria: boolean;
    atualizarPatrimonio: boolean;
    otimizarGastos: boolean;
    analisarRelatorio: boolean;
    estudarInvestimento: boolean;
  criarOrcamento: boolean;
    organizarContas: boolean;
    guardarValor: boolean;
    criarMeta: boolean;
  };
}

export const PROFILES: Record<ProfileType, ProfileConfig> = {
  explorer: {
    id: 'explorer',
    nome: 'Explorador Financeiro',
    descricao: 'Criar consciência financeira',
    cor: '#16a34a',
    corLight: '#dcfce7',
    icon: 'Compass',
    objetivo: 'Criar consciência financeira',
    menu: [
      { label: 'Início', path: '/dashboard', icon: 'Home' },
      { label: 'Gastos', path: '/gastos', icon: 'Wallet' },
      { label: 'Aprender', path: '/aprender', icon: 'GraduationCap' },
      { label: 'Perfil', path: '/perfil', icon: 'User' },
    ],
    features: {
      orcamento: false, contas: false, metas: false, patrimonio: false,
      analises: false, investimentos: false, aprender: true, comparacaoMensal: false,
      evolucao: false, planejamento: false, relatoriosAvancados: false,
      sugestoes: true, scoreSaude: true, metasAvancadas: false,
      contasOrganizadas: false, reducaoCategoria: false, atualizarPatrimonio: false,
      otimizarGastos: false, analisarRelatorio: false, estudarInvestimento: false,
      criarOrcamento: false, organizarContas: false, guardarValor: false,
      criarMeta: false,
    },
  },
  equilibrado: {
    id: 'equilibrado',
    nome: 'Equilibrado Financeiro',
    descricao: 'Organização e equilíbrio',
    cor: '#0891b2',
    corLight: '#cffafe',
    icon: 'Scale',
    objetivo: 'Organizar e equilibrar suas finanças',
    menu: [
      { label: 'Início', path: '/dashboard', icon: 'Home' },
      { label: 'Gastos', path: '/gastos', icon: 'Wallet' },
      { label: 'Contas', path: '/contas', icon: 'CreditCard' },
      { label: 'Metas', path: '/metas', icon: 'Target' },
      { label: 'Perfil', path: '/perfil', icon: 'User' },
    ],
    features: {
      orcamento: true, contas: true, metas: true, patrimonio: false,
      analises: false, investimentos: false, aprender: true, comparacaoMensal: true,
      evolucao: false, planejamento: false, relatoriosAvancados: false,
      sugestoes: true, scoreSaude: true, metasAvancadas: false,
      contasOrganizadas: true, reducaoCategoria: false, atualizarPatrimonio: false,
      otimizarGastos: false, analisarRelatorio: false, estudarInvestimento: false,
      criarOrcamento: true, organizarContas: true, guardarValor: true,
      criarMeta: false,
    },
  },
  construtor: {
    id: 'construtor',
    nome: 'Construtor Financeiro',
    descricao: 'Planejamento e patrimônio',
    cor: '#7c3aed',
    corLight: '#ede9fe',
    icon: 'TrendingUp',
    objetivo: 'Construir patrimônio e planejar o futuro',
    menu: [
      { label: 'Início', path: '/dashboard', icon: 'Home' },
      { label: 'Metas', path: '/metas', icon: 'Target' },
      { label: 'Patrimônio', path: '/patrimonio', icon: 'Landmark' },
      { label: 'Aprender', path: '/aprender', icon: 'GraduationCap' },
      { label: 'Perfil', path: '/perfil', icon: 'User' },
    ],
    features: {
      orcamento: true, contas: true, metas: true, patrimonio: true,
      analises: false, investimentos: false, aprender: true, comparacaoMensal: true,
      evolucao: true, planejamento: true, relatoriosAvancados: false,
      sugestoes: true, scoreSaude: true, metasAvancadas: true,
      contasOrganizadas: true, reducaoCategoria: true, atualizarPatrimonio: true,
      otimizarGastos: false, analisarRelatorio: false, estudarInvestimento: true,
      criarOrcamento: true, organizarContas: true, guardarValor: true,
      criarMeta: true,
    },
  },
  estrategista: {
    id: 'estrategista',
    nome: 'Estrategista Financeiro',
    descricao: 'Análise e otimização',
    cor: '#ea580c',
    corLight: '#ffedd5',
    icon: 'Brain',
    objetivo: 'Otimizar e estratégia financeira avançada',
    menu: [
      { label: 'Início', path: '/dashboard', icon: 'Home' },
      { label: 'Análises', path: '/analises', icon: 'BarChart3' },
      { label: 'Investimentos', path: '/investimentos', icon: 'PiggyBank' },
      { label: 'Contas', path: '/contas', icon: 'CreditCard' },
      { label: 'Metas', path: '/metas', icon: 'Target' },
      { label: 'Perfil', path: '/perfil', icon: 'User' },
    ],
    features: {
      orcamento: true, contas: true, metas: true, patrimonio: true,
      analises: true, investimentos: true, aprender: true, comparacaoMensal: true,
      evolucao: true, planejamento: true, relatoriosAvancados: true,
      sugestoes: true, scoreSaude: true, metasAvancadas: true,
      contasOrganizadas: true, reducaoCategoria: true, atualizarPatrimonio: true,
      otimizarGastos: true, analisarRelatorio: true, estudarInvestimento: true,
      criarOrcamento: true, organizarContas: true, guardarValor: true,
      criarMeta: true,
    },
  },
};

export function getProfileFromScore(score: number): ProfileType {
  if (score <= 3) return 'explorer';
  if (score <= 6) return 'equilibrado';
  if (score <= 8) return 'construtor';
  return 'estrategista';
}
