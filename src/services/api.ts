// Serviço para consumir a API Open Banking
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "@/constants";
import type {
  User,
  Account,
  Transaction,
  Transfer,
  ApiResponse,
  PaginatedResponse,
  CreateTransactionRequest,
  CreateTransferRequest,
  UpdateAccountRequest,
  DashboardStats,
} from "@/types";

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Usuários
  async getUsers(): Promise<User[]> {
    return this.request<User[]>("/users");
  }

  async getUser(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Contas

  createAccount(accountData: Omit<Account, "id">): Promise<Account> {
    return this.request<Account>("/accounts", {
      method: "POST",
      body: JSON.stringify(accountData),
    });
  }

  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>("/accounts");
  }

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    return this.request<Account[]>(`/accounts?userId=${userId}`);
  }

  async getAccount(id: string): Promise<Account> {
    return this.request<Account>(`/accounts/${id}`);
  }

  async updateAccount(
    id: string,
    data: UpdateAccountRequest
  ): Promise<Account> {
    return this.request<Account>(`/accounts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  // Transações
  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>("/transactions");
  }

  async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(`/transactions?accountId=${accountId}`);
  }

  async getTransaction(id: string): Promise<Transaction> {
    return this.request<Transaction>(`/transactions/${id}`);
  }

  async createTransaction(
    data: CreateTransactionRequest
  ): Promise<Transaction> {
    const transaction: Omit<Transaction, "id"> = {
      ...data,
      date: new Date().toISOString(),
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    const created = await this.request<Transaction>("/transactions", {
      method: "POST",
      body: JSON.stringify(transaction),
    });

    // Atualiza o saldo da conta envolvida
    const account = await this.getAccount(data.accountId);
    const updatedBalance =
      data.type === "credit"
        ? account.balance + data.amount
        : account.balance - data.amount;

    await this.updateAccount(data.accountId, { balance: updatedBalance });

    return created;
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.request<void>(`/transactions/${id}`, {
      method: "DELETE",
    });
  }

  // Transferências
  async getTransfers(): Promise<Transfer[]> {
    return this.request<Transfer[]>("/transfers");
  }

  async getTransfersByAccountId(accountId: string): Promise<Transfer[]> {
    const transfers = await this.request<Transfer[]>("/transfers");
    return transfers.filter(
      (transfer) =>
        transfer.fromAccountId === accountId ||
        transfer.toAccountId === accountId
    );
  }

  async getTransfer(id: string): Promise<Transfer> {
    return this.request<Transfer>(`/transfers/${id}`);
  }

  async createTransfer(data: CreateTransferRequest): Promise<Transfer> {
    const transfer: Omit<Transfer, "id"> = {
      ...data,
      status: "pending",
      scheduledDate: data.scheduledDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return this.request<Transfer>("/transfers", {
      method: "POST",
      body: JSON.stringify(transfer),
    });
  }

  async updateTransfer(id: string, data: Partial<Transfer>): Promise<Transfer> {
    return this.request<Transfer>(`/transfers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async deleteTransfer(id: string): Promise<void> {
    return this.request<void>(`/transfers/${id}`, {
      method: "DELETE",
    });
  }

  // Dashboard Stats
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const [accounts, transactions] = await Promise.all([
      this.getAccountsByUserId(userId),
      this.getTransactions(),
    ]);

    const userTransactions = transactions.filter((transaction) =>
      accounts.some((account) => account.id === transaction.accountId)
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = userTransactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const monthlyIncome = monthlyTransactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalBalance = accounts.reduce(
      (sum, account) => sum + account.balance,
      0
    );

    return {
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      transactionCount: userTransactions.length,
      accountsCount: accounts.length,
    };
  }

  async searchTransactions(query: string): Promise<Transaction[]> {
    return this.request<Transaction[]>(
      `/transactions?q=${encodeURIComponent(query)}`
    );
  }
}

export const apiService = new ApiService();
export default apiService;
