import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils";
import { ROUTES } from "@/constants";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  TrendingUp,
  BarChart3,
  Settings,
  Building2,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    name: "Contas",
    href: ROUTES.ACCOUNTS,
    icon: CreditCard,
  },
  {
    name: "Transações",
    href: ROUTES.TRANSACTIONS,
    icon: ArrowLeftRight,
  },
  {
    name: "Transferências",
    href: ROUTES.TRANSFERS,
    icon: TrendingUp,
  },
  {
    name: "Relatórios",
    href: ROUTES.REPORTS,
    icon: BarChart3,
  },
  {
    name: "Configurações",
    href: ROUTES.SETTINGS,
    icon: Settings,
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">OpenBank</h1>
            <p className="text-sm text-gray-500">Sistema Bancário</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-blue-600" : "text-gray-400"
                )}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">JA</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Jorge Attie
            </p>
            <p className="text-xs text-gray-500 truncate">
              jorge.attie@email.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
