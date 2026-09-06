export interface QuestionOption {
  label: string;
  text: string;
  points: number;
}

export interface Question {
  id: number;
  pergunta: string;
  opcoes: QuestionOption[];
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    pergunta: 'Você sabe exatamente para onde seu dinheiro vai todos os meses?',
    opcoes: [
      { label: 'A', text: 'Não muito. Normalmente descubro quando o dinheiro acaba.', points: 0 },
      { label: 'B', text: 'Tenho uma ideia geral, mas não acompanho todos os detalhes.', points: 1 },
      { label: 'C', text: 'Registro ou acompanho meus gastos regularmente.', points: 2 },
    ],
  },
  {
    id: 2,
    pergunta: 'Quando quer comprar algo não planejado:',
    opcoes: [
      { label: 'A', text: 'Compro se tiver dinheiro disponível.', points: 0 },
      { label: 'B', text: 'Penso se realmente preciso.', points: 1 },
      { label: 'C', text: 'Analiso se faz sentido dentro dos meus objetivos.', points: 2 },
    ],
  },
  {
    id: 3,
    pergunta: 'Quando recebe dinheiro:',
    opcoes: [
      { label: 'A', text: 'Começo a gastar e vejo o que sobra.', points: 0 },
      { label: 'B', text: 'Pago algumas coisas e tento guardar.', points: 1 },
      { label: 'C', text: 'Tenho uma divisão planejada.', points: 2 },
    ],
  },
  {
    id: 4,
    pergunta: 'Você guarda dinheiro para objetivos?',
    opcoes: [
      { label: 'A', text: 'Quase nunca.', points: 0 },
      { label: 'B', text: 'Às vezes quando sobra.', points: 1 },
      { label: 'C', text: 'Tenho metas definidas.', points: 2 },
    ],
  },
  {
    id: 5,
    pergunta: 'Qual frase representa sua relação com dinheiro?',
    opcoes: [
      { label: 'A', text: 'Dinheiro é para aproveitar o presente.', points: 0 },
      { label: 'B', text: 'Quero aproveitar e ter segurança.', points: 1 },
      { label: 'C', text: 'Planejo hoje para conquistar no futuro.', points: 2 },
    ],
  },
];
