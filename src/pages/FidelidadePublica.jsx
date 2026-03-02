import React, { useState, useEffect } from 'react';
import { Gift, TrendingUp, Users, Award, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FidelidadePublica() {
  const [loyaltyData, setLoyaltyData] = useState({
    totalPoints: 0,
    totalVisits: 0,
    totalRedemptions: 0,
    customers: []
  });

  const [searchEmail, setSearchEmail] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // Carregar dados de fidelidade do localStorage
    const savedLoyalty = localStorage.getItem('chegouai_loyalty');
    if (savedLoyalty) {
      setLoyaltyData(JSON.parse(savedLoyalty));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const customer = loyaltyData.customers.find(c => c.email.toLowerCase() === searchEmail.toLowerCase());
    setSelectedCustomer(customer || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={handleGoBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <Gift className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">ChegouAí Fidelidade</h1>
          </div>
          <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <Home className="w-5 h-5" />
            Home
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total de Pontos</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{loyaltyData.totalPoints}</p>
              </div>
              <Award className="w-12 h-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Visitas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{loyaltyData.totalVisits}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Resgates</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{loyaltyData.totalRedemptions}</p>
              </div>
              <Gift className="w-12 h-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Clientes</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{loyaltyData.customers.length}</p>
              </div>
              <Users className="w-12 h-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Consulte seus Pontos</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Digite seu email"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>

          {selectedCustomer ? (
            <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Seus Dados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Nome</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{selectedCustomer.name}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Pontos Disponíveis</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">{selectedCustomer.points || 0}</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-500 text-sm">Visitas</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{selectedCustomer.visits || 0}</p>
                </div>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  <strong>💡 Dica:</strong> Acumule 50 pontos para resgatar uma recompensa!
                </p>
              </div>
            </div>
          ) : searchEmail ? (
            <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">
                <strong>❌ Cliente não encontrado.</strong> Verifique se o email está correto.
              </p>
            </div>
          ) : null}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Cadastro</h3>
              <p className="text-gray-600 text-sm">Cadastre-se no programa de fidelidade com seu email</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Acumule Pontos</h3>
              <p className="text-gray-600 text-sm">Ganhe 10 pontos a cada compra realizada</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Resgate</h3>
              <p className="text-gray-600 text-sm">Resgate 50 pontos por uma recompensa especial</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
