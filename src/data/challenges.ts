import type { Challenge, ProfileType } from '@/types';

interface ChallengeTemplate {
  id: string;
  titulo: string;
  descricao: string;
  xp: number;
  perfil: ProfileType;
}

const CHALLENGE_TEMPLATES: ChallengeTemplate[] = [
  // Explorador
  { id: 'exp_reg15', titulo: 'Registrar 15 gastos', descricao: 'Anote 15 transações de despesa este mês.', xp: 50, perfil: 'explorer' },
  { id: 'exp_cat', titulo: 'Visualizar categorias', descricao: 'Acesse a página de gastos e veja o gráfico de categorias.', xp: 50, perfil: 'explorer' },
  { id: 'exp_aula', titulo: 'Completar aula financeira', descricao: 'Conclua sua primeira aula na seção Aprender.', xp: 50, perfil: 'explorer' },
  // Equilibrado
  { id: 'eq_orc', titulo: 'Criar orçamento', descricao: 'Defina um limite de orçamento para pelo menos 3 categorias.', xp: 50, perfil: 'equilibrado' },
  { id: 'eq_contas', titulo: 'Organizar contas', descricao: 'Cadastre todas as suas contas financeiras no app.', xp: 50, perfil: 'equilibrado' },
  { id: 'eq_guardar', titulo: 'Guardar valor', descricao: 'Registre uma transação de receita e guarde parte dela.', xp: 50, perfil: 'equilibrado' },
  // Construtor
  { id: 'con_meta', titulo: 'Criar meta', descricao: 'Crie uma meta financeira com valor e prazo definidos.', xp: 50, perfil: 'construtor' },
  { id: 'con_inv', titulo: 'Estudar investimento', descricao: 'Conclua a aula sobre investimentos básicos.', xp: 50, perfil: 'construtor' },
  { id: 'con_red', titulo: 'Reduzir categoria', descricao: 'Reduza gastos em uma categoria em pelo menos 10%.', xp: 50, perfil: 'construtor' },
  // Estrategista
  { id: 'est_rel', titulo: 'Analisar relatório', descricao: 'Acesse a página de análises e revise seu relatório mensal.', xp: 50, perfil: 'estrategista' },
  { id: 'est_pat', titulo: 'Atualizar patrimônio', descricao: 'Cadastre ou atualize seus itens de patrimônio.', xp: 50, perfil: 'estrategista' },
  { id: 'est_otm', titulo: 'Otimizar gastos', descricao: 'Identifique e reduza uma despesa recorrente.', xp: 50, perfil: 'estrategista' },
  { id: 'est_mestre_teste', titulo: 'Teste: desbloquear Mestre Financeiro', descricao: 'Conclua este desafio de teste para avançar ao perfil dourado.', xp: 10000, perfil: 'estrategista' },
];

export function generateChallengesForProfile(profile: ProfileType, monthKey: string): Challenge[] {
  return CHALLENGE_TEMPLATES
    .filter((t) => t.perfil === profile)
    .map((t) => ({
      id: `${t.id}_${monthKey}`,
      titulo: t.titulo,
      descricao: t.descricao,
      xp: t.xp,
      perfil: t.perfil,
      concluido: false,
      mes: monthKey,
    }));
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
