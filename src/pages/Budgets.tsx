import { useMemo, useState } from 'react';
import { BarChart3, ChevronDown, ChevronUp, Lightbulb, Settings2, Trash2 } from 'lucide-react';
import { Layout } from '@/components/ui/Layout';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/data/categories';
import { formatCurrency } from '@/lib/format';
import { getGastosPorCategoria, getReceitasMes } from '@/lib/analytics';
import { getMonthKey, getOccurrencesInMonth } from '@/lib/forecast';
import type { CategoryId } from '@/types';

type Rule = { id: string; title: string; ratio: string; description: string; needs: number; wants: number; future: number };

const RULES: Rule[] = [
  { id: '50-30-20', title: 'Estabilidade Básica', ratio: '50 / 30 / 20', description: 'Equilibre o presente e a construção do seu patrimônio.', needs: 50, wants: 30, future: 20 },
  { id: '70-20-10', title: 'Renda Apertada / Subsistência', ratio: '70 / 20 / 10', description: 'Adeque seu padrão de vida ao custo real de sobrevivência.', needs: 70, wants: 10, future: 20 },
  { id: '40-20-40', title: 'Crescimento Acelerado', ratio: '40 / 20 / 40', description: 'Controle o estilo de vida e acelere os aportes.', needs: 40, wants: 20, future: 40 },
  { id: '30-10-60', title: 'Rumo à Independência (FIRE)', ratio: '30 / 10 / 60', description: 'Direcione uma parcela maior para seu futuro financeiro.', needs: 30, wants: 10, future: 60 },
];

const NEEDS: CategoryId[] = ['alimentacao', 'transporte', 'moradia', 'saude', 'educacao'];
const WANTS: CategoryId[] = ['cartao_credito', 'lazer', 'outros'];
const FUTURE: CategoryId[] = ['investimentos_economia'];
const BUDGET_CATEGORIES = [CATEGORIES.investimentos_economia, ...Object.values(CATEGORIES).filter((category) => category.tipo === 'despesa')];

