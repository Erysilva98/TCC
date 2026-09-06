import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { QUESTIONS } from '@/data/questions';
import { useStore } from '@/store/useStore';
import { PROFILES, getProfileFromScore } from '@/data/profiles';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useStore((s) => s.completeOnboarding);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const totalQuestions = QUESTIONS.length;
  const progress = ((currentQ + (showResult ? 1 : 0)) / (totalQuestions + 1)) * 100;
  const score = answers.reduce((acc, p) => acc + p, 0);
  const profile = getProfileFromScore(score);

  function selectAnswer(points: number) {
    const newAnswers = [...answers];
    newAnswers[currentQ] = points;
    setAnswers(newAnswers);
    if (currentQ < totalQuestions - 1) {
      setTimeout(() => setCurrentQ((q) => q + 1), 250);
    } else {
      setTimeout(() => setShowResult(true), 250);
    }
  }

  function finish() {
    completeOnboarding(score);
    navigate('/dashboard');
  }

  if (showResult) {
    const config = PROFILES[profile];
    const ProfileIcon = (Icons as unknown as Record<string, LucideIcon>)[config.icon] || Icons.User;
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex flex-col items-center justify-center px-6 max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
          style={{ backgroundColor: config.corLight }}
        >
          <ProfileIcon className="w-12 h-12" style={{ color: config.cor }} strokeWidth={2} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-ink-500 mb-1">Seu perfil é</p>
          <h1 className="text-3xl font-extrabold text-ink-900 mb-2">{config.nome}</h1>
          <p className="text-ink-600">{config.objetivo}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink-100">
            <span className="text-sm font-medium text-ink-700">Pontuação: {score}/10</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full space-y-3 mb-8"
        >
          <p className="text-sm font-semibold text-ink-700 text-center">O que você terá acesso:</p>
          <div className="space-y-2">
            {config.menu.map((item) => {
              const Icon = (Icons as unknown as Record<string, LucideIcon>)[item.icon] || Icons.Circle;
              return (
                <div key={item.path} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: config.corLight }}>
                    <Icon className="w-4 h-4" style={{ color: config.cor }} />
                  </div>
                  <span className="text-sm font-medium text-ink-800">{item.label}</span>
                  <Check className="w-4 h-4 text-primary-600 ml-auto" />
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={finish}
          className="btn-primary w-full text-lg py-4"
        >
          Acessar meu dashboard <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    );
  }

  const question = QUESTIONS[currentQ];

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto px-6 py-6">
      <div className="flex items-center gap-3 mb-6">
        {currentQ > 0 && (
          <button onClick={() => setCurrentQ((q) => q - 1)} className="p-1 text-ink-500 hover:text-ink-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-600 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <span className="text-xs font-medium text-ink-500">{currentQ + 1}/{totalQuestions}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          <h2 className="text-2xl font-bold text-ink-900 mb-6 mt-4">{question.pergunta}</h2>
          <div className="space-y-3">
            {question.opcoes.map((opt) => {
              const isSelected = answers[currentQ] === opt.points;
              return (
                <button
                  key={opt.label}
                  onClick={() => selectAnswer(opt.points)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-ink-200 hover:border-ink-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      isSelected ? 'bg-primary-600 text-white' : 'bg-ink-100 text-ink-600'
                    }`}>
                      {opt.label}
                    </div>
                    <span className="text-sm text-ink-800 pt-0.5">{opt.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
