import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2,
  Bot,
  User,
  Clock,
  Phone,
  MapPin,
  ShoppingBag,
  Star
} from "lucide-react";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      text: "Olá! 👋 Bem-vindo ao nosso atendimento. Como posso ajudá-lo hoje?",
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ["Ver cardápio", "Fazer pedido", "Acompanhar entrega", "Falar com atendente"]
    }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    "cardápio": "Você pode ver nosso cardápio completo na página inicial! Temos pizzas, lanches, bebidas e muito mais. Que tipo de produto você está procurando? 🍕🍔",
    "pedido": "Para fazer um pedido, você pode:\n1. Navegar pelo cardápio\n2. Adicionar itens ao carrinho\n3. Finalizar no checkout\n\nPrecisa de ajuda com algum passo específico?",
    "entrega": "Para acompanhar sua entrega, você precisa do número do pedido. Nosso tempo médio de entrega é de 30-45 minutos. Tem o número do seu pedido?",
    "atendente": "Vou transferir você para um de nossos atendentes. Aguarde um momento... 👨‍💼\n\nEnquanto isso, você pode me contar qual é sua dúvida?",
    "horário": "Funcionamos de segunda a domingo:\n🕕 Segunda a Sábado: 18h às 23h30\n🕔 Domingo: 17h à meia-noite",
    "endereço": "📍 Estamos localizados na Rua das Flores, 123 - Centro\n📞 Telefone: (11) 99988-7766",
    "pagamento": "Aceitamos as seguintes formas de pagamento:\n💳 Cartão (débito/crédito)\n💰 Dinheiro\n📱 PIX\n\nQual você prefere?",
    "promoção": "🎉 Temos algumas promoções especiais hoje!\n- Pizza grande + refrigerante por R$ 35,90\n- Combo lanche + batata + bebida por R$ 28,50\n\nQuer saber mais detalhes?",
    "default": "Entendi! Deixe-me ajudá-lo com isso. Você também pode:\n• Ver nosso cardápio\n• Fazer um pedido\n• Falar com um atendente\n\nO que você gostaria de fazer?"
  };

  const getQuickReplies = (messageText) => {
    const text = messageText.toLowerCase();
    
    if (text.includes("cardápio") || text.includes("menu")) {
      return ["Ver pizzas", "Ver lanches", "Ver bebidas", "Ver promoções"];
    }
    if (text.includes("pedido")) {
      return ["Começar pedido", "Ver carrinho", "Ajuda com pagamento"];
    }
    if (text.includes("entrega")) {
      return ["Rastrear pedido", "Tempo de entrega", "Área de entrega"];
    }
    if (text.includes("atendente")) {
      return ["Reclamação", "Sugestão", "Dúvida sobre produto"];
    }
    
    return ["Ver cardápio", "Fazer pedido", "Horário de funcionamento", "Formas de pagamento"];
  };

  const getBotResponse = (userMessage) => {
    const text = userMessage.toLowerCase();
    
    if (text.includes("cardápio") || text.includes("menu")) return botResponses.cardápio;
    if (text.includes("pedido")) return botResponses.pedido;
    if (text.includes("entrega") || text.includes("rastrear")) return botResponses.entrega;
    if (text.includes("atendente") || text.includes("humano")) return botResponses.atendente;
    if (text.includes("horário") || text.includes("funcionamento")) return botResponses.horário;
    if (text.includes("endereço") || text.includes("localização")) return botResponses.endereço;
    if (text.includes("pagamento") || text.includes("pagar")) return botResponses.pagamento;
    if (text.includes("promoção") || text.includes("oferta")) return botResponses.promoção;
    
    return botResponses.default;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      text: message,
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");

    // Simular delay do bot
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        text: botResponse,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: getQuickReplies(message)
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleQuickReply = (reply) => {
    setMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-80 shadow-2xl border-0 transition-all duration-300 ${
        isMinimized ? 'h-16' : 'h-96'
      }`}>
        {/* Header */}
        <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-medium">Atendimento Online</CardTitle>
                <div className="flex items-center gap-1 text-xs text-blue-100">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Online agora
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0 flex flex-col h-80">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`flex items-center gap-2 mb-1 ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {msg.type === 'bot' && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <span className="text-xs text-gray-500">{msg.time}</span>
                      {msg.type === 'user' && (
                        <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className={`p-3 rounded-lg text-sm whitespace-pre-line ${
                      msg.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm border'
                    }`}>
                      {msg.text}
                    </div>
                    
                    {/* Quick Replies */}
                    {msg.type === 'bot' && msg.quickReplies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.quickReplies.map((reply, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuickReply(reply)}
                            className="text-xs h-7 px-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            {reply}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-gray-200 focus:border-blue-500"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="bg-blue-600 hover:bg-blue-700 px-3"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Resposta em ~30s
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Avalie nosso atendimento
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
