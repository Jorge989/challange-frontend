// Tipos principais da aplicação Open Banking

export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  agency: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  type: 'credit' | 'debit';
  category: TransactionCategory;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  scheduledDate?: string;
  completedDate?: string;
  createdAt: string;
}

export type TransactionCategory = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'education'
  | 'investment'
  | 'salary'
  | 'transfer'
  | 'other';

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTransactionRequest {
  accountId: string;
  type: 'credit' | 'debit';
  category: TransactionCategory;
  amount: number;
  description: string;
}

export interface CreateTransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
  scheduledDate?: string;
}

export interface UpdateAccountRequest {
  isActive?: boolean;
}

export interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactionCount: number;
  accountsCount: number;
}

