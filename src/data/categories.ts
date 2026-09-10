import type { CategoryId } from '@/types';

export interface CategoryConfig { id: CategoryId; nome: string; icon: string; cor: string; tipo: 'despesa' | 'receita' | 'ambos'; }

export const CATEGORIES: Record<CategoryId, CategoryConfig> = {
  alimentacao: { id: 'alimentacao', nome: 'Alimentação', icon: 'UtensilsCrossed', cor: '#f97316', tipo: 'despesa' },
  transporte: { id: 'transporte', nome: 'Transporte', icon: 'Car', cor: '#3b82f6', tipo: 'despesa' },
  moradia: { id: 'moradia', nome: 'Moradia', icon: 'Home', cor: '#8b5cf6', tipo: 'despesa' },
  lazer: { id: 'lazer', nome: 'Lazer', icon: 'Gamepad2', cor: '#ec4899', tipo: 'despesa' },
  saude: { id: 'saude', nome: 'Saúde', icon: 'HeartPulse', cor: '#ef4444', tipo: 'despesa' },
  educacao: { id: 'educacao', nome: 'Educação', icon: 'BookOpen', cor: '#14b8a6', tipo: 'despesa' },
  cartao_credito: { id: 'cartao_credito', nome: 'Cartão de crédito', icon: 'CreditCard', cor: '#2563eb', tipo: 'despesa' },
  salario: { id: 'salario', nome: 'Salário', icon: 'Banknote', cor: '#16a34a', tipo: 'receita' },
  outros: { id: 'outros', nome: 'Outros', icon: 'CircleDot', cor: '#6b7280', tipo: 'ambos' },
};

export const DESPESA_CATEGORIES: CategoryId[] = ['alimentacao', 'transporte', 'moradia', 'lazer', 'saude', 'educacao', 'cartao_credito', 'outros'];
export const RECEITA_CATEGORIES: CategoryId[] = ['salario', 'outros'];
export function getCategory(id: CategoryId): CategoryConfig { return CATEGORIES[id]; }
