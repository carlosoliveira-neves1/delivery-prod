import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useAuth } from "@/lib/AuthContext";
import {
  ShoppingBag,
  Settings,
  Package,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ShieldAlert,
  DollarSign,
  Plus,
  BarChart3,
  Gift,
} from "lucide-react";

const adminPages = [
  { name: "AdminDashboard", label: "Pedidos", icon: ShoppingBag },
  { name: "AdminProducts", label: "Cardápio", icon: Package },
  { name: "AdminProductManagement", label: "Produtos", icon: Plus },
  { name: "AdminPricingTables", label: "Preços", icon: DollarSign },
  { name: "AdminReports", label: "Relatórios", icon: BarChart3 },
  { name: "AdminUsers", label: "Usuários", icon: ShieldAlert },
  { name: "Fidelidade", label: "Fidelidade", icon: Gift },
  { name: "AdminIntegrations", label: "Integrações", icon: LayoutDashboard },
  { name: "AdminSettings", label: "Configurações", icon: Settings },
];

export default function Layout({ children, currentPageName }) {
  const { user, login, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdminPage = currentPageName?.startsWith("Admin");
  const isAdmin = user?.role === "admin";

  // Public pages (customer-facing) - no layout chrome
  if (!isAdminPage) {
    return <>{children}</>;
  }

  // Admin pages - show sidebar nav
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Acesso restrito</h1>
          <p className="text-gray-500 mt-2">
            Esta área é exclusiva para administradores. Faça login como administrador para continuar.
          </p>
          <Link to={createPageUrl("Home")} className="text-blue-600 hover:underline text-sm mt-4 inline-block">
            Voltar ao cardápio
          </Link>
          <div className="mt-4">
            <button
              onClick={() => login("admin")}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              Entrar como admin demo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-bold text-sm">Admin</span>
        <Link to={createPageUrl("Home")} className="text-xs text-gray-500 hover:text-gray-700">
          Ver loja →
        </Link>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 bg-white shadow-xl flex flex-col">
            <div className="p-4 flex items-center justify-between border-b border-gray-100">
              <span className="font-bold">Menu</span>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {adminPages.map((page) => {
                const isActive = currentPageName === page.name;
                return (
                  <Link
                    key={page.name}
                    to={createPageUrl(page.name)}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <page.icon className="w-4 h-4" />
                    {page.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={logout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-56 flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-30">
          <div className="p-5 border-b border-gray-100">
            <h1 className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">ChegouAí</h1>
            <p className="text-xs text-gray-500 mt-1">Painel Admin</p>
          </div>
          <nav className="flex-1 p-3 space-y-1">
            {adminPages.map((page) => {
              const isActive = currentPageName === page.name;
              return (
                <Link
                  key={page.name}
                  to={createPageUrl(page.name)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <page.icon className="w-4 h-4" />
                  {page.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-3 border-t border-gray-100 space-y-1">
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Ver loja
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-56">
          {children}
        </main>
      </div>
    </div>
  );
}