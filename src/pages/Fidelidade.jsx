import React, { useState, useEffect } from 'react';
import { Gift, TrendingUp, Users, Award } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Fidelidade() {
  const { user } = useAuth();
  const [loyaltyData, setLoyaltyData] = useState({
    totalPoints: 0,
    totalVisits: 0,
    totalRedemptions: 0,
    customers: []
  });

  useEffect(() => {
    // Carregar dados de fidelidade do localStorage
    const savedLoyalty = localStorage.getItem('chegouai_loyalty');
    if (savedLoyalty) {
      setLoyaltyData(JSON.parse(savedLoyalty));
    } else {
      // Inicializar com dados vazios
      const initialData = {
        totalPoints: 0,
        totalVisits: 0,
        totalRedemptions: 0,
        customers: []
      };
      localStorage.setItem('chegouai_loyalty', JSON.stringify(initialData));
      setLoyaltyData(initialData);
    }
  }, []);

  const addPoints = (customerId, points) => {
    const updated = { ...loyaltyData };
    const customer = updated.customers.find(c => c.id === customerId);
    if (customer) {
      customer.points = (customer.points || 0) + points;
      customer.visits = (customer.visits || 0) + 1;
      updated.totalPoints += points;
      updated.totalVisits += 1;
    }
    setLoyaltyData(updated);
    localStorage.setItem('chegouai_loyalty', JSON.stringify(updated));
  };

  const redeemPoints = (customerId, points) => {
    const updated = { ...loyaltyData };
    const customer = updated.customers.find(c => c.id === customerId);
    if (customer && customer.points >= points) {
      customer.points -= points;
      updated.totalRedemptions += 1;
      setLoyaltyData(updated);
      localStorage.setItem('chegouai_loyalty', JSON.stringify(updated));
      return true;
    }
    return false;
  };

  const addCustomer = (name, email) => {
    const updated = { ...loyaltyData };
    const newCustomer = {
      id: Date.now().toString(),
      name,
      email,
      points: 0,
      visits: 0,
      createdAt: new Date().toISOString()
    };
    updated.customers.push(newCustomer);
    setLoyaltyData(updated);
    localStorage.setItem('chegouai_loyalty', JSON.stringify(updated));
    return newCustomer;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sistema de Fidelidade</h1>
          <p className="text-gray-600">Gerencie pontos e recompensas dos seus clientes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        {/* Clientes Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Clientes</h2>

          {loyaltyData.customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum cliente cadastrado ainda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Pontos</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Visitas</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loyaltyData.customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{customer.name}</td>
                      <td className="py-3 px-4 text-gray-600">{customer.email}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {customer.points || 0}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600">{customer.visits || 0}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => addPoints(customer.id, 10)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm mr-2"
                        >
                          +10 pts
                        </button>
                        <button
                          onClick={() => redeemPoints(customer.id, 50)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Resgatar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Customer Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Adicionar Cliente</h2>
          <AddCustomerForm onAdd={addCustomer} />
        </div>
      </div>
    </div>
  );
}

function AddCustomerForm({ onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email) {
      onAdd(name, email);
      setName('');
      setEmail('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nome do cliente"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
      >
        Adicionar Cliente
      </button>
    </form>
  );
}
