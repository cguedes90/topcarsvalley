"use client";

import { ShoppingBag, Shirt, Gift, Star } from "lucide-react";

const MerchandiseSection = () => {
  const products = [
    {
      icon: Shirt,
      name: "Camiseta Premium TC",
      description: "Camiseta de algodão premium com logo bordado TopCars Valley",
      price: "R$ 89,90",
      badge: "Mais Vendido"
    },
    {
      icon: Gift,
      name: "Kit Acessórios",
      description: "Kit completo com chaveiro, adesivos e boné exclusivos",
      price: "R$ 149,90",
      badge: "Limitado"
    },
    {
      icon: ShoppingBag,
      name: "Jaqueta Racing",
      description: "Jaqueta esportiva profissional com tecnologia anti-vento",
      price: "R$ 299,90",
      badge: "Premium"
    },
    {
      icon: Star,
      name: "Coleção Especial",
      description: "Edição limitada comemorativa 5 anos TopCars Valley",
      price: "R$ 499,90",
      badge: "Exclusivo"
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            <span className="text-racing-red">Merchandise</span> Exclusivo
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
            Produtos exclusivos da marca TopCars Valley, disponíveis apenas para membros 
            da nossa comunidade. Qualidade premium que reflete nossa paixão automotiva.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => {
            const IconComponent = product.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-to-b from-charcoal to-graphite rounded-lg p-6 border border-steel/20 hover:border-racing-red/30 transition-all duration-300 group hover:transform hover:scale-105"
              >
                {/* Badge */}
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-racing-red text-white px-3 py-1 rounded-full text-sm font-orbitron font-medium">
                    {product.badge}
                  </div>
                  <div className="w-12 h-12 bg-steel/20 rounded-lg flex items-center justify-center group-hover:bg-racing-red/20 transition-colors duration-300">
                    <IconComponent className="h-6 w-6 text-racing-red" />
                  </div>
                </div>

                {/* Product Image Placeholder */}
                <div className="w-full h-32 bg-gradient-to-br from-steel/20 to-charcoal/40 rounded-lg mb-4 flex items-center justify-center">
                  <IconComponent className="h-16 w-16 text-steel opacity-50" />
                </div>

                {/* Product Info */}
                <h3 className="text-xl font-orbitron font-semibold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-300 font-inter text-sm mb-4 leading-relaxed">
                  {product.description}
                </p>
                
                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-orbitron font-bold text-racing-red">
                    {product.price}
                  </span>
                  <button 
                    className="bg-steel/20 text-white px-4 py-2 rounded-lg font-inter text-sm hover:bg-racing-red transition-colors duration-200"
                    onClick={() => alert('Funcionalidade em breve!')}
                  >
                    Ver Mais
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-racing-red/10 via-racing-red/5 to-transparent p-8 rounded-lg border border-racing-red/20 max-w-4xl mx-auto">
            <h3 className="text-3xl font-orbitron font-bold text-white mb-4">
              Acesso Exclusivo para Membros
            </h3>
            <p className="text-gray-300 font-inter mb-6">
              Nossos produtos são exclusivos para membros ativos da TopCars Valley. 
              Faça login em sua conta para acessar nossa loja completa com descontos especiais.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-racing-red text-white px-8 py-3 rounded-lg font-orbitron font-semibold hover:bg-racing-red/90 transition-colors duration-200"
                onClick={() => window.location.href = '/login'}
              >
                Acessar Loja
              </button>
              <button 
                className="border border-steel text-steel px-8 py-3 rounded-lg font-orbitron font-medium hover:bg-steel hover:text-black transition-colors duration-200"
                onClick={() => alert('Catálogo completo disponível em breve!')}
              >
                Catálogo Completo
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-racing-red/20 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-8 w-8 text-racing-red" />
            </div>
            <h4 className="text-lg font-orbitron font-semibold text-white mb-2">
              Qualidade Premium
            </h4>
            <p className="text-gray-300 font-inter text-sm">
              Materiais selecionados e acabamento de alta qualidade em todos os produtos.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-racing-red/20 rounded-full flex items-center justify-center mb-4">
              <Gift className="h-8 w-8 text-racing-red" />
            </div>
            <h4 className="text-lg font-orbitron font-semibold text-white mb-2">
              Edições Limitadas
            </h4>
            <p className="text-gray-300 font-inter text-sm">
              Produtos exclusivos em tiragem limitada para manter a exclusividade.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-racing-red/20 rounded-full flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-racing-red" />
            </div>
            <h4 className="text-lg font-orbitron font-semibold text-white mb-2">
              Design Exclusivo
            </h4>
            <p className="text-gray-300 font-inter text-sm">
              Criações originais que representam o DNA da TopCars Valley.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MerchandiseSection;
