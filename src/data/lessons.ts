import type { ProfileType } from '@/types';

export interface Lesson {
  id: string;
  titulo: string;
  descricao: string;
  duracao: string;
  xp: number;
  perfil: ProfileType[] | 'all';
  conteudo: string;
  desafio: string;
  nivel?: number;
  modulo?: string;
  desafioPratico?: { tipo: string; descricao: string; validacao: string; rota: string };
}

export const LESSONS: Lesson[] = [
  {
    id: 'l1',
    titulo: 'O que é orçamento pessoal?',
    descricao: 'Aprenda a base de qualquer vida financeira saudável.',
    duracao: '3 min',
    xp: 15,
    perfil: ['explorer', 'equilibrado'],
    desafio: 'completar_aula',
    conteudo: 'Orçamento é o planejamento de quanto você ganha e quanto gasta. O primeiro passo é saber exatamente para onde seu dinheiro vai. Anote tudo por um mês e você já terá mais controle que 90% das pessoas.',
  },
  {
    id: 'l2',
    titulo: 'Diferença entre necessidade e desejo',
    descricao: 'Aprenda a identificar gastos impulsivos.',
    duracao: '4 min',
    xp: 15,
    perfil: ['explorer', 'equilibrado'],
    desafio: 'completar_aula',
    conteudo: 'Necessidade é algo essencial (alimentação, moradia, saúde). Desejo é algo que melhora sua vida mas não é essencial (lazer, roupas extras). Antes de comprar, pergunte: preciso mesmo disso agora?',
  },
  {
    id: 'l3',
    titulo: 'Como criar uma reserva de emergência',
    descricao: 'O primeiro passo para segurança financeira.',
    duracao: '5 min',
    xp: 15,
    perfil: ['equilibrado', 'construtor'],
    desafio: 'completar_aula',
    conteudo: 'Reserva de emergência é um valor guardado para imprevistos. O ideal é ter de 3 a 6 meses de despesas guardados. Comece pequeno: guarde R$ 100 por semana e já terá R$ 400 em um mês.',
  },
  {
    id: 'l4',
    titulo: 'Entendendo investimentos básicos',
    descricao: 'Renda fixa, Tesouro Direto e os primeiros passos.',
    duracao: '6 min',
    xp: 15,
    perfil: ['construtor', 'estrategista'],
    desafio: 'completar_aula',
    conteudo: 'Investir é fazer seu dinheiro trabalhar por você. A renda fixa (Tesouro Direto, CDB) é o ponto de partida: baixo risco e rendimento previsível. Comece com o que sobra do orçamento, mesmo que seja pouco.',
  },
  {
    id: 'l5',
    titulo: 'Análise de gastos por categoria',
    descricao: 'Como identificar gargalos no seu orçamento.',
    duracao: '5 min',
    xp: 15,
    perfil: ['construtor', 'estrategista'],
    desafio: 'completar_aula',
    conteudo: 'Analise seus gastos por categoria nos últimos 3 meses. Procure categorias que cresceram sem você perceber. Reduzir 10% em uma categoria já gera economia significativa ao longo do ano.',
  },
  {
    id: 'l6',
    titulo: 'Planejamento financeiro de longo prazo',
    descricao: 'Metas de 1, 5 e 10 anos.',
    duracao: '7 min',
    xp: 15,
    perfil: ['construtor', 'estrategista'],
    desafio: 'completar_aula',
    conteudo: 'Planejamento de longo prazo envolve definir onde quer estar financeiramente em 5 e 10 anos. Divida metas grandes em pequenas. Revise trimestralmente. Ajuste conforme a realidade muda.',
  },
  {
    id: 'l7',
    titulo: 'Otimização de gastos',
    descricao: 'Técnicas avançadas para reduzir despesas.',
    duracao: '6 min',
    xp: 15,
    perfil: ['estrategista'],
    desafio: 'completar_aula',
    conteudo: 'Otimização vai além de cortar: é renegociar tarifas, trocar serviços por equivalentes mais baratos, agrupar assinaturas. Analise cada despesa recorrente e pergunte: existe forma mais barata de ter o mesmo resultado?',
  },
  {
    id: 'l8',
    titulo: 'Construindo patrimônio',
    descricao: 'Diversificação e crescimento de patrimônio.',
    duracao: '8 min',
    xp: 15,
    perfil: ['construtor', 'estrategista'],
    desafio: 'completar_aula',
    conteudo: 'Patrimônio é tudo o que você possui. Para crescer: diversifique entre imóveis, investimentos e negócios. Reinvista parte dos ganhos. Tempo e consistência são mais importantes que o valor inicial.',
  },
];

export function getLessonsForProfile(profile: ProfileType): Lesson[] {
  return TRACK_LESSONS.filter((l) => l.perfil === 'all' || l.perfil.includes(profile));
}

