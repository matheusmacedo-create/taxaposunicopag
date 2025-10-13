import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Icons, IconName } from "@/lib/icons";
import * as LucideIcons from "lucide-react";

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
}

// Mapeamento de nomes para componentes de ícone
const iconMap: Record<string, LucideIcon> = {
  Menu: LucideIcons.Menu,
  Home: LucideIcons.Home,
  BarChart3: LucideIcons.BarChart3,
  Settings: LucideIcons.Settings,
  User: LucideIcons.User,
  LogOut: LucideIcons.LogOut,
  FileText: LucideIcons.FileText,
  File: LucideIcons.File,
  Upload: LucideIcons.Upload,
  Download: LucideIcons.Download,
  CheckCircle: LucideIcons.CheckCircle,
  XCircle: LucideIcons.XCircle,
  AlertTriangle: LucideIcons.AlertTriangle,
  FileCheck: LucideIcons.FileCheck,
  Percent: LucideIcons.Percent,
  Calculator: LucideIcons.Calculator,
  TrendingUp: LucideIcons.TrendingUp,
  DollarSign: LucideIcons.DollarSign,
  Mail: LucideIcons.Mail,
  MessageSquare: LucideIcons.MessageSquare,
  Phone: LucideIcons.Phone,
  MessageCircle: LucideIcons.MessageCircle,
  CheckCircle2: LucideIcons.CheckCircle2,
  Loader2: LucideIcons.Loader2,
  Edit: LucideIcons.Edit,
  Trash2: LucideIcons.Trash2,
  Save: LucideIcons.Save,
  X: LucideIcons.X,
  RefreshCw: LucideIcons.RefreshCw,
  Building2: LucideIcons.Building2,
  MapPin: LucideIcons.MapPin,
  Calendar: LucideIcons.Calendar,
  Clock: LucideIcons.Clock,
  CreditCard: LucideIcons.CreditCard,
  Landmark: LucideIcons.Landmark,
  Receipt: LucideIcons.Receipt,
  Wallet: LucideIcons.Wallet,
  Search: LucideIcons.Search,
  Filter: LucideIcons.Filter,
  ArrowUpDown: LucideIcons.ArrowUpDown,
  ChevronDown: LucideIcons.ChevronDown,
  ChevronUp: LucideIcons.ChevronUp,
  Plus: LucideIcons.Plus,
  Minus: LucideIcons.Minus,
  Database: LucideIcons.Database,
  Server: LucideIcons.Server,
  Cloud: LucideIcons.Cloud,
  Zap: LucideIcons.Zap,
  Store: LucideIcons.Store,
};

export const Icon = ({ name, className, size = 20 }: IconProps) => {
  const IconComponent = iconMap[Icons[name]];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }
  
  return (
    <IconComponent 
      className={cn("h-5 w-5", className)} 
      size={size}
    />
  );
};

// Componente para ícones com animação de loading
export const LoadingIcon = ({ className }: { className?: string }) => (
  <LucideIcons.Loader2 className={cn("h-4 w-4 animate-spin", className)} />
);

// Componente para ícones de status
export const StatusIcon = ({ 
  status, 
  className 
}: { 
  status: "success" | "error" | "warning" | "loading";
  className?: string;
}) => {
  const iconMap = {
    success: LucideIcons.CheckCircle2,
    error: LucideIcons.XCircle,
    warning: LucideIcons.AlertTriangle,
    loading: LucideIcons.Loader2,
  };
  
  const colorMap = {
    success: "text-green-500",
    error: "text-red-500",
    warning: "text-yellow-500",
    loading: "text-blue-500 animate-spin",
  };
  
  const IconComponent = iconMap[status];
  
  return (
    <IconComponent 
      className={cn("h-4 w-4", colorMap[status], className)} 
    />
  );
};
