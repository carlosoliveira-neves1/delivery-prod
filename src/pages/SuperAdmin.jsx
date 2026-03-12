import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Eye, Users } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function SuperAdmin() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    try {
      const { api } = await import('@/lib/apiClient.js');
      const list = await api.listCompanies();
      setCompanies(list);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function accessAsCompany(company) {
    // Login temporário como admin imutável da empresa
    try {
      const { api } = await import('@/lib/apiClient.js');
      const result = await api.globalLogin({
        email: `admin.${company.code}@infratecnologia.com.br`,
        password: 'Carlos190702@@@'
      });
      if (result.success) {
        // Salvar sessão temporária
        localStorage.setItem('tanamao_current_user', JSON.stringify(result.user));
        localStorage.setItem('tanamao_current_company', JSON.stringify(result.company));
        // Redirecionar para painel da empresa
        window.location.href = '/AdminDashboard';
      }
    } catch (error) {
      console.error('Erro ao acessar empresa:', error);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Painel Super Admin</h1>
          <p className="text-sm text-gray-500 mt-1">
            Visualize e acesse todas as empresas cadastradas
          </p>
        </div>
        <Badge variant="outline" className="uppercase">
          {user?.email}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Empresas ({companies.length})
          </CardTitle>
          <CardDescription>
            Clique em "Acessar Painel" para gerenciar a empresa como admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{company.name}</h3>
                    <Badge variant="secondary" className="uppercase text-xs">
                      {company.code}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{company.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>Schema: {company.schema_name}</span>
                    <span>Criado: {new Date(company.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => accessAsCompany(company)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Acessar Painel
                </Button>
              </div>
            ))}
            {companies.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Building className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Nenhuma empresa cadastrada ainda.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
