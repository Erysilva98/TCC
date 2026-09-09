import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Clock, Award, X, CheckCircle, BookOpen } from 'lucide-react';
import { Layout } from '@/components/ui/Layout';
import { useStore } from '@/store/useStore';
import { getLessonsForProfile, type Lesson } from '@/data/lessons';
import { canCompleteLesson, getLessonTask } from '@/lib/progress';
import type { ProfileType } from '@/types';

export function Learn() {
  const profile = useStore((s) => s.onboarding.profile) as ProfileType;
  const lessonProgress = useStore((s) => s.lessonProgress);
  const completeLesson = useStore((s) => s.completeLesson);
  const transactions = useStore((s) => s.transactions);
  const goals = useStore((s) => s.goals);
  const accounts = useStore((s) => s.accounts);
  const assets = useStore((s) => s.assets);
  const budgets = useStore((s) => s.budgets);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const navigate = useNavigate();

  const lessons = getLessonsForProfile(profile);

  function isDone(id: string) {
    return lessonProgress.some((l) => l.lessonId === id && l.concluido);
  }

  return (
    <Layout title="Aprender">
      <div className="p-4 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl text-white mb-4">
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-5 h-5" />
          <h2 className="font-bold">Trilha de Aprendizado</h2>
        </div>
        <p className="text-sm opacity-90">
          {lessons.filter((l) => isDone(l.id)).length} de {lessons.length} aulas concluídas
        </p>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden mt-2">
          <div className="h-full bg-white rounded-full transition-all" style={{ width: `${(lessons.filter((l) => isDone(l.id)).length / lessons.length) * 100}%` }} />
        </div>
      </div>

      <div className="space-y-2">
        {lessons.map((lesson, i) => {
          const done = isDone(lesson.id);
          return (
            <motion.button
              key={lesson.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveLesson(lesson)}
              className="w-full text-left p-4 bg-white rounded-2xl shadow-card flex items-start gap-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${done ? 'bg-primary-100' : 'bg-ink-100'}`}>
                {done ? <CheckCircle className="w-5 h-5 text-primary-600" /> : <BookOpen className="w-5 h-5 text-ink-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ink-900 text-sm">{lesson.titulo}</h3>
                {lesson.modulo && <p className="text-[10px] font-semibold text-primary-600 mt-0.5">{lesson.modulo} · Nível {lesson.nivel}</p>}
                <p className="text-xs text-ink-500 mt-0.5 line-clamp-2">{lesson.descricao}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="flex items-center gap-1 text-xs text-ink-400">
                    <Clock className="w-3 h-3" /> {lesson.duracao}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
                    <Award className="w-3 h-3" /> +{lesson.xp} XP
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeLesson && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setActiveLesson(null)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-4 top-[8.0625rem] z-50 bg-white rounded-3xl max-w-md mx-auto max-h-[82vh] overflow-y-auto safe-bottom"
            >
              <div className="flex items-center justify-between p-4 border-b border-ink-100 sticky top-0 bg-white rounded-t-3xl">
                <h2 className="font-bold text-ink-900">{activeLesson.titulo}</h2>
                <button onClick={() => setActiveLesson(null)} className="p-1 text-ink-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="chip bg-ink-100 text-ink-600 text-xs">
                    <Clock className="w-3 h-3" /> {activeLesson.duracao}
                  </span>
                  <span className="chip bg-primary-50 text-primary-700 text-xs">
                    <Award className="w-3 h-3" /> +{activeLesson.xp} XP
                  </span>
                </div>
                <p className="text-sm text-ink-700 leading-relaxed mb-4">{activeLesson.conteudo}</p>
                {activeLesson.modulo && <p className="text-xs font-semibold text-primary-600 mb-3">{activeLesson.modulo} · Nível {activeLesson.nivel}</p>}
                {!isDone(activeLesson.id) ? (
                  <div className="space-y-3">
                    {(() => {
                      const task = getLessonTask(activeLesson.id);
                      const completeReady = canCompleteLesson(activeLesson.id, { transactions, goals, accounts, assets, budgets });
                      return <><div className={`p-3 rounded-xl text-sm ${completeReady ? 'bg-primary-50 text-primary-800' : 'bg-ink-50 text-ink-700'}`}><p className="font-semibold mb-1">Atividade prática</p><p>{task.label}</p>{!completeReady && <button type="button" onClick={() => { setActiveLesson(null); navigate(task.path); }} className="mt-2 text-xs font-semibold text-primary-600">Realizar atividade</button>}</div>
                    <button
                      onClick={() => { completeLesson(activeLesson.id); setActiveLesson(null); }}
                      disabled={!completeReady}
                      className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle className="w-5 h-5" /> Concluir aula (+{activeLesson.xp} XP)
                    </button>
                      </>;
                    })()}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-primary-600 font-semibold py-2">
                    <CheckCircle className="w-5 h-5" /> Aula concluída
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}