export function Budgets() {
  const { budgets, transactions, plannedExpenses, setBudget, deleteBudget } = useStore();
  const [limit, setLimit] = useState('');
  const [rulesOpen, setRulesOpen] = useState(false);
  const [defineOpen, setDefineOpen] = useState(false);
  const [activeRule, setActiveRule] = useState<Rule | null>(null);
  const [editingBudget, setEditingBudget] = useState<{ categoria: CategoryId; valor: string } | null>(null);
  const income = getReceitasMes(transactions);
  const spending = useMemo(() => new Map(getGastosPorCategoria(transactions).map((item) => [item.categoria, item.valor])), [transactions]);
  const plannedSpending = useMemo(() => {
    const month = getMonthKey(new Date());
    const values = new Map<CategoryId, number>();
    plannedExpenses.forEach((expense) => {
      getOccurrencesInMonth(expense, month)
        .filter((dueDate) => !(expense.pagamentos ?? []).includes(dueDate) && !(expense.pagamentos ?? []).includes(month) && !(expense.ignorados ?? []).includes(dueDate) && (!expense.encerradoEm || dueDate < expense.encerradoEm))
        .forEach(() => values.set(expense.categoria, (values.get(expense.categoria) ?? 0) + expense.valor));
    });
    return values;
  }, [plannedExpenses]);
  const allocated = budgets.reduce((total, budget) => total + budget.limite, 0);
  const availableIncome = Math.max(0, income - allocated);
  const availableCategories = BUDGET_CATEGORIES.filter((item) => !budgets.some((budget) => budget.categoria === item.id));
  const orderedBudgets = [...budgets].sort((first, second) => Number(second.categoria === 'investimentos_economia') - Number(first.categoria === 'investimentos_economia'));
  const [category, setCategory] = useState<CategoryId | ''>('');
  const numericLimit = Number(limit.replace(',', '.'));
  const editLimit = Number((editingBudget?.valor ?? '').replace(',', '.'));
  const editMaximum = editingBudget
    ? Math.max(0, income - budgets.filter((budget) => budget.categoria !== editingBudget.categoria).reduce((total, budget) => total + budget.limite, 0))
    : 0;

  const suggestedLimits = (rule: Rule, categories: CategoryId[] = BUDGET_CATEGORIES.map((item) => item.id)) => {
    const needs = categories.filter((item) => NEEDS.includes(item));
    const wants = categories.filter((item) => WANTS.includes(item));
    const future = categories.filter((item) => FUTURE.includes(item));
    return categories.map((item) => {
      const percentage = NEEDS.includes(item) ? rule.needs / Math.max(needs.length, 1)
        : WANTS.includes(item) ? rule.wants / Math.max(wants.length, 1)
          : rule.future / Math.max(future.length, 1);
      return { category: item, percentage, limit: income * percentage / 100 };
    });
  };

  function saveBudget() {
    if (!category || numericLimit <= 0 || numericLimit > availableIncome || budgets.some((budget) => budget.categoria === category)) return;
    setBudget(category, numericLimit);
    setLimit('');
    setCategory('');
  }

  function applyRule(rule: Rule) {
    if (income <= 0) return;
    suggestedLimits(rule).forEach((suggestion) => setBudget(suggestion.category, suggestion.limit));
    setActiveRule(rule);
    setRulesOpen(false);
  }

  function removeBudget(categoryToRemove: CategoryId) {
    const remaining = budgets.filter((budget) => budget.categoria !== categoryToRemove).map((budget) => budget.categoria);
    deleteBudget(categoryToRemove);
    if (activeRule) suggestedLimits(activeRule, remaining).forEach((suggestion) => setBudget(suggestion.category, suggestion.limit));
  }

  function saveEditedBudget() {
    if (!editingBudget || editLimit <= 0 || editLimit > editMaximum) return;
    setBudget(editingBudget.categoria, editLimit);
    setEditingBudget(null);
  }

  return (
    <Layout title="Orçamento">
      <div className="space-y-4">
        <section className="rounded-2xl bg-primary-600 p-4 text-white">
          <p className="text-sm opacity-85">Renda registrada neste mês</p>
          <p className="mt-1 text-3xl font-bold">{formatCurrency(income)}</p>
          <p className="mt-2 text-xs leading-relaxed opacity-90">Planeje por categoria e acompanhe o limite ao registrar cada despesa.</p>
        </section>

        <section className="relative rounded-2xl bg-white shadow-card">
          <div className="flex items-center p-4">
            <button className="flex flex-1 items-center justify-between gap-3 text-left" onClick={() => setDefineOpen((open) => !open)}>
              <span className="flex items-center gap-2 font-bold text-ink-900"><Settings2 className="h-5 w-5 text-primary-600" />Definir orçamento</span>
              {defineOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
            <button type="button" className="ml-3 rounded-lg p-1.5 text-warning" aria-label="Ver regras de distribuição" onClick={() => setRulesOpen(true)}><Lightbulb className="h-5 w-5" /></button>
          </div>
          {defineOpen && <div className="border-t border-ink-100 p-4">{availableCategories.length === 0 ? <p className="text-sm text-ink-500">Todas as categorias já possuem um orçamento. Edite os limites no acompanhamento.</p> : <div className="space-y-3"><select className="input" value={category} onChange={(event) => setCategory(event.target.value as CategoryId)}><option value="">Selecione a categoria</option>{availableCategories.map((item) => <option key={item.id} value={item.id}>{item.nome}</option>)}</select><input className="input" inputMode="decimal" placeholder="Limite mensal (R$)" value={limit} onChange={(event) => setLimit(event.target.value.replace(/[^0-9.,]/g, ''))} />{income > 0 && <p className="text-xs text-ink-500">Disponível para distribuir: <b className="text-primary-600">{formatCurrency(availableIncome)}</b></p>}{numericLimit > 0 && income > 0 && <p className="text-xs text-ink-500">Este limite representa <b className="text-primary-600">{Math.round((numericLimit / income) * 100)}%</b> da renda mensal.</p>}<button className="btn-primary w-full" disabled={!category || numericLimit <= 0 || numericLimit > availableIncome} onClick={saveBudget}>Definir orçamento</button></div>}</div>}
          {rulesOpen && <><button className="fixed inset-0 z-40 cursor-default" aria-label="Fechar regras" onClick={() => setRulesOpen(false)} /><div className="absolute left-0 top-0 z-50 w-full rounded-2xl bg-white p-4 shadow-xl"><div className="mb-3 flex items-center justify-between"><span className="flex items-center gap-2 font-bold text-ink-900"><Lightbulb className="h-5 w-5 text-warning" />Regras de distribuição</span><button className="text-sm text-ink-500" onClick={() => setRulesOpen(false)}>Fechar</button></div>{income <= 0 && <p className="mb-3 rounded-xl bg-amber-50 p-3 text-xs text-amber-800">Registre uma entrada neste mês para receber valores sugeridos.</p>}<div className="space-y-3">{RULES.map((rule) => <div key={rule.id} className="rounded-xl bg-ink-50 p-3"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-sm text-ink-900">{rule.title}</p><p className="text-xs text-ink-500">Regra {rule.ratio}</p></div><button className="text-xs font-semibold text-primary-600 disabled:text-ink-400" disabled={income <= 0} onClick={() => applyRule(rule)}>Sugerir</button></div><p className="mt-2 text-xs leading-relaxed text-ink-600">{rule.needs}% essenciais: alimentação, transporte, moradia, saúde e educação · {rule.wants}% estilo de vida: cartão de crédito, lazer e outros · {rule.future}% para investir e guardar. {rule.description}</p></div>)}</div></div></>}
        </section>
        <section className="rounded-2xl bg-white p-4 shadow-card">
          <div className="mb-3 flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary-600" /><h2 className="font-bold text-ink-900">Acompanhamento do mês</h2></div>
          {income > 0 && budgets.length > 0 && <div className="mb-4"><div className="mb-1.5 flex justify-between text-xs text-ink-500"><span>Renda distribuída</span><span>{formatCurrency(allocated)} / {formatCurrency(income)}</span></div><div className="flex h-3 overflow-hidden rounded-full bg-ink-100">{orderedBudgets.map((budget) => <div key={budget.categoria} title={CATEGORIES[budget.categoria].nome} style={{ width: `${Math.min(100, (budget.limite / income) * 100)}%`, backgroundColor: CATEGORIES[budget.categoria].cor }} />)}</div></div>}
          {budgets.length === 0 ? <p className="py-3 text-center text-sm text-ink-500">Adicione uma categoria para começar seu orçamento.</p> : <div className="space-y-5">{orderedBudgets.map((budget) => {
            const isSavings = budget.categoria === 'investimentos_economia';
            const spent = isSavings ? 0 : (spending.get(budget.categoria) ?? 0);
            const planned = isSavings ? 0 : (plannedSpending.get(budget.categoria) ?? 0);
            const actualPercentage = budget.limite > 0 ? Math.round((spent / budget.limite) * 100) : 0;
            const percentage = Math.min(100, actualPercentage);
            const plannedPercentage = Math.min(Math.max(0, 100 - percentage), (planned / budget.limite) * 100);
            const maximum = Math.max(1, income);
            const permittedLimit = budget.limite + availableIncome;
            const sliderPercentage = Math.min(100, (budget.limite / maximum) * 100);
            const categoryColor = CATEGORIES[budget.categoria].cor;
            const progressColor = actualPercentage >= 80 ? (actualPercentage > 100 ? '#ef4444' : '#f59e0b') : categoryColor;
            return <div key={budget.categoria}><div className="mb-1.5 flex items-center justify-between gap-2 text-xs"><span className="font-semibold text-ink-800">{CATEGORIES[budget.categoria].nome}</span><button type="button" onClick={() => setEditingBudget({ categoria: budget.categoria, valor: String(budget.limite).replace('.', ',') })} className={actualPercentage > 100 ? 'font-semibold text-danger' : 'text-ink-500'} aria-label={`Editar limite de ${CATEGORIES[budget.categoria].nome}`}>{isSavings ? formatCurrency(budget.limite) : `${formatCurrency(spent)} / ${formatCurrency(budget.limite)}`}</button></div>{!isSavings && <div className="flex h-3 overflow-hidden rounded-full bg-ink-100"><div className="h-full transition-all" style={{ width: `${percentage}%`, backgroundColor: progressColor }} />{plannedPercentage > 0 && <div className="h-full bg-ink-400 transition-all" title={`Previsto: ${formatCurrency(planned)}`} style={{ width: `${plannedPercentage}%` }} />}</div>}<div className="mt-2 flex items-center gap-2"><input aria-label={`Ajustar limite de ${CATEGORIES[budget.categoria].nome}`} className="budget-slider" style={{ color: categoryColor, background: `linear-gradient(to right, ${categoryColor} 0%, ${categoryColor} ${sliderPercentage}%, #e5e7eb ${sliderPercentage}%, #e5e7eb 100%)` }} type="range" min="1" max={maximum} step="1" value={budget.limite} onChange={(event) => setBudget(budget.categoria, Math.min(Number(event.target.value), permittedLimit))} /><button className="p-1 text-danger" aria-label={`Remover orçamento de ${CATEGORIES[budget.categoria].nome}`} onClick={() => removeBudget(budget.categoria)}><Trash2 className="h-4 w-4" /></button></div><p className={`mt-1 text-[11px] ${isSavings ? 'text-primary-700' : actualPercentage > 100 ? 'text-danger' : actualPercentage >= 80 ? 'text-warning' : 'text-ink-500'}`}>{isSavings ? 'Valor programado para investir e economizar.' : actualPercentage > 100 ? `Limite excedido em ${actualPercentage - 100}%` : planned > 0 ? `${actualPercentage}% pago · ${formatCurrency(planned)} previsto` : `${actualPercentage}% do limite utilizado`}</p></div>;
          })}</div>}
        </section>
        {editingBudget && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4"><div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"><h2 className="font-bold text-ink-900">Editar orçamento</h2><p className="mt-1 text-sm text-ink-500">{CATEGORIES[editingBudget.categoria].nome}</p><input autoFocus className="input mt-4" inputMode="decimal" value={editingBudget.valor} onChange={(event) => setEditingBudget({ ...editingBudget, valor: event.target.value.replace(/[^0-9.,]/g, '') })} /><p className="mt-2 text-xs text-ink-500">Máximo disponível: {formatCurrency(editMaximum)}</p><div className="mt-4 flex gap-2"><button className="btn-secondary flex-1" onClick={() => setEditingBudget(null)}>Cancelar</button><button className="btn-primary flex-1" disabled={editLimit <= 0 || editLimit > editMaximum} onClick={saveEditedBudget}>Salvar</button></div></div></div>}
      </div>
    </Layout>
  );
}





