import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center gap-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-500">Erro 404</p>
        <h1 className="text-3xl font-bold text-gray-900">Página não encontrada</h1>
        <p className="text-gray-500 max-w-md">
          A página que você tentou acessar não existe ou foi movida. Verifique o endereço ou volte para o cardápio.
        </p>
      </div>
      <Link to="/">
        <Button>Voltar ao cardápio</Button>
      </Link>
    </div>
  );
}
