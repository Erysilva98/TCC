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
  return LESSONS.filter((l) => l.perfil === 'all' || l.perfil.includes(profile));
}
