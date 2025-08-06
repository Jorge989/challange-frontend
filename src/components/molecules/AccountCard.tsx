import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { formatCurrency, formatAccountNumber } from "@/utils";
import { ACCOUNT_TYPES } from "@/constants";
import type { Account } from "@/types";

interface AccountCardProps {
  account: Account;
  showBalance?: boolean;
  onToggleBalance?: () => void;
  onViewDetails?: () => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  showBalance = true,
  onToggleBalance,
  onViewDetails,
}) => {
  const getAccountTypeColor = (type: Account["type"]) => {
    switch (type) {
      case "checking":
        return "bg-blue-100 text-blue-800";
      case "savings":
        return "bg-green-100 text-green-800";
      case "investment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className={getAccountTypeColor(account.type)}>
              {ACCOUNT_TYPES[account.type]}
            </Badge>
            {!account.isActive && <Badge variant="secondary">Inativa</Badge>}
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Conta</p>
            <p className="font-mono text-sm text-gray-900">
              {formatAccountNumber(account.accountNumber)}
            </p>
            <p className="text-xs text-gray-500">Agência {account.agency}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Saldo disponível</p>
              <p className="text-2xl font-bold text-gray-900">
                {showBalance ? formatCurrency(account.balance) : "••••••"}
              </p>
            </div>
            {onToggleBalance && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBalance}
                className="ml-2"
              >
                {showBalance ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>

          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="w-full"
            >
              Ver detalhes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountCard;
