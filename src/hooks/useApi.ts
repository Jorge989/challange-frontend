// Hooks personalizados para React Query

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import type {
  User,
  Account,
  Transaction,
  Transfer,
  CreateTransactionRequest,
  CreateTransferRequest,
  UpdateAccountRequest,
  DashboardStats,
} from "@/types";

// Query Keys
export const queryKeys = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
  accounts: ["accounts"] as const,
  accountsByUser: (userId: string) => ["accounts", "user", userId] as const,
  account: (id: string) => ["accounts", id] as const,
  transactions: ["transactions"] as const,
  transactionsByAccount: (accountId: string) =>
    ["transactions", "account", accountId] as const,
  transaction: (id: string) => ["transactions", id] as const,
  transfers: ["transfers"] as const,
  transfersByAccount: (accountId: string) =>
    ["transfers", "account", accountId] as const,
  transfer: (id: string) => ["transfers", id] as const,
  dashboardStats: (userId: string) => ["dashboard", "stats", userId] as const,
};

// Users
export function useUsers() {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => apiService.getUsers(),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => apiService.getUser(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      apiService.updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.setQueryData(queryKeys.user(updatedUser.id), updatedUser);
    },
  });
}

// Accounts

export function useCreateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Account, "id">) => apiService.createAccount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      // ou outras invalidações que quiser
    },
  });
}

export function useAccounts() {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => apiService.getAccounts(),
  });
}

export function useAccountsByUserId(userId: string) {
  return useQuery({
    queryKey: queryKeys.accountsByUser(userId),
    queryFn: () => apiService.getAccountsByUserId(userId),
    enabled: !!userId,
  });
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => apiService.getAccount(id),
    enabled: !!id,
  });
}

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountRequest }) =>
      apiService.updateAccount(id, data),
    onSuccess: (updatedAccount) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountsByUser(updatedAccount.userId),
      });
      queryClient.setQueryData(
        queryKeys.account(updatedAccount.id),
        updatedAccount
      );
    },
  });
}

// Transactions
export function useTransactions() {
  return useQuery({
    queryKey: queryKeys.transactions,
    queryFn: () => apiService.getTransactions(),
  });
}

export function useTransactionsByAccountId(accountId: string) {
  return useQuery({
    queryKey: queryKeys.transactionsByAccount(accountId),
    queryFn: () => apiService.getTransactionsByAccountId(accountId),
    enabled: !!accountId,
  });
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => apiService.getTransaction(id),
    enabled: !!id,
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) =>
      apiService.createTransaction(data),
    onSuccess: (newTransaction) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactionsByAccount(newTransaction.accountId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

// Transfers
export function useTransfers() {
  return useQuery({
    queryKey: queryKeys.transfers,
    queryFn: () => apiService.getTransfers(),
  });
}

export function useTransfersByAccountId(accountId: string) {
  return useQuery({
    queryKey: queryKeys.transfersByAccount(accountId),
    queryFn: () => apiService.getTransfersByAccountId(accountId),
    enabled: !!accountId,
  });
}

export function useTransfer(id: string) {
  return useQuery({
    queryKey: queryKeys.transfer(id),
    queryFn: () => apiService.getTransfer(id),
    enabled: !!id,
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransferRequest) =>
      apiService.createTransfer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers });
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts });
    },
  });
}

export function useUpdateTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transfer> }) =>
      apiService.updateTransfer(id, data),
    onSuccess: (updatedTransfer) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers });
      queryClient.setQueryData(
        queryKeys.transfer(updatedTransfer.id),
        updatedTransfer
      );
    },
  });
}

export function useDeleteTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.deleteTransfer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transfers });
    },
  });
}

// Dashboard
export function useDashboardStats(userId: string) {
  return useQuery({
    queryKey: queryKeys.dashboardStats(userId),
    queryFn: () => apiService.getDashboardStats(userId),
    enabled: !!userId,
  });
}
