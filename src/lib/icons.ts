// Ícones comuns do sistema UnicoPag
export const Icons = {
  // Navegação
  menu: "Menu",
  home: "Home",
  dashboard: "BarChart3",
  settings: "Settings",
  user: "User",
  logout: "LogOut",
  
  // CNPJ e Documentos
  cnpj: "FileText",
  document: "File",
  upload: "Upload",
  download: "Download",
  check: "CheckCircle",
  error: "XCircle",
  warning: "AlertTriangle",
  
  // Propostas e Taxas
  proposal: "FileCheck",
  rate: "Percent",
  calculator: "Calculator",
  chart: "TrendingUp",
  money: "DollarSign",
  
  // Comunicação
  email: "Mail",
  whatsapp: "MessageSquare",
  phone: "Phone",
  message: "MessageCircle",
  
  // Status e Ações
  success: "CheckCircle2",
  loading: "Loader2",
  edit: "Edit",
  delete: "Trash2",
  save: "Save",
  cancel: "X",
  refresh: "RefreshCw",
  
  // Empresa e Cliente
  building: "Building2",
  map: "MapPin",
  calendar: "Calendar",
  clock: "Clock",
  
  // Financeiro
  creditCard: "CreditCard",
  bank: "Landmark",
  receipt: "Receipt",
  wallet: "Wallet",
  
  // Interface
  search: "Search",
  filter: "Filter",
  sort: "ArrowUpDown",
  expand: "ChevronDown",
  collapse: "ChevronUp",
  close: "X",
  plus: "Plus",
  minus: "Minus",
  
  // Tecnologia
  database: "Database",
  server: "Server",
  cloud: "Cloud",
  api: "Zap",
  
  // UnicoPag específicos
  unicopag: "Zap", // Ícone personalizado para UnicoPag
  pos: "CreditCard", // Point of Sale
  merchant: "Store", // Comerciante
} as const;

export type IconName = keyof typeof Icons;
