import { motion } from 'framer-motion';
import {
  BarChart3, TrendingUp, TrendingDown, PieChart as PieChartIcon, Activity,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  BarChart, Bar,
} from 'recharts';
import { Layout } from '@/components/ui/Layout';
import { useStore } from '@/store/useStore';
import { CATEGORIES } from '@/data/categories';
import {
  getReceitasMes, getDespesasMes, getGastosPorCategoria, getScoreSaude,
  getComparacaoMensal, getSaldo,
} from '@/lib/analytics';
import { formatCurrency, formatCurrencyShort, getMonthName } from '@/lib/format';

export function Analytics() {
  const transactions = useStore((s) => s.transactions);
  const budgets = useStore((s) => s.budgets);

  const receitas = getReceitasMes(transactions);
  const despesas = getDespesasMes(transactions);
  const saldo = getSaldo(transactions);
  const score = getScoreSaude(transactions, budgets);
  const gastosCat = getGastosPorCategoria(transactions);
  const comparacao = getComparacaoMensal(transactions);

  const donutData = gastosCat.map((g) => ({
    name: CATEGORIES[g.categoria].nome,
    value: g.valor,
    color: CATEGORIES[g.categoria].cor,
  }));

  const saldoData = comparacao.map((c) => ({
    mes: c.mes,
    saldo: c.receitas - c.despesas,
  }));

  return (
    <Layout title="Análises">
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-card text-center">
          <TrendingUp className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <p className="text-[10px] text-ink-400">Receitas</p>
          <p className="text-sm font-bold text-primary-700">{formatCurrencyShort(receitas)}</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-card text-center">
          <TrendingDown className="w-5 h-5 text-danger mx-auto mb-1" />
          <p className="text-[10px] text-ink-400">Despesas</p>
          <p className="text-sm font-bold text-danger">{formatCurrencyShort(despesas)}</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-card text-center">
          <Activity className="w-5 h-5 text-accent-600 mx-auto mb-1" />
          <p className="text-[10px] text-ink-400">Score</p>
          <p className="text-sm font-bold text-accent-600">{score}/100</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-card p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-ink-900 text-sm">Evolução do Saldo</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={saldoData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCurrencyShort(v)} />
            <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12 }} />
            <Line type="monotone" dataKey="saldo" stroke="#16a34a" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-card p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <PieChartIcon className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-ink-900 text-sm">Gastos por Categoria — {getMonthName()}</h2>
        </div>
        {donutData.length === 0 ? (
          <p className="text-sm text-ink-400 text-center py-8">Sem dados ainda</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" label>
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {donutData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-ink-700 flex-1 truncate">{d.name}</span>
                  <span className="text-xs font-semibold text-ink-900">{formatCurrencyShort(d.value)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-ink-900 text-sm">Receitas x Despesas (6 meses)</h2>
        </div>
        <ResponsiveContainer width="100%" height={200}>
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
    </Layout>
  );
}
