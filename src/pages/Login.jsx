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
        const destination = result.user?.role === "admin" ? "/AdminDashboard" : "/Home";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            ChegouAí
          </CardTitle>
          <CardDescription className="text-gray-500">
            Seu pedido ChegouAí! Entre com suas credenciais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-900">
            <p className="font-medium">Informe o código da empresa (ex: PAD001) para ativar o schema correto.</p>
          </div>
          {errorMessage && (
            <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyCode">Código da empresa</Label>
              <Input
                id="companyCode"
                type="text"
                placeholder="PAD001"
                value={form.companyCode}
                onChange={(e) => handleChange("companyCode", e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                    className="h-11 pr-10"
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

              <div className="flex items-center justify-between text-sm">
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Register Link */}
      <Card className="border-0 shadow-lg mt-4">
        <CardContent className="pt-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">
              Não tem uma conta?
            </p>
            <Link to="/Register">
              <Button variant="outline" className="w-full h-11">
                <UserPlus className="w-4 h-4 mr-2" />
                Cadastre-se
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
