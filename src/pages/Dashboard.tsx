import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Lightbulb, AlertTriangle, CheckCircle,
  Target, Settings2, ArrowUpRight, ArrowDownRight,
  Wallet, PiggyBank, Activity, Landmark, CreditCard, Coins,
} from 'lucide-react';
import { Layout } from '@/components/ui/Layout';
import { FAB } from '@/components/ui/FAB';
import { QuickAddModal } from '@/components/ui/QuickAddModal';
import { useStore } from '@/store/useStore';
import { PROFILES } from '@/data/profiles';
import { CATEGORIES } from '@/data/categories';
import {
  getSaldo, getReceitasMes, getDespesasMes, getGastosPorCategoria,
  getScoreSaude, getSugestoes, getComparacaoMensal, getLevel,
} from '@/lib/analytics';
import { formatCurrency, formatCurrencyShort, getMonthName } from '@/lib/format';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ProfileType, Account, Asset } from '@/types';

const CARD_META: Record<string, { title: string; icon: string }> = {
  saldo: { title: 'Saldo Total', icon: 'Wallet' },
  contas: { title: 'Minhas Contas', icon: 'Landmark' },
  entradas_saidas: { title: 'Entradas x Saídas', icon: 'ArrowUpDown' },
  gastos_categoria: { title: 'Gastos por Categoria', icon: 'PieChart' },
  score: { title: 'Saúde Financeira', icon: 'Activity' },
  sugestoes: { title: 'Sugestões Inteligentes', icon: 'Lightbulb' },
  metas: { title: 'Metas', icon: 'Target' },
};

const DEFAULT_CARDS = ['saldo', 'contas', 'entradas_saidas', 'gastos_categoria', 'score', 'sugestoes', 'metas'];

