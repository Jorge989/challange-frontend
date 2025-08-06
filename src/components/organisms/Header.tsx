import React, { useState, useEffect } from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchStore } from "@/store/useSearchStore";
import { useLocation } from "react-router-dom";
import { ROUTES } from "@/constants";

export const Header: React.FC = () => {
  const [search, setSearch] = useState("");
  const { setQuery, setSelectedTransaction } = useSearchStore();
  const location = useLocation();

  const isOnAccountsPage = location.pathname === ROUTES.ACCOUNTS;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmed = search.trim();

      setQuery(trimmed);

      if (trimmed.length === 0) {
        setSelectedTransaction(null);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, setQuery, setSelectedTransaction]);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar transações, contas..."
              className="pl-10 pr-4 py-2 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              disabled={isOnAccountsPage}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>
          <Button variant="ghost" size="sm">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
