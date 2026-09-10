import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, Sector, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown,
  Settings2, CircleHelp,
} from 'lucide-react';
import { Layout, XpProgressInfo } from '@/components/ui/Layout';
import { FAB } from '@/components/ui/FAB';
import { QuickAddModal } from '@/components/ui/QuickAddModal';
import { useStore } from '@/store/useStore';
import { getProfileRank, PROFILES } from '@/data/profiles';
import { CATEGORIES } from '@/data/categories';
import {
  getSaldo, getReceitasMes, getDespesasMes, getGastosPorCategoria,
  getScoreSaude, getSugestoes, getComparacaoMensal, getLevel,
} from '@/lib/analytics';
import { formatCurrency, formatCurrencyShort, getMonthName } from '@/lib/format';
import { getMonthlyForecast } from '@/lib/forecast';
import { getLessonsForProfile } from '@/data/lessons';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ProfileType, Account, Asset, CategoryId } from '@/types';

const CARD_META: Record<string, { title: string; icon: string }> = {
  saldo: { title: 'Saldo Total', icon: 'Wallet' },
  entradas_saidas: { title: 'Entradas x SaÃ­das', icon: 'ArrowUpDown' },
  gastos_categoria: { title: 'Gastos por Categoria', icon: 'PieChart' },
  score: { title: 'SaÃºde Financeira', icon: 'Activity' },
  comparacao: { title: 'ComparaÃ§Ã£o Mensal', icon: 'BarChart3' },
  metas: { title: 'Metas', icon: 'Target' },
};

