import { Calculator, Percent, Coins, HeartHandshake, Car, Plane, TrendingUp } from "lucide-react";

export const getToolConfig = (slug: string) => {
  if (!slug) return { icon: Calculator, iconColor: '', iconBg: '', ctaLabel: 'View' };
  if (slug.includes('vat')) return { icon: Percent, iconColor: 'text-[#4b0082] group-hover:text-white', iconBg: 'bg-blue-50 group-hover:bg-[#4b0082]', ctaLabel: 'Calculate VAT' };
  if (slug.includes('zakat')) return { icon: HeartHandshake, iconColor: 'text-indigo-500 group-hover:text-white', iconBg: 'bg-indigo-50 group-hover:bg-indigo-500', ctaLabel: 'Calculate Zakat' };
  if (slug.includes('gratuity')) return { icon: Coins, iconColor: 'text-amber-500 group-hover:text-white', iconBg: 'bg-amber-50 group-hover:bg-amber-500', ctaLabel: 'Calculate Benefits' };
  if (slug.includes('loan') || slug.includes('car')) return { icon: Car, iconColor: 'text-sky-500 group-hover:text-white', iconBg: 'bg-sky-50 group-hover:bg-sky-600', ctaLabel: 'Estimate EMI' };
  if (slug.includes('visa') || slug.includes('freelance')) return { icon: Plane, iconColor: 'text-violet-500 group-hover:text-white', iconBg: 'bg-violet-50 group-hover:bg-violet-500', ctaLabel: 'Compare Costs' };
  if (slug.includes('roi')) return { icon: TrendingUp, iconColor: 'text-emerald-500 group-hover:text-white', iconBg: 'bg-emerald-50 group-hover:bg-emerald-500', ctaLabel: 'Check ROI' };
  return { icon: Calculator, iconColor: 'text-purple-600 group-hover:text-white', iconBg: 'bg-purple-50 group-hover:bg-purple-600', ctaLabel: 'Calculate Now' };
};