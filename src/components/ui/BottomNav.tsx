import { NavLink } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { PROFILES } from '@/data/profiles';

export function BottomNav() {
  const profile = useStore((s) => s.onboarding.profile);
  if (!profile) return null;
  const config = PROFILES[profile];
  const menu = config.menu;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-ink-200 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around px-4 py-1.5">
        {menu.map((item) => {
          const Icon = (Icons as unknown as Record<string, LucideIcon>)[item.icon] || Icons.Circle;
          return (
            <NavLink key={item.path} to={item.path} className="flex-1">
              {({ isActive }) => (
                <div className={`nav-item ${isActive ? 'text-primary-600' : 'text-ink-400'}`}>
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-medium leading-none">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -mt-1.5 w-1 h-1 rounded-full bg-primary-600"
                    />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
