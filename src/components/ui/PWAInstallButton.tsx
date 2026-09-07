import { useState, useEffect } from 'react';
import { Download, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let savedInstallPrompt: BeforeInstallPromptEvent | null = null;

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    savedInstallPrompt = event as BeforeInstallPromptEvent;
    window.dispatchEvent(new Event('pwa-install-available'));
  });

  window.addEventListener('appinstalled', () => {
    savedInstallPrompt = null;
    window.dispatchEvent(new Event('pwa-installed'));
  });
}

export function PWAInstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(savedInstallPrompt);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleAvailable = () => {
      setDeferredPrompt(savedInstallPrompt);
      if (!localStorage.getItem('pwa-banner-dismissed')) {
        setShowBanner(true);
      }
    };

    const handleInstalled = () => {
      setInstalled(true);
      setShowBanner(false);
    };

    if (savedInstallPrompt && !localStorage.getItem('pwa-banner-dismissed')) {
      setShowBanner(true);
    }

    window.addEventListener('pwa-install-available', handleAvailable);
    window.addEventListener('pwa-installed', handleInstalled);

    return () => {
      window.removeEventListener('pwa-install-available', handleAvailable);
      window.removeEventListener('pwa-installed', handleInstalled);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    savedInstallPrompt = null;
    setShowBanner(false);
  }

  function handleDismiss() {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  }

  if (installed) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        className="btn-ghost text-sm"
        title="Instalar aplicativo"
      >
        <Download className="w-4 h-4" />
        Instalar
      </button>

      <AnimatePresence>
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed top-16 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-ink-200 bg-white p-4 shadow-lg"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex gap-3">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" />
              <div className="flex-1 text-sm text-ink-700">
                <p className="font-semibold text-ink-900">Instalar FinEdu Wallet</p>
                <p className="mt-1">No menu do navegador, escolha <strong>Instalar aplicativo</strong> ou <strong>Adicionar à tela inicial</strong>.</p>
              </div>
              <button onClick={() => setShowInstructions(false)} className="h-6 text-ink-400 hover:text-ink-900" aria-label="Fechar">
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBanner && deferredPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-4 right-4 z-40 max-w-md mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-ink-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
                <Download className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">Instalar FinEdu Wallet</p>
                <p className="text-xs text-ink-500">Acesse rapidamente do seu dispositivo</p>
              </div>
              <button onClick={handleInstall} className="btn-primary text-sm py-2 px-3">Instalar</button>
              <button onClick={handleDismiss} className="p-1 text-ink-400 hover:text-ink-900">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
