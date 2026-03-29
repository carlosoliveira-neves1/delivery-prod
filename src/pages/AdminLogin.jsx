import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import DelivreLogo from '@/components/DelivreLogo';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { getUserService } = await import('@/lib/userService');
      const service = getUserService();

      // Usar sempre localStorage (sem API)
      const result = await service.loginUser(form.email, form.password, 'GLOBAL_ADMIN');

      if (result.success) {
        const destination = result.user?.role === 'super_admin' ? '/SuperAdmin' : '/AdminCompanies';
        navigate(destination);
      } else {
        setErrorMessage(result.error || 'Falha na autenticação');
      }
    } catch (error) {
      console.error('Erro no login admin:', error);
      setErrorMessage('Erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-4 sm:pb-6">
          <div className="mx-auto mb-3 sm:mb-4 flex items-center justify-center gap-3">
            <DelivreLogo className="w-10 h-10 sm:w-12 sm:h-12" />
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-gray-900">Delivre</div>
              <p className="text-xs sm:text-sm text-gray-500 mt-0">Seu delivery livre de taxas</p>
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4">
            Admin
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-500">
            Painel de administração
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs sm:text-sm text-blue-900">
            <p className="font-medium mb-2">📋 Credenciais de Teste:</p>
            <p className="text-xs sm:text-sm"><strong>Email:</strong> admin@delivery.com</p>
            <p className="text-xs sm:text-sm"><strong>Senha:</strong> teste12345678</p>
          </div>
          {errorMessage && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded-md">
              {errorMessage}
            </div>
          )}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="admin@global.com"
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base">Senha</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                required
                className="h-10 sm:h-11 text-sm sm:text-base"
              />
            </div>
            <Button type="submit" className="w-full h-10 sm:h-11 text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            {errorMessage && (
              <p className="text-xs sm:text-sm text-red-600 text-center bg-red-50 border border-red-100 px-3 py-2 rounded-md">
                {errorMessage}
              </p>
            )}
          </form>
          <div className="pt-2 border-t border-gray-200 text-center text-xs sm:text-sm text-gray-500">
            <p>Use o admin de uma empresa ou crie uma nova empresa após o login.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
