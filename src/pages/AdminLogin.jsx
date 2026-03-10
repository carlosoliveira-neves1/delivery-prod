import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

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

      let result;
      if (service.useApi) {
        const { api } = await import('@/lib/apiClient.js');
        result = await api.globalLogin({ email: form.email, password: form.password });
      } else {
        // Fallback localStorage: criar usuário admin global se não existir
        result = await service.loginUser(form.email, form.password, 'GLOBAL_ADMIN');
      }

      if (result.success) {
        navigate('/AdminCompanies');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
            <Shield className="h-6 w-6 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl">Acesso Admin</CardTitle>
          <CardDescription>
            Entre para gerenciar empresas globais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="admin@global.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            {errorMessage && (
              <p className="text-sm text-red-600 text-center">{errorMessage}</p>
            )}
          </form>
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Use o admin de uma empresa ou crie uma nova empresa após o login.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
