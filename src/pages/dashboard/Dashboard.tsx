import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/molecules/StatsCard";
import { AccountCard } from "@/components/molecules/AccountCard";
import { TransactionItem } from "@/components/molecules/TransactionItem";
import { NewTransactionModal } from "@/components/organisms/NewTransactionModal";
import { useSearchStore } from "@/store/useSearchStore";
import {
  useAccountsByUserId,
  useTransactions,
  useDashboardStats,
} from "@/hooks/useApi";
import { formatCurrency } from "@/utils";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import type { Transaction } from "@/types";

const Dashboard: React.FC = () => {
  const [balanceVisibility, setBalanceVisibility] = useState<
    Record<string, boolean>
  >({});
  const { query, selectedTransaction, setSelectedTransaction } =
    useSearchStore();

  const userId = "user-1";

  const {
    data: accounts = [],
    isLoading: accountsLoading,
    refetch: refetchAccounts,
  } = useAccountsByUserId(userId);

  useEffect(() => {
    if (accounts.length > 0) {
      const initialVisibility = accounts.reduce((acc, account) => {
        acc[account.id] = true;
        return acc;
      }, {} as Record<string, boolean>);
      setBalanceVisibility(initialVisibility);
    }
  }, [accounts]);
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    refetch: refetchTransactions,
  } = useTransactions();
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
  } = useDashboardStats(userId);

  const handleTransactionSuccess = () => {
    refetchAccounts();
    refetchTransactions();
    refetchStats();
  };

  const toggleAccountBalance = (accountId: string) => {
    setBalanceVisibility((prev) => ({
      ...prev,
      [accountId]: !prev[accountId],
    }));
  };

  const recentTransactions = transactions
    .filter(
      (transaction) =>
        accounts.some((account) => account.id === transaction.accountId) &&
        (transaction.description.toLowerCase().includes(query.toLowerCase()) ||
          transaction.category.toLowerCase().includes(query.toLowerCase()) ||
          transaction.type.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (accountsLoading || transactionsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo de volta! Aqui está um resumo das suas finanças.
          </p>
        </div>
        <div className="flex space-x-3">
          <NewTransactionModal onSuccess={handleTransactionSuccess} />
          <Button variant="outline">
            <ArrowUpRight className="w-4 h-4 mr-2" />
            Transferir
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Saldo Total"
          value={formatCurrency(stats?.totalBalance || 0)}
          change="+2.5% este mês"
          changeType="positive"
          icon={Wallet}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Receitas do Mês"
          value={formatCurrency(stats?.monthlyIncome || 0)}
          change="+12.3% vs mês anterior"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatsCard
          title="Gastos do Mês"
          value={formatCurrency(stats?.monthlyExpenses || 0)}
          change="-5.2% vs mês anterior"
          changeType="positive"
          icon={TrendingDown}
          iconColor="text-red-600"
        />
        <StatsCard
          title="Transações"
          value={stats?.transactionCount.toString() || "0"}
          change="15 este mês"
          changeType="neutral"
          icon={Activity}
          iconColor="text-purple-600"
        />
      </div>

      {/* Contas e Transações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Minhas Contas</span>
                <Button variant="ghost" size="sm">
                  Ver todas
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {accounts.slice(0, 3).map((account) => (
                <AccountCard
                  key={account.id}
                  account={account}
                  showBalance={!!balanceVisibility[account.id]}
                  onToggleBalance={() => toggleAccountBalance(account.id)}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Transações */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transações Recentes</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTransaction(null)}
                >
                  {selectedTransaction ? "Limpar filtro" : "Ver todas"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {selectedTransaction ? (
                <div className="divide-y divide-gray-100">
                  <TransactionItem transaction={selectedTransaction} />
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {recentTransactions.map((transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Nenhuma transação encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ArrowUpRight className="w-6 h-6" />
              <span className="text-sm">Transferir</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ArrowDownLeft className="w-6 h-6" />
              <span className="text-sm">Receber</span>
            </Button>
            <NewTransactionModal onSuccess={handleTransactionSuccess}>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <TrendingUp className="w-6 h-6" />
                <span className="text-sm">Nova Transação</span>
              </Button>
            </NewTransactionModal>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="w-6 h-6" />
              <span className="text-sm">Investir</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
