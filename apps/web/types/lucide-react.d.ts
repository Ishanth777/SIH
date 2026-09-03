import type { ComponentType, SVGProps } from 'react';

declare module 'lucide-react' {
  export interface LucideProps extends Partial<Omit<SVGProps<SVGSVGElement>, 'ref'>> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
    absoluteStrokeWidth?: boolean;
    className?: string;
  }
  export type LucideIcon = ComponentType<LucideProps>;

  export const Building2: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Phone: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const KeyRound: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Users: LucideIcon;
  export const Zap: LucideIcon;
  export const Briefcase: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const IndianRupee: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const Search: LucideIcon;
  export const Plus: LucideIcon;
  export const LogOut: LucideIcon;
  export const X: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Info: LucideIcon;
  export const Clock: LucideIcon;
  export const Radio: LucideIcon;
  export const Activity: LucideIcon;
  export const RotateCw: LucideIcon;

  const icons: Record<string, LucideIcon>;
  export default icons;
}
