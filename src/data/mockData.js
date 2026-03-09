export const mockStore = {
  store_id: "store-001",
  store_name: "ChegouAí",
  description: "Plataforma completa de delivery para todos os tipos de estabelecimentos. Seu pedido ChegouAí!",
  phone: "11999887766",
  address: "Rua das Flores, 123 - Centro",
  opening_hours: "06:00 - 23:30",
  is_open: true,
  min_order: 15.00,
  delivery_fee: 4.99,
  estimated_delivery_time: "20-40 min",
  accepts_pix: true,
  accepts_card: true,
  accepts_cash: true,
  logo_url: "/logo.svg",
  banner_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
  business_type: "multi_food",
  categories_enabled: ["pizzas", "padaria", "mercado", "lanchonete", "restaurante", "acai", "doces"]
};

export const categories = [
  {
    id: "featured",
    name: "Destaques",
    icon: "⭐",
    description: "Produtos em destaque e mais vendidos.",
  },
  {
    id: "pizzas",
    name: "Pizzas",
    icon: "🍕",
    description: "Sabores tradicionais e especiais com massa artesanal.",
  },
  {
    id: "padaria",
    name: "Padaria",
    icon: "🥖",
    description: "Pães frescos, bolos, doces e salgados assados.",
  },
  {
    id: "mercado",
    name: "Mercado",
    icon: "🛒",
    description: "Produtos básicos, higiene, limpeza e conveniência.",
  },
  {
    id: "lanchonete",
    name: "Lanchonete",
    icon: "🍔",
    description: "Hambúrgueres, sanduíches, batatas e lanches rápidos.",
  },
  {
    id: "restaurante",
    name: "Restaurante",
    icon: "🍽️",
    description: "Pratos executivos, refeições completas e culinária variada.",
  },
  {
    id: "acai",
    name: "Açaí & Smoothies",
    icon: "🍇",
    description: "Açaí na tigela, smoothies, vitaminas e bebidas naturais.",
  },
  {
    id: "doces",
    name: "Doces & Confeitaria",
    icon: "🍰",
    description: "Bolos, tortas, brigadeiros e doces artesanais.",
  },
  {
    id: "bebidas",
    name: "Bebidas",
    icon: "🥤",
    description: "Refrigerantes, sucos, águas e bebidas diversas.",
  },
  {
    id: "farmacia",
    name: "Farmácia",
    icon: "💊",
    description: "Medicamentos, produtos de saúde e bem-estar.",
  },
  {
    id: "sobremesas",
    name: "Sobremesas",
    icon: "🍰",
    description: "Feche a noite com uma sobremesa inesquecível.",
  },
];

export const products = [
  // Pizzas
  {
    product_id: "pizza-margherita",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, manjericão fresco e azeite extravirgem",
    price: 32.90,
    category_id: "pizzas",
    image_url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&q=80",
    is_available: true,
  },
  {
    product_id: "pizza-calabresa",
    name: "Pizza Calabresa",
    description: "Molho de tomate, mussarela, calabresa fatiada e cebola",
    price: 35.90,
    category_id: "pizzas",
    image_url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=80",
    is_available: true,
  },
  
  // Padaria
  {
    product_id: "pao-frances",
    name: "Pão Francês (Unidade)",
    description: "Pão francês fresquinho, crocante por fora e macio por dentro",
    price: 0.75,
    category_id: "padaria",
    image_url: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=80",
    is_available: true,
  },
  {
    product_id: "croissant-chocolate",
    name: "Croissant de Chocolate",
    description: "Croissant folhado recheado com chocolate belga",
    price: 8.50,
    category_id: "padaria",
    image_url: "https://images.unsplash.com/photo-1555507036-ab794f4afe5a?w=400&q=80",
    is_available: true,
  },
  {
    product_id: "bolo-cenoura",
    name: "Fatia de Bolo de Cenoura",
    description: "Bolo de cenoura com cobertura de chocolate",
    price: 6.90,
    category_id: "padaria",
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80",
    is_available: true,
  },

  // Mercado
  {
    product_id: "leite-integral",
    name: "Leite Integral 1L",
    description: "Leite integral pasteurizado tipo A",
    price: 4.99,
    category_id: "mercado",
    image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80",
    is_available: true,
  },
  {
    product_id: "ovos-duzias",
    name: "Ovos Brancos (Dúzia)",
    description: "Ovos frescos de granja, embalagem com 12 unidades",
    price: 8.90,
    category_id: "mercado",
    image_url: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&q=80",
    is_available: true,
  },
  {
    id: "coca-lata",
    category_id: "bebidas",
    name: "Coca-Cola Lata 350ml",
    description: "Gele bem e aproveite.",
    price: 6.5,
    image_url: "https://images.unsplash.com/photo-1629203851122-3725f62d2a20?w=600&q=80",
    is_available: true,
  },
  {
    id: "suco-uva",
    category_id: "bebidas",
    name: "Suco de Uva Integral",
    description: "Suco 100% integral de uvas selecionadas.",
    price: 12.9,
    image_url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&q=80",
    is_available: true,
  },
];

export const orders = [
  {
    id: "ORD-2024-001",
    customer_name: "Mariana Silva",
    total: 112.3,
    delivery_type: "delivery",
    status: "preparing",
    created_at: "2024-03-01T19:12:00-03:00",
    items: [
      { name: "Margherita", quantity: 1, price: 39.9 },
      { name: "Funghi Trufado", quantity: 1, price: 69.5 },
      { name: "Coca-Cola Lata", quantity: 1, price: 6.5 },
    ],
  },
  {
    id: "ORD-2024-002",
    customer_name: "Bruno Rocha",
    total: 58.4,
    delivery_type: "pickup",
    status: "confirmed",
    created_at: "2024-03-01T18:45:00-03:00",
    items: [
      { name: "Portuguesa", quantity: 1, price: 44.9 },
      { name: "Suco de Uva", quantity: 1, price: 12.9 },
    ],
  },
  {
    id: "ORD-2024-003",
    customer_name: "Larissa Costa",
    total: 82.3,
    delivery_type: "delivery",
    status: "delivering",
    created_at: "2024-03-01T18:20:00-03:00",
    items: [
      { name: "Quatro Queijos Premium", quantity: 1, price: 59.9 },
      { name: "Petit Gateau", quantity: 1, price: 22.9 },
    ],
  },
];
