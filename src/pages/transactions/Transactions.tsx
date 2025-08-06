import React from "react";
import { useQuery } from "@tanstack/react-query";
import apiService from "@/services/api";
import { useSearchStore } from "@/store/useSearchStore";

import {
  Banknote,
  ShoppingCart,
  Car,
  Utensils,
  PiggyBank,
  Heart,
  GraduationCap,
  TrendingUp,
  ArrowLeftRight,
  MoreHorizontal,
} from "lucide-react";

import {
  CURRENCY_FORMAT,
  DATE_FORMAT,
  TRANSACTION_CATEGORIES,
} from "@/constants";

const categoryIcons: Record<string, React.ReactNode> = {
  food: <Utensils className="text-orange-500 w-5 h-5" />,
  transport: <Car className="text-yellow-500 w-5 h-5" />,
  shopping: <ShoppingCart className="text-pink-500 w-5 h-5" />,
  bills: <Banknote className="text-blue-500 w-5 h-5" />,
  entertainment: <MoreHorizontal className="text-purple-500 w-5 h-5" />,
  health: <Heart className="text-red-500 w-5 h-5" />,
  education: <GraduationCap className="text-green-500 w-5 h-5" />,
  investment: <TrendingUp className="text-teal-500 w-5 h-5" />,
  salary: <PiggyBank className="text-green-600 w-5 h-5" />,
  transfer: <ArrowLeftRight className="text-gray-500 w-5 h-5" />,
  other: <MoreHorizontal className="text-gray-400 w-5 h-5" />,
};

const Transactions: React.FC = () => {
  const { query } = useSearchStore();

  const {
    data: transactions = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => apiService.getTransactions(),
  });

  if (isLoading) return <div className="p-8">Carregando transações...</div>;
  if (isError)
    return (
      <div className="p-8 text-red-600">
        Erro ao carregar transações: {(error as Error).message}
      </div>
    );

  // Filtra o array com base na query (case insensitive)
  const filteredTransactions = transactions.filter((txn) => {
    const q = query.trim().toLowerCase();
    if (!q) return true; // se vazio, mostra todos

    return (
      txn.description?.toLowerCase().includes(q) ||
      txn.title?.toLowerCase().includes(q) ||
      TRANSACTION_CATEGORIES[txn.category]?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Todas as Transações
      </h1>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4">Título</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Data</th>
              <th className="px-6 py-4 text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr
                key={txn.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 flex items-center gap-2">
                  {categoryIcons[txn.category] || categoryIcons.other}
                  <span>{TRANSACTION_CATEGORIES[txn.category]}</span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {txn.description || txn.title}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      txn.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : txn.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {txn.status === "completed"
                      ? "Concluída"
                      : txn.status === "pending"
                      ? "Pendente"
                      : "Falhou"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {DATE_FORMAT.format(new Date(txn.date))}
                </td>
                <td
                  className={`px-6 py-4 text-right font-semibold ${
                    txn.type === "income" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {txn.type === "income" ? "+" : "-"}{" "}
                  {CURRENCY_FORMAT.format(txn.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
