import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp, GraduationCap, ArrowRight } from 'lucide-react';
import { PWAInstallButton } from '@/components/ui/PWAInstallButton';

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col">
      <div className="absolute right-4 top-4 z-30">
        <PWAInstallButton />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-3xl bg-primary-600 flex items-center justify-center mb-8 shadow-lg shadow-primary-600/30"
        >
          <Wallet className="w-10 h-10 text-white" strokeWidth={2.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-extrabold text-ink-900 text-center mb-3"
        >
          FinEdu Wallet
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-ink-600 text-center mb-2 font-medium"
        >
          Entenda seu dinheiro.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-ink-600 text-center mb-2 font-medium"
        >
          Crie melhores hábitos.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-ink-600 text-center mb-12 font-medium"
        >
          Evolua financeiramente.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 mb-10 w-full"
        >
          <div className="flex items-center gap-3 text-ink-700">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm">Dashboard que se adapta ao seu perfil financeiro</span>
          </div>
          <div className="flex items-center gap-3 text-ink-700">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-primary-600" />
            </div>
            <span className="text-sm">Aprenda e evolua com desafios mensais</span>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          onClick={() => navigate('/onboarding')}
          className="btn-primary w-full text-lg py-4"
        >
          Iniciar <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      <div className="text-center pb-8 text-xs text-ink-400">
        Sem cadastro. Seus dados ficam no seu dispositivo.
      </div>
    </div>
  );
}
