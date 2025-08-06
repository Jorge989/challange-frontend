import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAccountsByUserId, useCreateTransaction } from "@/hooks/useApi";
import { formatCurrency } from "@/utils";
import { TRANSACTION_CATEGORIES } from "@/constants";
import { Plus, Loader2 } from "lucide-react";
import type { Transaction, Account } from "@/types";

interface NewTransactionModalProps {
  onSuccess?: () => void;
}

export const NewTransactionModal: React.FC<NewTransactionModalProps> = ({
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountId: "",
    type: "debit" as Transaction["type"],
    amount: "",
    description: "",
    category: "food" as Transaction["category"],
    reference: "",
  });

  const userId = "user-1";
  const { data: accounts = [] } = useAccountsByUserId(userId);
  const createTransactionMutation = useCreateTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.accountId || !formData.amount || !formData.description) {
      return;
    }

    const transactionData: Omit<Transaction, "id" | "date"> = {
      accountId: formData.accountId,
      type: formData.type,
      amount: parseFloat(formData.amount),
      description: formData.description,
      category: formData.category,
      status: "completed",
      reference: formData.reference || undefined,
    };

    try {
      await createTransactionMutation.mutateAsync(transactionData);

      // Reset form
      setFormData({
        accountId: "",
        type: "debit",
        amount: "",
        description: "",
        category: "food",
        reference: "",
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao criar transação:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedAccount = accounts.find(
    (account) => account.id === formData.accountId
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Transação
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Conta */}
          <div className="space-y-2">
            <Label htmlFor="account">Conta</Label>
            <Select
              value={formData.accountId}
              onValueChange={(value) => handleInputChange("accountId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{account.accountNumber}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedAccount && (
              <div className="text-sm text-gray-600">
                Saldo disponível: {formatCurrency(selectedAccount.balance)}
              </div>
            )}
          </div>

          {/* Tipo de Transação */}
          <div className="space-y-2">
            <Label>Tipo de Transação</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={formData.type === "debit" ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange("type", "debit")}
              >
                Débito
              </Button>
              <Button
                type="button"
                variant={formData.type === "credit" ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange("type", "credit")}
              >
                Crédito
              </Button>
            </div>
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Compra no supermercado"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              required
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TRANSACTION_CATEGORIES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Referência (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="reference">Referência (opcional)</Label>
            <Input
              id="reference"
              placeholder="Ex: Nota fiscal, código de referência"
              value={formData.reference}
              onChange={(e) => handleInputChange("reference", e.target.value)}
            />
          </div>

          {/* Preview */}
          {formData.amount && formData.description && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Preview da Transação</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tipo:</span>
                  <Badge
                    variant={
                      formData.type === "credit" ? "default" : "secondary"
                    }
                  >
                    {formData.type === "credit" ? "Crédito" : "Débito"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span
                    className={
                      formData.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {formData.type === "credit" ? "+" : "-"}
                    {formatCurrency(parseFloat(formData.amount) || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Categoria:</span>
                  <span>
                    {
                      TRANSACTION_CATEGORIES[
                        formData.category as keyof typeof TRANSACTION_CATEGORIES
                      ]
                    }
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                createTransactionMutation.isPending ||
                !formData.accountId ||
                !formData.amount ||
                !formData.description
              }
            >
              {createTransactionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Transação"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewTransactionModal;
