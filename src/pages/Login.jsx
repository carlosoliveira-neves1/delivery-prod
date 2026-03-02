import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  });
  
  const { login } = useAuth();

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Credenciais de teste
      if (form.email === "admin@teste.com" && form.password === "123456") {
        await login("admin");
        window.location.href = "/AdminDashboard";
      } else if (form.email === "cliente@teste.com" && form.password === "123456") {
        await login("user");
        window.location.href = "/Home";
      } else {
        alert("Credenciais inválidas. Use:\nAdmin: admin@teste.com / 123456\nCliente: cliente@teste.com / 123456");
      }
    } catch (error) {
      console.error("Erro no login:", error);
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
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <p className="font-medium text-blue-900 mb-1">Credenciais de teste:</p>
            <p className="text-blue-700">👨‍💼 Admin: admin@teste.com / 123456</p>
            <p className="text-blue-700">👤 Cliente: cliente@teste.com / 123456</p>
          </div>
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
