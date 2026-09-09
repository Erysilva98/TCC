import type { Challenge, ChallengeHistoryEntry, ProfileType } from '@/types';

export interface ChallengeTemplate { id: string; titulo: string; descricao: string; xp: number; perfil: ProfileType; nivelMinimo: number; categoria: string; validacao: string; teste?: boolean; }
type Seed = Omit<ChallengeTemplate, 'id' | 'perfil' | 'nivelMinimo' | 'xp'>;

const seeds = (items: [string, string, string, string][]): Seed[] => items.map(([titulo, descricao, categoria, validacao]) => ({ titulo, descricao, categoria, validacao }));
const SEEDS: Record<ProfileType, Seed[]> = {
  explorer: seeds([['Registrar despesas', 'Registre despesas para conhecer seus hábitos.', 'registro', 'despesas_3'], ['Registrar receita', 'Registre uma entrada recebida.', 'registro', 'receita_1'], ['Classificar gastos', 'Use duas categorias de despesa.', 'consciência', 'categorias_2'], ['Criar primeira meta', 'Defina um objetivo financeiro.', 'planejamento', 'meta_1'], ['Revisar categorias', 'Registre uma despesa para analisá-la.', 'consciência', 'despesa_1'], ['Cadastrar conta', 'Registre onde seu dinheiro está guardado.', 'organização', 'conta_1']]),
  equilibrado: seeds([['Criar orçamento', 'Defina limites para suas categorias.', 'orçamento', 'orcamento_1'], ['Organizar contas', 'Cadastre duas contas financeiras.', 'organização', 'contas_2'], ['Criar reserva', 'Cadastre uma conta ou ativo com saldo.', 'economia', 'saldo_guardado'], ['Acompanhar receitas', 'Registre uma receita do mês.', 'organização', 'receita_1'], ['Revisar despesas', 'Registre despesas para acompanhar o mês.', 'orçamento', 'despesas_3'], ['Criar meta de economia', 'Defina uma meta financeira.', 'economia', 'meta_1']]),
  construtor: seeds([['Criar meta com prazo', 'Defina uma meta para construir patrimônio.', 'metas', 'meta_1'], ['Registrar investimento', 'Cadastre um investimento no patrimônio.', 'patrimônio', 'investimento_1'], ['Atualizar patrimônio', 'Cadastre um item patrimonial.', 'patrimônio', 'ativo_1'], ['Planejar orçamento', 'Defina um orçamento para o período.', 'planejamento', 'orcamento_1'], ['Organizar contas', 'Cadastre duas contas.', 'organização', 'contas_2'], ['Acompanhar evolução', 'Registre entradas e despesas.', 'planejamento', 'movimentos_3']]),
  estrategista: seeds([['Analisar relatório', 'Registre movimentações para analisar o mês.', 'análise', 'movimentos_3'], ['Atualizar patrimônio', 'Cadastre ou atualize seus ativos.', 'patrimônio', 'ativo_1'], ['Otimizar gastos', 'Registre receitas e despesas para comparar.', 'otimização', 'saldo_positivo'], ['Diversificar investimentos', 'Cadastre um investimento.', 'investimento', 'investimento_1'], ['Criar estratégia', 'Defina uma nova meta financeira.', 'planejamento', 'meta_1'], ['Controlar categorias', 'Organize despesas em duas categorias.', 'análise', 'categorias_2']]),
  mestre: seeds([['Auditoria financeira', 'Registre movimentações para auditar o período.', 'auditoria', 'movimentos_3'], ['Planejamento anual', 'Crie uma meta de longo prazo.', 'planejamento', 'meta_1'], ['Diversificação patrimonial', 'Cadastre um investimento.', 'patrimônio', 'investimento_1'], ['Revisar orçamento', 'Defina um orçamento ativo.', 'auditoria', 'orcamento_1'], ['Estratégia de reserva', 'Mantenha saldo guardado.', 'planejamento', 'saldo_guardado'], ['Otimizar carteira', 'Cadastre um ativo patrimonial.', 'patrimônio', 'ativo_1']]),
};
const TIERS = [{ nivelMinimo: 1, xp: 20 }, { nivelMinimo: 26, xp: 50 }, { nivelMinimo: 51, xp: 90 }, { nivelMinimo: 76, xp: 150 }];
const VARIANTS = ['da rotina semanal', 'do planejamento mensal', 'da revisão financeira', 'da evolução do período'];

export const CHALLENGE_LIBRARY: ChallengeTemplate[] = (Object.keys(SEEDS) as ProfileType[]).flatMap((perfil) => TIERS.flatMap((tier, tierIndex) => SEEDS[perfil].flatMap((seed, seedIndex) => Array.from({ length: 4 }, (_, variant) => ({ ...seed, titulo: `${seed.titulo} ${VARIANTS[variant]}`, descricao: `${seed.descricao} Foco: ${VARIANTS[variant]}.`, perfil, nivelMinimo: tier.nivelMinimo, xp: tier.xp, id: `${perfil}_${tierIndex + 1}_${seedIndex + 1}_${variant + 1}` }))))).concat({ id: 'est_mestre_teste', titulo: 'Teste: desbloquear Mestre Financeiro', descricao: 'Conclua para avançar ao perfil dourado.', xp: 10000, perfil: 'estrategista', nivelMinimo: 1, categoria: 'teste', validacao: 'sempre', teste: true });

function hash(value: string) { return [...value].reduce((total, char) => total + char.charCodeAt(0), 0); }
function monthsSince(month: string, now: string) { const [year, value] = month.split('-').map(Number); const [nowYear, nowValue] = now.split('-').map(Number); return (nowYear - year) * 12 + nowValue - value; }

export function generateChallengesForProfile(profile: ProfileType, monthKey: string, level = 1, history: ChallengeHistoryEntry[] = []): Challenge[] {
  const recent = new Set(history.filter((entry) => entry.perfil === profile && monthsSince(entry.mes, monthKey) < 6).map((entry) => entry.templateId));
  const all = CHALLENGE_LIBRARY.filter((item) => item.perfil === profile && !item.teste && item.nivelMinimo <= level);
  const allowed = all.filter((item) => !recent.has(item.id));
  const selected = [...(allowed.length >= 4 ? allowed : all)].sort((a, b) => hash(`${monthKey}${a.id}`) - hash(`${monthKey}${b.id}`)).slice(0, 4);
  return selected.map((item) => ({ ...item, id: `${item.id}_${monthKey}`, concluido: false, mes: monthKey }));
}
export function getCurrentMonthKey(): string { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; }
