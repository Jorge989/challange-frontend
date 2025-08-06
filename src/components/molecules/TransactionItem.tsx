import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDateTime } from '@/utils';
import { TRANSACTION_CATEGORIES, TRANSACTION_STATUS } from '@/constants';
import { cn } from '@/utils';
import type { Transaction } from '@/types';
import {
  ShoppingCart,
  Car,
  Utensils,
  Gamepad2,
  Heart,
  GraduationCap,
  TrendingUp,
  Banknote,
  ArrowLeftRight,
  MoreHorizontal,
} from 'lucide-react';

interface TransactionItemProps {
  transaction: Transaction;
  showAccount?: boolean;
  className?: string;
}

const getCategoryIcon = (category: Transaction['category']) => {
  switch (category) {
    case 'food':
      return Utensils;
    case 'transport':
      return Car;
    case 'shopping':
      return ShoppingCart;
    case 'entertainment':
      return Gamepad2;
    case 'health':
      return Heart;
    case 'education':
      return GraduationCap;
    case 'investment':
      return TrendingUp;
    case 'salary':
      return Banknote;
    case 'transfer':
      return ArrowLeftRight;
    default:
      return MoreHorizontal;
  }
};

const getCategoryColor = (category: Transaction['category']) => {
  switch (category) {
    case 'food':
      return 'text-orange-600 bg-orange-100';
    case 'transport':
      return 'text-blue-600 bg-blue-100';
    case 'shopping':
      return 'text-purple-600 bg-purple-100';
    case 'entertainment':
      return 'text-pink-600 bg-pink-100';
    case 'health':
      return 'text-red-600 bg-red-100';
    case 'education':
      return 'text-indigo-600 bg-indigo-100';
    case 'investment':
      return 'text-green-600 bg-green-100';
    case 'salary':
      return 'text-emerald-600 bg-emerald-100';
    case 'transfer':
      return 'text-gray-600 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

const getStatusColor = (status: Transaction['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  showAccount = false,
  className,
}) => {
  const Icon = getCategoryIcon(transaction.category);
  const isCredit = transaction.type === 'credit';

  return (
    <div className={cn(
      'flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-150',
      className
    )}>
      {/* Icon and Info */}
      <div className="flex items-center space-x-4">
        <div className={cn(
          'w-10 h-10 rounded-lg flex items-center justify-center',
          getCategoryColor(transaction.category)
        )}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {transaction.description}
            </p>
            <Badge className={getStatusColor(transaction.status)}>
              {TRANSACTION_STATUS[transaction.status]}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-xs text-gray-500">
              {TRANSACTION_CATEGORIES[transaction.category]}
            </p>
            <span className="text-xs text-gray-400">•</span>
            <p className="text-xs text-gray-500">
              {formatDateTime(transaction.date)}
            </p>
            {transaction.reference && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-gray-500 font-mono">
                  {transaction.reference}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p className={cn(
          'text-sm font-semibold',
          isCredit ? 'text-green-600' : 'text-red-600'
        )}>
          {isCredit ? '+' : '-'}{formatCurrency(transaction.amount)}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;

