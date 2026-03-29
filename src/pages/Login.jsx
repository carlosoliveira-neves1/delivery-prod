import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, LogIn, UserPlus, ShoppingBag } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: ""
    ,
    companyCode: ""
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();
  
  const { login } = useAuth();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await login({
        email: form.email,
        password: form.password,
        companyCode: form.companyCode
      });

      if (result.success) {
        const role = result.user?.role;
        let destination = '/Home';

        if (role === 'super_admin') {
          destination = '/SuperAdmin';
        } else if (role === 'admin' || role === 'admin_imutavel') {
          destination = '/AdminDashboard';
        }

        navigate(destination);
      } else {
        setErrorMessage(result.error || "Não foi possível autenticar.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      setErrorMessage("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-4 sm:pb-6">
          <div className="mx-auto mb-3 sm:mb-4">
            <div className="text-4xl sm:text-5xl font-bold text-gray-900">Delivre</div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Seu delivery livre de taxas</p>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
            Login
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-500">
            Entre com suas credenciais para acessar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-xs sm:text-sm text-emerald-900">
            <p className="font-medium">Informe o código da empresa (ex: PAD001) para ativar o schema correto.</p>
          </div>
          {errorMessage && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyCode" className="text-sm sm:text-base">Código da empresa</Label>
              <Input
                id="companyCode"
                type="text"
                placeholder="PAD001"
                value={form.companyCode}
                onChange={(e) => handleChange("companyCode", e.target.value)}
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  required
                  className="h-10 sm:h-11 pr-10 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 sm:h-11 text-sm sm:text-base bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-gray-200">
            <Link to="/Register" className="text-green-600 hover:text-green-700 font-medium">
              Cadastre-se
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
