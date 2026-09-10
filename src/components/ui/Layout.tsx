import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { BottomNav } from './BottomNav';
import { useStore } from '@/store/useStore';
import { getProfileRank, PROFILES } from '@/data/profiles';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { getLevel } from '@/lib/analytics';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  headerRight?: ReactNode;
  showHeader?: boolean;
  showNav?: boolean;
}

export function XpProgressInfo() {
  return (
    <>
      <p className="font-semibold text-ink-900 mb-3">Como ganhar XP</p>
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2"><span>Registrar gasto</span><b className="text-primary-600">+5 XP</b></div>
        <div className="flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2"><span>Criar meta</span><b className="text-primary-600">+30 XP</b></div>
        <div className="flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2"><span>Completar aula</span><b className="text-primary-600">+15 XP</b></div>
        <div className="flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2"><span>Completar desafio</span><b className="text-primary-600">+50 XP</b></div>
      </div>
      <section className="mt-4 border-t border-ink-100 pt-4">
        <p className="font-semibold text-ink-900 mb-2">Como subir de nível</p>
        <ol className="space-y-1.5 text-xs leading-relaxed text-ink-600 list-decimal pl-4">
          <li>Você evolui do Nível 1 ao Nível 100 em cada perfil.</li>
          <li>Complete 100 XP para subir um nível.</li>
          <li>Ao subir de nível, o progresso reinicia em 0/100 XP.</li>
          <li>Ao concluir o Nível 100, você desbloqueia o próximo perfil e volta ao Nível 1.</li>
          <li>O número no círculo indica a classificação do perfil, de 1 a 4.</li>
        </ol>
      </section>
    </>
  );
}

export function Layout({ children, headerRight, showHeader = true, showNav = true }: LayoutProps) {
  const profile = useStore((s) => s.onboarding.profile);
  const initialProfile = useStore((s) => s.onboarding.initialProfile);
  const xp = useStore((s) => s.xp);
  const [showXpInfo, setShowXpInfo] = useState(false);
  const xpInfoRef = useRef<HTMLDivElement>(null);
  const profileConfig = profile ? PROFILES[profile] : null;
  const ProfileIcon = profileConfig
    ? (Icons as unknown as Record<string, LucideIcon>)[profileConfig.icon] || Icons.User
    : Icons.User;
  const profileRank = profile ? getProfileRank(profile) : 1;
  const isMasterProfile = profile === 'mestre';
  const initialProfileRank = initialProfile ? getProfileRank(initialProfile) : profileRank;
  const level = getLevel(xp, profileRank, initialProfileRank);

  useEffect(() => {
    if (!showXpInfo) return;
    const closeWhenClickingOutside = (event: PointerEvent) => {
      if (xpInfoRef.current && !xpInfoRef.current.contains(event.target as Node)) setShowXpInfo(false);
    };
    document.addEventListener('pointerdown', closeWhenClickingOutside);
    return () => document.removeEventListener('pointerdown', closeWhenClickingOutside);
  }, [showXpInfo]);

  const defaultLevelCard = (
    <div ref={xpInfoRef} className="relative shrink-0">
      <div className="h-10 px-2.5 rounded-xl flex items-center gap-2" style={{ backgroundColor: profileConfig?.corLight || '#dcfce7' }}>
        <span className="w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ backgroundColor: profileConfig?.cor || '#16a34a' }}>{profileRank}</span>
        {isMasterProfile ? (
          <Icons.Trophy className="w-5 h-5 fill-amber-400 text-amber-600" aria-label="Classificação máxima: Mestre Financeiro" />
        ) : (
          <span className="text-[11px] leading-tight" style={{ color: profileConfig?.cor || '#16a34a' }}><b className="block">Nível {level.level}</b><span>{level.current}/{level.needed} XP</span></span>
        )}
        <button type="button" onClick={() => setShowXpInfo((open) => !open)} className="p-0.5" style={{ color: profileConfig?.cor || '#16a34a' }} aria-label="Como ganhar XP"><Icons.CircleHelp className="w-4 h-4" /></button>
      </div>
      {showXpInfo && <div className="absolute top-full right-0 z-[60] mt-2 w-[340px] max-w-[calc(100vw-2rem)] p-4 bg-white rounded-2xl shadow-card"><XpProgressInfo /></div>}
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50">
      {showHeader && (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-ink-200 safe-top">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: profileConfig?.corLight || '#dcfce7' }}
              >
                <ProfileIcon className="w-5 h-5" style={{ color: profileConfig?.cor || '#16a34a' }} />
              </div>
              <div className="min-w-0">
                <span className="block font-bold text-ink-900 text-sm">FinEdu Wallet</span>
                {profileConfig && (
                  <span
                    className="inline-block max-w-full truncate text-[10px] font-semibold mt-0.5 px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: profileConfig.corLight, color: profileConfig.cor }}
                  >
                    {profileConfig.nome}
                  </span>
                )}
              </div>
              </div>
              <div className="mr-[3%]">{headerRight ?? defaultLevelCard}</div>
            </div>
          </div>
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
