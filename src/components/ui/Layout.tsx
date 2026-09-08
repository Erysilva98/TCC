import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { useStore } from '@/store/useStore';
import { PROFILES } from '@/data/profiles';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showHeader?: boolean;
  showNav?: boolean;
}

export function Layout({ children, title, showHeader = true, showNav = true }: LayoutProps) {
  const profile = useStore((s) => s.onboarding.profile);
  const profileConfig = profile ? PROFILES[profile] : null;
  const ProfileIcon = profileConfig
    ? (Icons as unknown as Record<string, LucideIcon>)[profileConfig.icon] || Icons.User
    : Icons.User;

  return (
    <div className="min-h-screen bg-ink-50">
      {showHeader && (
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-ink-200 safe-top">
          <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: profileConfig?.corLight || '#dcfce7' }}
              >
                <ProfileIcon className="w-5 h-5" style={{ color: profileConfig?.cor || '#16a34a' }} />
              </div>
              <span className="font-bold text-ink-900 text-sm">FinEdu Wallet</span>
            </div>
            <div className="flex items-center gap-2">
              {profileConfig && (
                <div
                  className="chip text-xs"
                  style={{ backgroundColor: profileConfig.corLight, color: profileConfig.cor }}
                >
                  {profileConfig.nome}
                </div>
              )}
            </div>
          </div>
          {title && (
            <div className="max-w-md mx-auto px-4 pb-3">
              <h1 className="text-xl font-bold text-ink-900">{title}</h1>
            </div>
          )}
        </header>
      )}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={`max-w-md mx-auto px-4 py-4 ${showNav ? 'pb-24' : ''}`}
      >
        {children}
      </motion.main>
      {showNav && <BottomNav />}
    </div>
  );
}
