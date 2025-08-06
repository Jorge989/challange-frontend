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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Loader2 } from "lucide-react";
import type { Account } from "@/types";

import { useCreateAccount } from "@/hooks/useApi"; // importa o hook customizado

interface NewAccountModalProps {
  onSuccess?: () => void;
}

const NewAccountModal: React.FC<NewAccountModalProps> = ({ onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: "checking" as Account["type"],
    accountNumber: "",
    agency: "",
    balance: "",
    currency: "BRL",
    isActive: true,
  });

  const userId = "user-1";

  const createAccountMutation = useCreateAccount(() => {
    setFormData({
      type: "checking",
      accountNumber: "",
      agency: "",
      balance: "",
      currency: "BRL",
      isActive: true,
    });
    setOpen(false);
    onSuccess?.();
  });

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Omit<Account, "id"> = {
      userId,
      type: formData.type,
      accountNumber: formData.accountNumber,
      agency: formData.agency,
      balance: parseFloat(formData.balance),
      currency: formData.currency,
      isActive: formData.isActive,
    };

    try {
      await createAccountMutation.mutateAsync(payload);
    } catch (error) {
      console.error("Erro ao criar conta:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nova Conta
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Conta</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Conta */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Corrente</SelectItem>
                <SelectItem value="savings">Poupança</SelectItem>
                <SelectItem value="investment">Investimento</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Número da Conta */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Número da Conta</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              required
            />
          </div>

          {/* Agência */}
          <div className="space-y-2">
            <Label htmlFor="agency">Agência</Label>
            <Input
              id="agency"
              value={formData.agency}
              onChange={(e) => handleChange("agency", e.target.value)}
              required
            />
          </div>

          {/* Saldo Inicial */}
          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Inicial</Label>
            <Input
              id="balance"
              type="number"
              min="0"
              step="0.01"
              value={formData.balance}
              onChange={(e) => handleChange("balance", e.target.value)}
              required
            />
          </div>

          {/* Moeda */}
          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Input
              id="currency"
              value={formData.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              required
            />
          </div>

          {/* Ativa/Inativa */}
          <div className="flex items-center justify-between">
            <Label>Conta Ativa</Label>
            <Switch
              checked={formData.isActive}
              onCheckedChange={(value) => handleChange("isActive", value)}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createAccountMutation.isLoading}>
              {createAccountMutation.isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAccountModal;
