import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Building } from "lucide-react";
import { getUserService } from "@/lib/userService";

const emptyForm = {
  name: "",
  code: "",
  schema_name: "public",
  description: "",
};

export default function AdminCompanies() {
  const [form, setForm] = useState(emptyForm);
  const [companies, setCompanies] = useState([]);
  const [status, setStatus] = useState({ isLoading: false, error: null, success: null });
  const normalizedCode = useMemo(() => form.code.trim().toUpperCase(), [form.code]);
  const codeConflict = useMemo(
    () => normalizedCode && companies.some((company) => company.code === normalizedCode),
    [companies, normalizedCode]
  );

  const loadCompanies = async () => {
    try {
      const service = getUserService();
      const list = await service.listCompanies();
      setCompanies(list);
    } catch (error) {
      setStatus((prev) => ({ ...prev, error: error.message }));
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ isLoading: true, error: null, success: null });

    if (codeConflict) {
      setStatus({ isLoading: false, error: "Já existe uma empresa cadastrada com este código", success: null });
      return;
    }

    try {
      const service = getUserService();
      const created = await service.registerCompany(form);
      setStatus({ isLoading: false, success: `Empresa ${created.name} criada com código ${created.code}`, error: null });
      setForm(emptyForm);
      loadCompanies();
    } catch (error) {
      setStatus({ isLoading: false, success: null, error: error.message });
    }
  };

  const schemaBadge = (schema) => (
    <Badge variant="outline" className="uppercase">
      {schema}
    </Badge>
  );

  const rows = useMemo(() => companies.slice().reverse(), [companies]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Empresas globais</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cadastre os códigos que mapeiam para schemas separados no banco.
          </p>
        </div>
        <Building className="w-6 h-6 text-emerald-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Criar novo cadastro</CardTitle>
          <CardDescription>
            Informe o nome da empresa, o código utilizado no login e o schema PostgreSQL associado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da empresa</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(event) => handleChange("name", event.target.value)}
                  placeholder="Ex: Padaria Central"
                  required
                />
              </div>
            {codeConflict && (
              <p className="text-xs text-amber-600">Use um código diferente; este já está em uso.</p>
            )}
              <div className="space-y-2">
                <Label htmlFor="code">Código da empresa</Label>
                <Input
                  id="code"
                  value={form.code}
                  onChange={(event) => handleChange("code", event.target.value)}
                  placeholder="EX: PAD001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schema">Schema PostgreSQL</Label>
                <Input
                  id="schema"
                  value={form.schema_name}
                  onChange={(event) => handleChange("schema_name", event.target.value)}
                  placeholder="public"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(event) => handleChange("description", event.target.value)}
                  placeholder="Chip de pads, aceita delivery e retirada"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={status.isLoading || Boolean(codeConflict)}
              >
                {status.isLoading ? "Cadastrando..." : "Cadastrar empresa"}
              </Button>
              {status.error && <p className="text-sm text-red-600">{status.error}</p>}
              {status.success && <p className="text-sm text-emerald-600">{status.success}</p>}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Empresas cadastradas</CardTitle>
          <CardDescription>Os códigos abaixo valerão como chave para login multi-schema.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Schema</TableHead>
                <TableHead className="hidden md:table-cell">Descrição</TableHead>
                <TableHead>Criado em</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-semibold uppercase tracking-tight">{company.code}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>{schemaBadge(company.schema_name)}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-500">{company.description}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(company.created_at).toLocaleString('pt-BR')}
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-sm text-gray-500">
                    Nenhuma empresa cadastrada ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