export function Dashboard() {
  const [showAdd, setShowAdd] = useState(false);
  const [editingCards, setEditingCards] = useState(false);
  const [showXpTasks, setShowXpTasks] = useState(false);
  const xpPanelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const {
    transactions, goals, budgets, xp,
    cardOrder, disabledCards,
    onboarding, toggleCard, reorderCards,
    accounts, assets, plannedExpenses, creditCards, creditCardExpenses, lessonProgress,
  } = useStore();

  const profile = onboarding.profile as ProfileType;
  const profileConfig = PROFILES[profile];

  const saldoTransacoes = getSaldo(transactions);
  const saldoContas = accounts.reduce((a, acc) => a + acc.saldo, 0);
  const totalInvestimentos = assets
    .filter((a) => a.tipo === 'investimento')
    .reduce((a, acc) => a + acc.valor, 0);
  // Contas representam o saldo inicial informado; lanÃ§amentos atualizam o saldo exibido.
  const saldoTotal = saldoContas + totalInvestimentos + saldoTransacoes;

  const receitas = getReceitasMes(transactions);
  const despesas = getDespesasMes(transactions);
  const gastosCat = getGastosPorCategoria(transactions);
  const score = getScoreSaude(transactions, budgets);
  const sugestoes = getSugestoes(transactions, budgets);
  const comparacao = getComparacaoMensal(transactions);
  const forecast = getMonthlyForecast(plannedExpenses, creditCards, creditCardExpenses);
  const profileRank = getProfileRank(profile);
  const isMasterProfile = profile === 'mestre';
  const initialProfileRank = onboarding.initialProfile ? getProfileRank(onboarding.initialProfile) : profileRank;
  const level = getLevel(xp, profileRank, initialProfileRank);
  const profileLessons = getLessonsForProfile(profile);
  const completedLessons = profileLessons.filter((lesson) => lessonProgress.some((progress) => progress.lessonId === lesson.id && progress.concluido)).length;

  const visibleCards = cardOrder.filter((c) => c !== 'contas' && c !== 'sugestoes' && !disabledCards.includes(c) && (c !== 'comparacao' || profileConfig.features.comparacaoMensal));
  const hiddenCards = cardOrder.filter((c) => c !== 'saldo' && c !== 'contas' && c !== 'sugestoes' && disabledCards.includes(c));

  useEffect(() => {
    if (!showXpTasks) return;
    const closeWhenClickingOutside = (event: PointerEvent) => {
      if (xpPanelRef.current && !xpPanelRef.current.contains(event.target as Node)) setShowXpTasks(false);
    };
    document.addEventListener('pointerdown', closeWhenClickingOutside);
    return () => document.removeEventListener('pointerdown', closeWhenClickingOutside);
  }, [showXpTasks]);

  const donutData = gastosCat.map((g) => ({
    categoria: g.categoria,
    name: CATEGORIES[g.categoria].nome,
    value: g.valor,
    color: CATEGORIES[g.categoria].cor,
  }));

  function moveCard(index: number, dir: -1 | 1) {
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= visibleCards.length) return;
    const newOrder = [...visibleCards];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    const fullOrder = [...newOrder, ...cardOrder.filter((c) => !newOrder.includes(c))];
    reorderCards(fullOrder);
  }

  return (
    <Layout headerRight={<div className="relative shrink-0"><div className="h-10 px-2.5 rounded-xl flex items-center gap-2" style={{ backgroundColor: profileConfig.corLight }}><button type="button" onClick={() => navigate(profileConfig.menu.some((item) => item.path === '/aprender') ? '/aprender' : '/perfil', { state: { section: 'desafios' } })} className="flex items-center gap-1.5 text-left"><span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: profileConfig.cor }}>{profileRank}</span>{isMasterProfile ? <Icons.Trophy className="w-5 h-5 fill-amber-400 text-amber-600" aria-label="ClassificaÃ§Ã£o mÃ¡xima: Mestre Financeiro" /> : <span className="text-[11px] leading-tight" style={{ color: profileConfig.cor }}><b className="block">NÃ­vel {level.level}</b><span>{level.current}/{level.needed} XP</span></span>}</button><button type="button" onClick={() => setShowXpTasks((open) => !open)} className="p-0.5" style={{ color: profileConfig.cor }} aria-label="Como ganhar XP"><CircleHelp className="w-4 h-4" /></button></div><AnimatePresence initial={false}>{showXpTasks && <motion.div ref={xpPanelRef} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute top-full right-0 z-[60] mt-2 w-[340px] max-w-[calc(100vw-2rem)] p-4 bg-white rounded-2xl shadow-card"><XpProgressInfo /></motion.div>}</AnimatePresence></div>}>
      {/* XP Bar */}
      <div className="hidden">
        <div className="flex items-center justify-between mb-1.5">
          <button type="button" onClick={() => navigate(profileConfig.menu.some((item) => item.path === '/aprender') ? '/aprender' : '/perfil', { state: { section: 'desafios' } })} className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {profileRank}
            </div>
            <span className="text-sm font-semibold text-ink-800">NÃ­vel {level.level}</span>
          </button>
          <button type="button" onClick={() => setShowXpTasks((open) => !open)} className="p-1 text-ink-400 hover:text-primary-600" aria-label="Como ganhar XP"><CircleHelp className="w-4 h-4" /></button>
        </div>
        <span className="block text-xs text-ink-500 mb-1.5">{level.current}/{level.needed} XP</span>
        <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${level.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <AnimatePresence initial={false}>{showXpTasks && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><div className="mt-3 pt-3 border-t border-ink-100 grid grid-cols-2 gap-2 text-[11px] text-ink-600"><span>Registrar gasto: +5 XP</span><span>Criar meta: +30 XP</span><span>Completar aula: +15 XP</span><span>Completar desafio: +50 XP</span></div></motion.div>}</AnimatePresence>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 min-[500px]:grid-cols-[48%_48%] items-start gap-y-4 min-[500px]:gap-y-2 min-[500px]:gap-x-[4%]">
        {visibleCards.map((cardId, index) => {
          const meta = CARD_META[cardId];
          if (!meta) return null;
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[meta.icon] || Icons.Circle;
          const delay = index * 0.05;

          return (
            <motion.div
              key={cardId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay, duration: 0.3 }}
              className={`min-w-0 bg-white rounded-2xl shadow-card p-4 ${cardId === 'saldo' ? 'relative z-30 col-span-1 min-[500px]:col-start-1 min-[500px]:row-start-1' : cardId === 'entradas_saidas' ? 'col-span-1 min-[500px]:col-start-2 min-[500px]:row-start-1 min-[500px]:row-span-2 min-[500px]:self-stretch' : cardId === 'score' ? 'relative z-20 col-span-1 min-[500px]:col-start-1 min-[500px]:row-start-2' : 'col-span-1 min-[500px]:col-span-2 min-[500px]:mt-4'}`}
            >
              {cardId === 'saldo' && (
                <SaldoTotalCard
                  saldo={saldoTotal}
                  accounts={accounts}
                  investments={assets.filter((a) => a.tipo === 'investimento')}
                  icon={Icon}
                />
              )}
              {cardId === 'entradas_saidas' && (
                <EntradasSaidasCard
                  receitas={receitas}
                  despesas={despesas}
                  previsto={forecast.total}
                  learningProgress={profile === 'explorer' ? { completed: completedLessons, total: profileLessons.length } : undefined}
                  mesNome={getMonthName()}
                  icon={Icon}
                  title={meta.title}
                  editing={false}
                  onToggle={() => toggleCard(cardId)}
                  onMoveUp={() => moveCard(index, -1)}
                  onMoveDown={() => moveCard(index, 1)}
                  canEdit={true}
                  onNavigate={(filter) => navigate('/gastos', { state: { filter } })}
                  onForecast={() => navigate(profile === 'explorer' ? '/aprender' : '/previsoes')}
                  onCardClick={() => navigate('/gastos')}
                />
              )}
              {cardId === 'gastos_categoria' && (
                <GastosCategoriaCard data={donutData} icon={Icon} title={meta.title} editing={editingCards} onToggle={() => toggleCard(cardId)} onMoveUp={() => moveCard(index, -1)} onMoveDown={() => moveCard(index, 1)} canEdit={true} onCardClick={() => navigate('/gastos')} onCategoryClick={(categoria) => navigate('/gastos', { state: { filter: 'despesa', categoria } })} />
              )}
              {cardId === 'score' && profileConfig.features.scoreSaude && (
                <ScoreCard score={score} sugestoes={sugestoes} icon={Icon} title={meta.title} editing={editingCards} onToggle={() => toggleCard(cardId)} onMoveUp={() => moveCard(index, -1)} onMoveDown={() => moveCard(index, 1)} canEdit={true} />
              )}
              {cardId === 'comparacao' && profileConfig.features.comparacaoMensal && (
                <ComparacaoCard data={comparacao} onNavigate={(month) => navigate('/gastos', { state: { month } })} />
              )}
              {cardId === 'metas' && profileConfig.features.metas && (
                <MetasCard goals={goals} icon={Icon} title={meta.title} editing={editingCards} onToggle={() => toggleCard(cardId)} onMoveUp={() => moveCard(index, -1)} onMoveDown={() => moveCard(index, 1)} canEdit={true} onClick={() => navigate('/metas')} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ComparaÃ§Ã£o mensal for equilibrado+ */}
      {false && profileConfig.features.comparacaoMensal && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-card p-4 mt-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Icons.BarChart3 className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-ink-900">ComparaÃ§Ã£o Mensal</h2>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={comparacao} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="receitas" name="Receitas" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Edit cards toggle */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => setEditingCards(!editingCards)}
          className="btn-ghost text-sm"
        >
          <Settings2 className="w-4 h-4" />
          {editingCards ? 'Concluir ediÃ§Ã£o' : 'Personalizar cards'}
        </button>
      </div>
      {editingCards && (
        <div className="mt-3 bg-white rounded-2xl shadow-card p-4 space-y-3">
          <div><h2 className="font-bold text-sm text-ink-900">Cards visÃ­veis</h2><p className="text-xs text-ink-500 mt-1">Use as setas de cada card para ordenar. O saldo total permanece fixo.</p></div>
          {visibleCards.filter((id) => id !== 'saldo').map((id) => <div key={id} className="flex items-center justify-between p-2.5 bg-ink-50 rounded-xl text-sm text-ink-700"><span>{CARD_META[id]?.title}</span><button type="button" onClick={() => toggleCard(id)} className="text-xs text-danger">Ocultar</button></div>)}
          {hiddenCards.length > 0 && <div><h3 className="font-semibold text-sm text-ink-800 mb-2">Cards ocultos</h3>{hiddenCards.map((id) => <div key={id} className="flex items-center justify-between p-2.5 bg-ink-50 rounded-xl text-sm text-ink-700 mb-2"><span>{CARD_META[id]?.title}</span><button type="button" onClick={() => toggleCard(id)} className="text-xs text-primary-600">Mostrar</button></div>)}</div>}
        </div>
      )}

      <p className="text-center text-xs text-ink-400 mt-4">
        {getMonthName()} â€¢ {transactions.length} transaÃ§Ãµes registradas
      </p>

      <FAB onClick={() => setShowAdd(true)} />
      <QuickAddModal open={showAdd} onClose={() => setShowAdd(false)} />
    </Layout>
  );
}

interface CardShellProps {
  icon: LucideIcon;
  title: string;
  editing: boolean;
  onToggle: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canEdit: boolean;
  children?: React.ReactNode;
}

function CardShell({ icon: Icon, title, editing, onToggle, onMoveUp, onMoveDown, canEdit, children }: CardShellProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-ink-900 text-sm">{title}</h2>
        </div>
        {editing && canEdit && (
          <div className="flex items-center gap-1">
            {onMoveUp && (
              <button onClick={onMoveUp} className="p-1 text-ink-400 hover:text-ink-900">
                <Icons.ChevronUp className="w-4 h-4" />
              </button>
            )}
            {onMoveDown && (
              <button onClick={onMoveDown} className="p-1 text-ink-400 hover:text-ink-900">
                <Icons.ChevronDown className="w-4 h-4" />
              </button>
            )}
            <button onClick={onToggle} className="p-1 text-ink-400 hover:text-danger">
              <Icons.EyeOff className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      {children}
    </>
  );
}

function SaldoTotalCard({ saldo, accounts, investments, icon: Icon }: { saldo: number; accounts: Account[]; investments: Asset[]; icon: LucideIcon }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const items = [
    ...accounts.map((account) => ({
      id: account.id,
      nome: account.nome,
      tipo: account.tipo === 'cartao' ? 'CartÃ£o' : 'Conta',
      valor: account.saldo,
      cor: account.cor,
      icon: account.tipo === 'cartao' ? Icons.CreditCard : Icons.Landmark,
    })),
    ...investments.map((investment) => ({
      id: investment.id,
      nome: investment.nome,
      tipo: 'Investimento',
      valor: investment.valor,
      cor: '#16a34a',
      icon: Icons.TrendingUp,
    })),
  ];
  const hasItems = items.length > 0;
  const formattedSaldo = formatCurrency(saldo);
  const saldoFontSize = formattedSaldo.length > 15 ? 'text-lg' : formattedSaldo.length > 12 ? 'text-xl' : formattedSaldo.length > 10 ? 'text-2xl' : 'text-3xl';
  useEffect(() => {
    if (!isExpanded) return;
    const closeWhenClickingOutside = (event: PointerEvent) => {
      if (detailRef.current && !detailRef.current.contains(event.target as Node)) setIsExpanded(false);
    };
    document.addEventListener('pointerdown', closeWhenClickingOutside);
    return () => document.removeEventListener('pointerdown', closeWhenClickingOutside);
  }, [isExpanded]);
  return (
    <div onClick={() => { if (!isExpanded) setIsExpanded(true); }} className="cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          <h2 className="font-bold text-ink-900 text-sm">Saldo Total</h2>
        </div>
      </div>
      <motion.div
        key={saldo}
        initial={{ scale: 0.95, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`mt-3 ${saldoFontSize} leading-tight font-extrabold whitespace-nowrap ${saldo >= 0 ? 'text-ink-900' : 'text-danger'}`}
      >
        <span className="mr-1 align-[0.12em] text-[0.62em]">R$</span>{formattedSaldo.replace('R$', '').trim()}
      </motion.div>
      <AnimatePresence initial={false}>
        {isExpanded && hasItems && (
          <motion.div ref={detailRef} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute left-0 top-full z-50 mt-2 w-full min-[500px]:w-[222.222%] p-4 bg-white rounded-2xl shadow-card">
            <div className="space-y-2">
              <p className="text-[10px] font-semibold tracking-wide text-ink-400">DETALHAMENTO</p>
              {items.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2.5 bg-ink-50 rounded-xl">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.cor + '20' }}>
                      <ItemIcon className="w-4 h-4" style={{ color: item.cor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{item.nome}</p>
                      <p className="text-[10px] text-ink-400">{item.tipo}</p>
                    </div>
                    <span className="text-sm font-bold text-ink-900">{formatCurrency(item.valor)}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EntradasSaidasCard(props: { receitas: number; despesas: number; previsto: number; learningProgress?: { completed: number; total: number }; mesNome: string; icon: LucideIcon; title: string; editing: boolean; onToggle: () => void; onMoveUp?: () => void; onMoveDown?: () => void; canEdit: boolean; onNavigate: (filter: 'receita' | 'despesa') => void; onForecast: () => void; onCardClick: () => void }) {
  return (
    <div role="button" tabIndex={0} onClick={props.onCardClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') props.onCardClick(); }} className="cursor-pointer">
    <CardShell icon={props.icon} title={props.mesNome} editing={props.editing} onToggle={props.onToggle} onMoveUp={props.onMoveUp} onMoveDown={props.onMoveDown} canEdit={props.canEdit}>
      <div className="grid grid-cols-1 gap-2">
        <button type="button" onClick={(event) => { event.stopPropagation(); props.onNavigate('receita'); }} className="order-2 p-3 bg-primary-50 rounded-xl text-left transition-colors hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-300">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-medium text-primary-700">Entradas</span>
          </div>
          <p className="text-lg font-bold text-primary-700">{formatCurrency(props.receitas)}</p>
        </button>
        <button type="button" onClick={(event) => { event.stopPropagation(); props.onNavigate('despesa'); }} className="order-1 p-3 bg-red-50 rounded-xl text-left transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-4 h-4 text-danger" />
            <span className="text-xs font-medium text-danger">SaÃ­das</span>
          </div>
          <p className="text-lg font-bold text-danger">{formatCurrency(props.despesas)}</p>
        </button>
        <button type="button" onClick={(event) => { event.stopPropagation(); props.onForecast(); }} className="order-3 p-3 bg-amber-50 rounded-xl text-left transition-colors hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-200">
          {props.learningProgress ? <><div className="flex items-center gap-1.5 mb-1"><Icons.GraduationCap className="w-4 h-4 text-amber-600" /><span className="text-xs font-medium text-amber-700">Evoluir perfil</span></div><p className="text-sm font-bold text-amber-700">{props.learningProgress.completed}/{props.learningProgress.total} aulas concluÃ­das</p></> : <><div className="flex items-center gap-1.5 mb-1"><Icons.CalendarClock className="w-4 h-4 text-amber-600" /><span className="text-xs font-medium text-amber-700">Previsto</span></div><p className="text-lg font-bold text-amber-700">{formatCurrency(props.previsto)}</p></>}
        </button>
      </div>
    </CardShell>
    </div>
  );
}

function GastosCategoriaCard(props: { data: { categoria: CategoryId; name: string; value: number; color: string }[]; icon: LucideIcon; title: string; editing: boolean; onToggle: () => void; onMoveUp?: () => void; onMoveDown?: () => void; canEdit: boolean; onCardClick: () => void; onCategoryClick: (categoria: CategoryId) => void }) {
  const total = props.data.reduce((acc, d) => acc + d.value, 0);
  if (props.data.length === 0) {
    return (
      <div role="button" tabIndex={0} onClick={props.onCardClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') props.onCardClick(); }} className="cursor-pointer"><CardShell {...props}>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <PieChart className="w-8 h-8 text-ink-300 mb-2" />
          <p className="text-sm text-ink-400">Nenhum gasto registrado este mÃªs</p>
        </div>
      </CardShell></div>
    );
  }
  return (
    <div role="button" tabIndex={0} onClick={props.onCardClick} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') props.onCardClick(); }} className="cursor-pointer"><CardShell {...props}>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 shrink-0" onClick={(event) => event.stopPropagation()}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer={false}>
              <Pie data={props.data} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value" onClick={(data) => { const item = data as unknown as { payload?: { categoria?: CategoryId }; categoria?: CategoryId }; const categoria = item.payload?.categoria ?? item.categoria; if (categoria) props.onCategoryClick(categoria); }} activeShape={(shapeProps) => <Sector {...shapeProps} outerRadius={Number(shapeProps.outerRadius) + 4} />}>
                {props.data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5">
          {props.data.slice(0, 5).map((d) => (
            <div key={d.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-xs text-ink-700 flex-1 truncate">{d.name}</span>
              <div className="text-right shrink-0 leading-tight">
                <p className="text-xs font-semibold text-ink-900">{Math.round((d.value / total) * 100)}%</p>
                <p className="text-[10px] text-ink-500">{formatCurrency(d.value)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
    </div>
  );
}

function ScoreCard(props: { score: number; sugestoes: { tipo: string; texto: string; icon: string }[]; icon: LucideIcon; title: string; editing: boolean; onToggle: () => void; onMoveUp?: () => void; onMoveDown?: () => void; canEdit: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const color = props.score >= 70 ? '#16a34a' : props.score >= 40 ? '#f59e0b' : '#ef4444';
  const label = props.score >= 70 ? 'SaudÃ¡vel' : props.score >= 40 ? 'AtenÃ§Ã£o' : 'Risco';
  useEffect(() => {
    if (!expanded) return;
    const closeWhenClickingOutside = (event: PointerEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) setExpanded(false);
    };
    document.addEventListener('pointerdown', closeWhenClickingOutside);
    return () => document.removeEventListener('pointerdown', closeWhenClickingOutside);
  }, [expanded]);
  return (
    <div onClick={() => setExpanded(true)} className="cursor-pointer">
    <CardShell {...props} editing={false}>
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15" fill="none" stroke="#f3f4f6" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${(props.score / 100) * 94.2} 94.2`}
              initial={{ strokeDasharray: '0 94.2' }}
              animate={{ strokeDasharray: `${(props.score / 100) * 94.2} 94.2` }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-base font-extrabold" style={{ color }}>{props.score}</span>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold" style={{ color }}>{label}</p>
          <p className="text-xs text-ink-500 mt-1">
            {props.score >= 70 ? 'Suas finanÃ§as estÃ£o saudÃ¡veis. Continue assim!' :
             props.score >= 40 ? 'AtenÃ§Ã£o aos gastos. Revise seu orÃ§amento.' :
             'Suas finanÃ§as precisam de atenÃ§Ã£o. Reduza despesas.'}
          </p>
        </div>
      </div>
      <AnimatePresence initial={false}>{expanded && <motion.div ref={suggestionsRef} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute left-0 top-full z-50 mt-2 w-full min-[500px]:w-[166.667%] p-4 bg-white rounded-2xl shadow-card"><p className="text-sm font-bold text-ink-900 mb-3">SugestÃµes</p><div className="space-y-2">{props.sugestoes.map((suggestion, index) => <div key={index} className="p-2.5 rounded-xl bg-ink-50 text-xs text-ink-700">{suggestion.texto}</div>)}</div></motion.div>}</AnimatePresence>
    </CardShell></div>
  );
}

function ComparacaoCard({ data, onNavigate }: { data: { mes: string; receitas: number; despesas: number }[]; onNavigate: (month: string) => void }) {
  return <div><div className="flex items-center gap-2 mb-3"><Icons.BarChart3 className="w-5 h-5 text-primary-600" /><h2 className="font-bold text-ink-900 text-sm">ComparaÃ§Ã£o Mensal</h2></div><ResponsiveContainer width="100%" height={180}><BarChart data={data} onClick={(event) => { const payload = (event as unknown as { activePayload?: { payload?: { mes?: string } }[] }).activePayload?.[0]?.payload; if (payload?.mes) onNavigate(payload.mes); }} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}><CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} /><XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(value) => formatCurrencyShort(value)} /><Tooltip formatter={(value) => formatCurrency(Number(value))} /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="receitas" name="Receitas" fill="#16a34a" radius={[4, 4, 0, 0]} /><Bar dataKey="despesas" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer><p className="text-[11px] text-ink-400 text-center">Toque em um mÃªs para ver os gastos.</p></div>;
}

function SugestoesCard(props: { sugestoes: { tipo: string; texto: string; icon: string }[]; icon: LucideIcon; title: string; editing: boolean; onToggle: () => void; onMoveUp?: () => void; onMoveDown?: () => void; canEdit: boolean }) {
  return (
    <CardShell {...props}>
      <div className="space-y-2">
        {props.sugestoes.map((s, i) => {
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[s.icon] || Icons.Lightbulb;
          const color = s.tipo === 'alerta' ? 'text-warning' : s.tipo === 'positivo' ? 'text-primary-600' : 'text-ink-500';
          const bg = s.tipo === 'alerta' ? 'bg-amber-50' : s.tipo === 'positivo' ? 'bg-primary-50' : 'bg-ink-50';
          return (
            <div key={i} className={`flex items-start gap-2 p-2.5 rounded-xl ${bg}`}>
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
              <span className="text-xs text-ink-700">{s.texto}</span>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}

function MetasCard(props: { goals: { id: string; titulo: string; valorAlvo: number; valorAtual: number }[]; icon: LucideIcon; title: string; editing: boolean; onToggle: () => void; onMoveUp?: () => void; onMoveDown?: () => void; canEdit: boolean; onClick?: () => void }) {
  if (props.goals.length === 0) {
    return (
      <CardShell {...props}>
        <button onClick={props.onClick} className="w-full p-4 border-2 border-dashed border-ink-200 rounded-xl text-sm text-ink-400 hover:border-primary-400 hover:text-primary-600 transition-colors">
          Crie sua primeira meta
        </button>
      </CardShell>
    );
  }
  return (
    <CardShell {...props}>
      <div className="space-y-3" onClick={props.onClick}>
        {props.goals.slice(0, 3).map((g) => {
          const pct = Math.min(100, (g.valorAtual / g.valorAlvo) * 100);
          return (
            <div key={g.id}>
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-ink-800">{g.titulo}</span>
                <span className="text-xs text-ink-500">{Math.round(pct)}%</span>
              </div>
              <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-ink-400">{formatCurrency(g.valorAtual)}</span>
                <span className="text-[10px] text-ink-400">{formatCurrency(g.valorAlvo)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </CardShell>
  );
}

