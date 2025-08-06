import { describe, it, expect, vi, beforeEach } from "vitest";
import apiService from "./api";

global.fetch = vi.fn();

describe("ApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should make a GET request to fetch users", async () => {
    const mockUsers = [{ id: "u1", name: "User One" }];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUsers,
    });

    const users = await apiService.getUsers();

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/users",
      expect.objectContaining({
        method: undefined,
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
    expect(users).toEqual(mockUsers);
  });

  it("should throw error when fetch fails", async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    await expect(apiService.getUsers()).rejects.toThrow(
      "HTTP error! status: 500"
    );
  });

  it("should create a transaction and update account balance", async () => {
    const createData = {
      accountId: "acc1",
      amount: 100,
      type: "credit",
      category: "salary",
    };

    const mockTransaction = {
      id: "tx1",
      ...createData,
      date: new Date().toISOString(),
      status: "completed",
      createdAt: new Date().toISOString(),
    };
    const mockAccount = { id: "acc1", balance: 200 };

    (fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTransaction,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockAccount,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockAccount, balance: 300 }),
      });

    const created = await apiService.createTransaction(createData);

    expect(created).toEqual(mockTransaction);
    expect(fetch).toHaveBeenCalledTimes(3);

    expect(fetch).toHaveBeenNthCalledWith(
      1,
      "http://localhost:3000/transactions",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining(`"accountId":"${createData.accountId}"`),
      })
    );

    expect(fetch).toHaveBeenNthCalledWith(
      2,
      "http://localhost:3000/accounts/acc1",
      expect.objectContaining({ method: undefined })
    );

    expect(fetch).toHaveBeenNthCalledWith(
      3,
      "http://localhost:3000/accounts/acc1",
      expect.objectContaining({
        method: "PATCH",
        body: expect.stringContaining(`"balance":300`),
      })
    );
  });

  it("should get dashboard stats and calculate totals", async () => {
    const userId = "user123";
    const mockAccounts = [
      { id: "acc1", userId, balance: 100 },
      { id: "acc2", userId, balance: 200 },
    ];
    const mockTransactions = [
      {
        id: "t1",
        accountId: "acc1",
        amount: 50,
        type: "credit",
        date: new Date().toISOString(),
      },
      {
        id: "t2",
        accountId: "acc2",
        amount: 20,
        type: "debit",
        date: new Date().toISOString(),
      },
      {
        id: "t3",
        accountId: "other",
        amount: 999,
        type: "credit",
        date: new Date().toISOString(),
      },
    ];

    (fetch as any)
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockAccounts),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockTransactions),
        })
      );

    const stats = await apiService.getDashboardStats(userId);

    expect(stats.accountsCount).toBe(2);
    expect(stats.totalBalance).toBe(300);
    expect(stats.transactionCount).toBe(2);
    expect(stats.monthlyIncome).toBe(50);
    expect(stats.monthlyExpenses).toBe(20);
  });
});
