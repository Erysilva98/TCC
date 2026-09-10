import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, Target, RotateCcw, Award, CheckCircle, Circle,
  Wallet,
} from 'lucide-react';
import { Layout, XpProgressInfo } from '@/components/ui/Layout';
import { useStore } from '@/store/useStore';
import { PROFILES } from '@/data/profiles';
import { CATEGORIES } from '@/data/categories';
import { getMonthName } from '@/lib/format';
import { canCompleteChallenge, getChallengeProgress } from '@/lib/progress';
import type { CategoryId } from '@/types';

export function Profile() {
  const {
    onboarding, xp, challenges, goals, transactions, budgets, accounts, assets, lessonProgress,
    completeChallenge, resetApp,
  } = useStore();

  const [showBudget, setShowBudget] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [budgetCat, setBudgetCat] = useState<CategoryId>('alimentacao');
  const [budgetVal, setBudgetVal] = useState('');

  const profile = onboarding.profile!;
  const config = PROFILES[profile];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if ((location.state as { section?: string } | null)?.section === 'desafios') {
      document.getElementById('desafios-mensais')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [location.state]);

  const monthChallenges = challenges.filter((c) => c.mes === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
  const doneChallenges = monthChallenges.filter((c) => c.concluido).length;
  const totalCompletedChallenges = challenges.filter((c) => c.concluido).length;

  async function handleResetConfirmed() {
    await resetApp();
    navigate('/', { replace: true });
  }

  function handleReset() {
    if (confirm('Tem certeza? Todos os dados serão apagados permanentemente.')) {
      resetApp();
      window.location.hash = '#/';
    }
  }

  return (
    <Layout title="Perfil">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="p-3 bg-white rounded-2xl shadow-card text-center">
          <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
          <p className="text-lg font-bold text-ink-900">{xp}</p>
          <p className="text-[10px] text-ink-400">XP Total</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-card text-center">
          <Award className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-ink-900">{totalCompletedChallenges}</p>
          <p className="text-[10px] leading-tight text-ink-400">Concluídos</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-card text-center">
          <Target className="w-5 h-5 text-primary-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-ink-900">{goals.length}</p>
          <p className="text-[10px] text-ink-400">Metas</p>
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-card text-center">
          <Wallet className="w-5 h-5 text-accent-600 mx-auto mb-1" />
          <p className="text-lg font-bold text-ink-900">{transactions.length}</p>
          <p className="text-[10px] text-ink-400">Transações</p>
        </div>
      </div>

      {/* Monthly Challenges */}
      <motion.div
        id="desafios-mensais"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-card p-4 mb-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-600" />
            <h2 className="font-bold text-ink-900 text-sm">Desafios de {getMonthName()}</h2>
          </div>
          <span className="text-xs text-ink-500">{doneChallenges}/{monthChallenges.length}</span>
        </div>
        <div className="space-y-2">
          {monthChallenges.map((c) => {
            const state = { transactions, goals, accounts, assets, budgets, lessonProgress };
            const eligible = canCompleteChallenge(c, state);
            const progress = getChallengeProgress(c, state);
            return (
            <div
              key={c.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                c.concluido ? 'bg-primary-50' : 'bg-ink-50'
              }`}
            >
              {c.concluido ? (
                <CheckCircle className="w-5 h-5 text-primary-600 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-ink-300 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${c.concluido ? 'text-primary-700' : 'text-ink-800'}`}>
                  {c.titulo}
                </p>
                <p className="text-xs text-ink-400">{c.descricao}</p>
                {!c.concluido && <p className="text-[11px] text-ink-500 mt-1">Progresso: {progress.current}/{progress.target}</p>}
              </div>
              <span className="text-xs font-semibold text-primary-600 shrink-0">+{c.xp}</span>
              {!c.concluido && (
                <button
                  onClick={() => completeChallenge(c.id)}
                  disabled={!eligible}
                  className={`text-xs font-medium shrink-0 ${eligible ? 'text-primary-600 hover:underline' : 'text-ink-400 cursor-not-allowed'}`}
                >
                  {eligible ? 'Concluir' : 'Em andamento'}
                </button>
              )}
            </div>
          );
          })}
        </div>
      </motion.div>

      {/* XP Rules */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-card p-4 mb-4"
      >
        <XpProgressInfo />
      </motion.div>

      {/* Reset */}
      <button
        onClick={() => setShowResetDialog(true)}
        className="w-full flex items-center justify-center gap-2 p-3 text-danger text-sm font-medium hover:bg-red-50 rounded-2xl transition-colors"
      >
        <RotateCcw className="w-4 h-4" /> Recomeçar (apagar todos os dados)
      </button>
      {showResetDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4" role="dialog" aria-modal="true" aria-labelledby="reset-title">
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <h2 id="reset-title" className="text-lg font-bold text-ink-900">Recomeçar aplicativo?</h2>
            <p className="mt-2 text-sm text-ink-600">Seu perfil, gastos, contas, metas, investimentos, orçamentos e progresso serão apagados permanentemente.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setShowResetDialog(false)} className="btn-ghost flex-1">Cancelar</button>
              <button onClick={handleResetConfirmed} className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90">Apagar tudo</button>
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}




