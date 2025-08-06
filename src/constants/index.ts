// Constantes da aplicação Open Banking

export const API_BASE_URL = "http://localhost:3000";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  ACCOUNTS: "/accounts",
  TRANSACTIONS: "/transactions",
  TRANSFERS: "/transfers",
  REPORTS: "/reports",
  SETTINGS: "/settings",
} as const;

export const TRANSACTION_CATEGORIES = {
  food: "Alimentação",
  transport: "Transporte",
  shopping: "Compras",
  bills: "Contas",
  entertainment: "Entretenimento",
  health: "Saúde",
  education: "Educação",
  investment: "Investimento",
  salary: "Salário",
  transfer: "Transferência",
  other: "Outros",
} as const;

export const ACCOUNT_TYPES = {
  checking: "Conta Corrente",
  savings: "Poupança",
  investment: "Investimento",
} as const;

export const TRANSACTION_STATUS = {
  pending: "Pendente",
  completed: "Concluída",
  failed: "Falhou",
} as const;

export const CURRENCY_FORMAT = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export const DATE_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export const DATETIME_FORMAT = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const COLORS = {
  primary: "#1e40af",
  secondary: "#64748b",
  success: "#059669",
  warning: "#d97706",
  error: "#dc2626",
  info: "#0284c7",
} as const;
