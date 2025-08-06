import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AccountCard } from "@/components/molecules/AccountCard";
import { useAccountsByUserId } from "@/hooks/useApi";
import { formatCurrency, formatAccountNumber } from "@/utils";
import { ACCOUNT_TYPES } from "@/constants";
import NewAccountModal from "@/components/organisms/NewAccountModal";
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  CreditCard,
  PiggyBank,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import type { Account } from "@/types";

const Accounts: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<Account["type"] | "all">("all");
  const userId = "user-1";

  const {
    data: accounts = [],
    isLoading,
    refetch,
  } = useAccountsByUserId(userId);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch =
      account.accountNumber.includes(searchTerm) ||
      ACCOUNT_TYPES[account.type]
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || account.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );
  const activeAccounts = accounts.filter((account) => account.isActive).length;

  const getAccountIcon = (type: Account["type"]) => {
    switch (type) {
      case "checking":
        return CreditCard;
      case "savings":
        return PiggyBank;
      case "investment":
        return TrendingUp;
      default:
        return CreditCard;
    }
  };

  const getAccountColor = (type: Account["type"]) => {
    switch (type) {
      case "checking":
        return "text-blue-600 bg-blue-100";
      case "savings":
        return "text-green-600 bg-green-100";
      case "investment":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Minhas Contas</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todas as suas contas bancárias em um só lugar.
          </p>
        </div>
        <NewAccountModal onSuccess={refetch} />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saldo Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {showBalance ? formatCurrency(totalBalance) : "••••••"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Contas Ativas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeAccounts}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total de Contas
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {accounts.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por número da conta ou tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                Todas
              </Button>
              <Button
                variant={filterType === "checking" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("checking")}
              >
                Corrente
              </Button>
              <Button
                variant={filterType === "savings" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("savings")}
              >
                Poupança
              </Button>
              <Button
                variant={filterType === "investment" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("investment")}
              >
                Investimento
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => {
          const Icon = getAccountIcon(account.type);

          return (
            <Card
              key={account.id}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${getAccountColor(
                        account.type
                      )}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {ACCOUNT_TYPES[account.type]}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {formatAccountNumber(account.accountNumber)}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Agência</p>
                    <p className="font-mono text-sm text-gray-900">
                      {account.agency}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Saldo disponível
                    </p>
                    <p className="text-xl font-bold text-gray-900">
                      {showBalance ? formatCurrency(account.balance) : "••••••"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant={account.isActive ? "default" : "secondary"}>
                      {account.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                    <p className="text-xs text-gray-500">{account.currency}</p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Extrato
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Transferir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAccounts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma conta encontrada
            </h3>
            <p className="text-gray-600 mb-4">
              Não encontramos contas que correspondam aos seus critérios de
              busca.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
            >
              Limpar filtros
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Accounts;