const TRACKS: Record<ProfileType, { modules: string[]; topics: string[]; tasks: { tipo: string; descricao: string; validacao: string; rota: string }[] }> = {
  explorer: { modules: ['Conhecendo meu dinheiro', 'Consumo consciente', 'Primeiro planejamento'], topics: ['Controle financeiro', 'Para onde meu dinheiro vai', 'Receita x despesa', 'Necessidade e desejo', 'Hábitos financeiros', 'Metas iniciais'], tasks: [{ tipo: 'transacao', descricao: 'Registre uma transação no app.', validacao: 'transacao', rota: '/gastos' }, { tipo: 'categoria', descricao: 'Registre despesas em duas categorias.', validacao: 'categorias', rota: '/gastos' }, { tipo: 'meta', descricao: 'Crie sua primeira meta.', validacao: 'meta', rota: '/metas' }] },
  equilibrado: { modules: ['Orçamento mensal', 'Organização financeira', 'Reserva e acompanhamento'], topics: ['Orçamento', 'Contas financeiras', 'Reserva financeira', 'Organização mensal', 'Comparação financeira', 'Economia planejada'], tasks: [{ tipo: 'orcamento', descricao: 'Defina um orçamento para uma categoria.', validacao: 'orcamento', rota: '/perfil' }, { tipo: 'conta', descricao: 'Cadastre uma conta com saldo.', validacao: 'conta', rota: '/contas' }, { tipo: 'transacao', descricao: 'Registre uma receita ou despesa.', validacao: 'transacao', rota: '/gastos' }] },
  construtor: { modules: ['Metas avançadas', 'Patrimônio', 'Investimentos básicos'], topics: ['Metas com prazo', 'Planejamento', 'Patrimônio', 'Investimentos', 'Evolução financeira', 'Diversificação'], tasks: [{ tipo: 'meta', descricao: 'Crie uma meta financeira.', validacao: 'meta', rota: '/metas' }, { tipo: 'ativo', descricao: 'Cadastre um item de patrimônio.', validacao: 'ativo', rota: '/patrimonio' }, { tipo: 'investimento', descricao: 'Cadastre um investimento.', validacao: 'investimento', rota: '/investimentos' }] },
  estrategista: { modules: ['Análise financeira', 'Otimização', 'Estratégia patrimonial'], topics: ['Indicadores', 'Relatórios', 'Projeções', 'Redução inteligente', 'Investimentos', 'Estratégia'], tasks: [{ tipo: 'transacao', descricao: 'Registre movimentações para análise.', validacao: 'transacao', rota: '/gastos' }, { tipo: 'ativo', descricao: 'Atualize seu patrimônio.', validacao: 'ativo', rota: '/patrimonio' }, { tipo: 'investimento', descricao: 'Registre um investimento.', validacao: 'investimento', rota: '/investimentos' }] },
  mestre: { modules: ['Auditoria financeira', 'Independência financeira', 'Estratégia de longo prazo'], topics: ['Auditoria', 'Planejamento anual', 'Diversificação', 'Independência', 'Carteira patrimonial', 'Legado financeiro'], tasks: [{ tipo: 'orcamento', descricao: 'Revise um orçamento financeiro.', validacao: 'orcamento', rota: '/perfil' }, { tipo: 'ativo', descricao: 'Atualize seu patrimônio.', validacao: 'ativo', rota: '/patrimonio' }, { tipo: 'meta', descricao: 'Crie uma meta de longo prazo.', validacao: 'meta', rota: '/metas' }] },
};

export const TRACK_LESSONS: Lesson[] = (Object.keys(TRACKS) as ProfileType[]).flatMap((perfil) => Array.from({ length: 30 }, (_, index) => {
  const track = TRACKS[perfil]; const tier = Math.floor(index / 10); const baseTask = track.tasks[index % track.tasks.length];
  const topic = track.topics[index % track.topics.length];
  const task = { ...baseTask, descricao: `${baseTask.descricao} Nesta missão, aplique ${topic.toLowerCase()} na etapa ${index + 1} da sua trilha.` };
  return { id: `track-${perfil}-${index + 1}`, titulo: `${topic}: passo ${index + 1}`, descricao: `Aplique ${topic.toLowerCase()} à sua realidade financeira.`, duracao: `${3 + tier * 2} min`, xp: 10 + tier * 10, perfil: [perfil], desafio: task.tipo, nivel: tier * 33 + (index % 10) * 3 + 1, modulo: track.modules[tier], conteudo: `Nesta aula você aprende sobre ${topic.toLowerCase()} e transforma o conceito em uma decisão prática dentro do FinEdu Wallet.`, desafioPratico: task };
}));

export function getLessonById(id: string): Lesson | undefined { return [...LESSONS, ...TRACK_LESSONS].find((lesson) => lesson.id === id); }