export function Dashboard() {
  const [showAdd, setShowAdd] = useState(false);
  const [editingCards, setEditingCards] = useState(false);
  const navigate = useNavigate();

  const {
    transactions, goals, budgets, xp,
    cardOrder, disabledCards,
    onboarding, toggleCard, reorderCards,
    accounts, assets,
  } = useStore();

  const profile = onboarding.profile as ProfileType;
  const profileConfig = PROFILES[profile];

  const saldoTransacoes = getSaldo(transactions);
  const saldoContas = accounts.reduce((a, acc) => a + acc.saldo, 0);
  const totalInvestimentos = assets
    .filter((a) => a.tipo === 'investimento')
    .reduce((a, acc) => a + acc.valor, 0);
  const saldoTotal = saldoContas + totalInvestimentos + (accounts.length === 0 ? saldoTransacoes : 0);

  const receitas = getReceitasMes(transactions);
  const despesas = getDespesasMes(transactions);
  const gastosCat = getGastosPorCategoria(transactions);
  const score = getScoreSaude(transactions, budgets);
  const sugestoes = getSugestoes(transactions, budgets);
  const comparacao = getComparacaoMensal(transactions);
  const level = getLevel(xp);

  const visibleCards = cardOrder.filter((c) => !disabledCards.includes(c));

  const donutData = gastosCat.map((g) => ({
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
    <Layout title="Minha Saúde Financeira">
      {/* XP Bar */}
      <div className="mb-4 p-3 bg-white rounded-2xl shadow-card">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
              {level.level}
            </div>
            <span className="text-sm font-semibold text-ink-800">Nível {level.level}</span>
          </div>
          <span className="text-xs text-ink-500">{level.current}/{level.needed} XP</span>
        </div>
        <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${level.progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-4">
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
              className="bg-white rounded-2xl shadow-card p-4"
            >
              {cardId === 'saldo' && (
                <SaldoTotalCard saldo={saldoTotal} icon={Icon} editing={editingCards} onToggle={() => {}} canEdit={false} />
              )}
              {cardId === 'contas' && (accounts.length > 0 || totalInvestimentos > 0) && (
                <ContasCard
                  accounts={accounts}
                  investments={assets.filter((a) => a.tipo === 'investimento')}
                  icon={Icon}
                  editing={editingCards}
                  onToggle={() => toggleCard(cardId)}
                  onMoveUp={() => moveCard(index, -1)}
                  onMoveDown={() => moveCard(index, 1)}
                  canEdit={true}
                />
              )}
              {cardId === 'entradas_saidas' && (
                <EntradasSaidasCard
                  receitas={receitas}
                  despesas={despesas}
                  mesNome={getMonthName()}
                  icon={Icon}
                  title={meta.title}
                  editing={editingCards}
                  onToggle={() => toggleCard(cardId)}
                  onMoveUp={() => moveCard(index, -1)}
                  onMoveDown={() => moveCard(index, 1)}
                  canEdit={true}
                />
              )}
              {cardId === 'gastos_categoria' && (
                <GastosCategoriaCard data={donutData} icon={Icon} title={meta.title} editing={editingCards} onToggle={() => toggleCard(cardId)} onMoveUp={() => moveCard(index, -1)} onMoveDown={() => moveCard(index, 1)} canEdit={true} />
              )}
              {cardId === 'score' && profileConfig.features.scoreSaude && (
                <ScoreCard score={score} icon={Icon} title={meta.title} editing={editingCards} onToggle={() => toggleCard(cardId)} onMoveUp={() => moveCard(index, -1)} onMoveDown={() => moveCard(index, 1)} canEdit={true} />
              )}
              {cardId === 'sugestoes' && profileConfig.features.sugestoes && (
                <SugestoesCard sugestoes={sugestoes} icon={Icon} title={meta.title} editing={editingCards} onToggle={() => toggleCard(cardId)} onMoveUp={() => moveCard(index, -1)} onMoveDown={() => moveCard(index, 1)} canEdit={true} />
              )}
              {cardId === 'metas' && profileConfig.features.metas && (
                <MetasCard goals={goals} icon={Icon} title={meta.title} editing={editingCards} onToggle={() => toggleCard(cardId)} onMoveUp={() => moveCard(index, -1)} onMoveDown={() => moveCard(index, 1)} canEdit={true} onClick={() => navigate('/metas')} />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Comparação mensal for equilibrado+ */}
      {profileConfig.features.comparacaoMensal && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-card p-4 mt-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Icons.BarChart3 className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-ink-900">Comparação Mensal</h2>
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
          {editingCards ? 'Concluir edição' : 'Personalizar cards'}
        </button>
      </div>

      <p className="text-center text-xs text-ink-400 mt-4">
        {getMonthName()} • {transactions.length} transações registradas
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

function SaldoTotalCard({ saldo, icon: Icon, editing, onToggle, canEdit }: { saldo: number; icon: LucideIcon; editing: boolean; onToggle: () => void; canEdit: boolean }) {
  const isPositive = saldo >= 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 className="font-bold text-ink-900 text-sm">Saldo Total</h2>
            <p className="text-xs text-ink-400">Contas + investimentos</p>
          </div>
        </div>
        <div className="chip text-xs bg-primary-50 text-primary-700">Fixo</div>
      </div>
      <motion.div
        key={saldo}
        initial={{ scale: 0.95, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`text-3xl font-extrabold ${isPositive ? 'text-ink-900' : 'text-danger'}`}
      >
        {formatCurrency(saldo)}
      </motion.div>
      <div className="flex items-center gap-1 mt-2">
        {isPositive ? (
          <ArrowUpRight className="w-4 h-4 text-primary-600" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-danger" />
        )}
        <span className="text-xs text-ink-500">
          {isPositive ? 'Saldo positivo' : 'Saldo negativo'}
        </span>
      </div>
    </div>
  );
}

function ContasCard(props: {
  accounts: Account[];
  investments: Asset[];
  icon: LucideIcon;
  editing: boolean;
  onToggle: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canEdit: boolean;
}) {
  const accountItems = [
    ...props.accounts.map((a) => ({
      id: a.id,
      nome: a.nome,
      saldo: a.saldo,
      cor: a.cor,
      tipoLabel: 'Conta',
      icon: 'CreditCard' as const,
    })),
    ...props.investments.map((inv) => ({
      id: inv.id,
      nome: inv.nome,
      saldo: inv.valor,
      cor: '#16a34a',
      tipoLabel: 'Investimento',
      icon: 'TrendingUp' as const,
    })),
  ];

  const total = accountItems.reduce((a, item) => a + item.saldo, 0);

  return (
    <CardShell icon={props.icon} title="Minhas Contas" editing={props.editing} onToggle={props.onToggle} onMoveUp={props.onMoveUp} onMoveDown={props.onMoveDown} canEdit={props.canEdit}>
      <div className="space-y-2">
        {accountItems.map((item) => {
          const ItemIcon = (Icons as unknown as Record<string, LucideIcon>)[item.icon] || Icons.CreditCard;
          return (
            <div key={item.id} className="flex items-center gap-3 p-2.5 bg-ink-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: item.cor + '20' }}>
                <ItemIcon className="w-4 h-4" style={{ color: item.cor }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-900 truncate">{item.nome}</p>
                <p className="text-[10px] text-ink-400">{item.tipoLabel}</p>
              </div>
              <span className="text-sm font-bold text-ink-900">{formatCurrency(item.saldo)}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-100">
        <span className="text-xs font-semibold text-ink-600">Total</span>
        <span className="text-sm font-extrabold text-primary-700">{formatCurrency(total)}</span>
      </div>
    </CardShell>
  );
}

function EntradasSaidasCard(props: { receitas: number; despesas: number; mesNome: string; icon: LucideIcon; title: string; editing: boolean; onToggle: () => void; onMoveUp?: () => void; onMoveDown?: () => void; canEdit: boolean }) {
  return (
    <CardShell icon={props.icon} title={`${props.mesNome} — Entradas x Saídas`} editing={props.editing} onToggle={props.onToggle} onMoveUp={props.onMoveUp} onMoveDown={props.onMoveDown} canEdit={props.canEdit}>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-primary-50 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-4 h-4 text-primary-600" />
            <span className="text-xs font-medium text-primary-700">Entradas</span>
          </div>
          <p className="text-lg font-bold text-primary-700">{formatCurrency(props.receitas)}</p>
        </div>
        <div className="p-3 bg-red-50 rounded-xl">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-4 h-4 text-danger" />
            <span className="text-xs font-medium text-danger">Saídas</span>
          </div>
          <p className="text-lg font-bold text-danger">{formatCurrency(props.despesas)}</p>
        </div>
      </div>
    </CardShell>
  );
}

function GastosCategoriaCard(props: { data: { name: string; value: number; color: string }[]; icon: LucideIcon; title: string; editing: boolean; onToggle: () => void; onMoveUp?: () => void; onMoveDown?: () => void; canEdit: boolean }) {
  const total = props.data.reduce((acc, d) => acc + d.value, 0);
  if (props.data.length === 0) {
    return (
      <CardShell {...props}>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <PieChart className="w-8 h-8 text-ink-300 mb-2" />
          <p className="text-sm text-ink-400">Nenhum gasto registrado este mês</p>
        </div>
      </CardShell>
    );
  }
  return (
    <CardShell {...props}>
      <div className="flex items-center gap-4">
        <div className="w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={props.data} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
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
              <span className="text-xs font-semibold text-ink-900">{Math.round((d.value / total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </CardShell>
  );
}

function ScoreCard(props: { score: number; icon: LucideIcon; title: string; editing: boolean; onToggle: () => void; onMoveUp?: () => void; onMoveDown?: () => void; canEdit: boolean }) {
  const color = props.score >= 70 ? '#16a34a' : props.score >= 40 ? '#f59e0b' : '#ef4444';
  const label = props.score >= 70 ? 'Saudável' : props.score >= 40 ? 'Atenção' : 'Risco';
  return (
    <CardShell {...props}>
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0">
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
            <span className="text-xl font-extrabold" style={{ color }}>{props.score}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color }}>{label}</p>
          <p className="text-xs text-ink-500 mt-1">
            {props.score >= 70 ? 'Suas finanças estão saudáveis. Continue assim!' :
             props.score >= 40 ? 'Atenção aos gastos. Revise seu orçamento.' :
             'Suas finanças precisam de atenção. Reduza despesas.'}
          </p>
        </div>
      </div>
    </CardShell>
  );
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
