import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatCurrency } from "@/utils";

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#AA336A"];

const Reports: React.FC = () => {
  const userId = "user-1";

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats", userId],
    queryFn: () => apiService.getDashboardStats(userId),
  });

  const { data: transactions = [], isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiService.getTransactions(),
  });

  const [monthlyData, setMonthlyData] = useState<
    { month: string; income: number; expense: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    if (transactions.length === 0) return;

    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const catMap: Record<string, number> = {};

    const months = Array.from({ length: 6 })
      .map((_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        return {
          month: d.toLocaleDateString("pt-BR", {
            month: "short",
            year: "numeric",
          }),
          income: 0,
          expense: 0,
          year: d.getFullYear(),
          monthIndex: d.getMonth(),
        };
      })
      .reverse();

    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      if (tDate < sixMonthsAgo) return;

      const monthEntry = months.find(
        (m) =>
          m.year === tDate.getFullYear() && m.monthIndex === tDate.getMonth()
      );
      if (!monthEntry) return;

      if (t.type === "credit") {
        monthEntry.income += t.amount;
      } else {
        monthEntry.expense += t.amount;
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      }
    });

    setMonthlyData(
      months.map(({ month, income, expense }) => ({ month, income, expense }))
    );

    const catArr = Object.entries(catMap).map(([name, value]) => ({
      name,
      value,
    }));
    setCategoryData(catArr);
  }, [transactions]);

  if (statsLoading || transactionsLoading) {
    return <div className="p-8">Carregando relatórios...</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Relatórios Financeiros
      </h1>

      {/* Resumo Financeiro: grid responsivo */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold">Saldo Total</h2>
            <p className="text-2xl">
              {formatCurrency(stats?.totalBalance || 0)}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold">Receita Mensal</h2>
            <p className="text-2xl">
              {formatCurrency(stats?.monthlyIncome || 0)}
            </p>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-semibold">Despesa Mensal</h2>
            <p className="text-2xl">
              {formatCurrency(stats?.monthlyExpenses || 0)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico Receita x Despesa */}
      <Card>
        <CardHeader>
          <CardTitle>Receita x Despesa (Últimos 6 meses)</CardTitle>
        </CardHeader>
        <CardContent className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#22c55e"
                name="Receita"
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#ef4444"
                name="Despesa"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Pizza Distribuição por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Despesas por Categoria</CardTitle>
        </CardHeader>
        <CardContent className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius="80%"
                fill="#8884d8"
                label={(entry) => entry.name}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
