"use client";

import { Shield, Crown, Globe, Clock } from "lucide-react";

const WhySection = () => {
  const reasons = [
    {
      icon: Crown,
      title: "Exclusividade Premium",
      description: "Acesso limitado apenas por convite, garantindo uma comunidade seleta de verdadeiros entusiastas automotivos."
    },
    {
      icon: Globe,
      title: "Rede Global",
      description: "Conecte-se com colecionadores e empresários do mundo inteiro, expandindo suas oportunidades de negócio."
    },
    {
      icon: Shield,
      title: "Ambiente Seguro",
      description: "Plataforma protegida com sistema de autenticação avançado e moderação ativa para garantir qualidade."
    },
    {
      icon: Clock,
      title: "Suporte 24/7",
      description: "Nossa equipe está sempre disponível para auxiliar nossos membros em qualquer necessidade ou dúvida."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-graphite to-charcoal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            Por que <span className="text-racing-red">TopCars Valley?</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
            Somos mais que uma plataforma - somos uma família de apaixonados por automóveis 
            que compartilham experiências, conhecimento e oportunidades únicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <div 
                key={index}
                className="text-center group hover:transform hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-racing-red rounded-full mb-6 group-hover:bg-racing-red/90 transition-colors duration-300">
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                  {reason.title}
                </h3>
                <p className="text-gray-300 font-inter leading-relaxed">
                  {reason.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Testimonial/Quote Section */}
        <div className="bg-black/30 rounded-lg p-8 border border-steel/20">
          <div className="text-center">
            <blockquote className="text-2xl md:text-3xl font-orbitron text-white mb-6 italic">
              "Na TopCars Valley, cada membro é parte de uma família que respira automobilismo. 
              Aqui, transformamos paixão em conexões reais."
            </blockquote>
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-racing-red rounded-full flex items-center justify-center">
                <span className="text-white font-orbitron font-bold">TC</span>
              </div>
              <div className="text-left">
                <div className="text-white font-orbitron font-semibold">Equipe TopCars Valley</div>
                <div className="text-gray-400 font-inter">Fundadores & Curadores</div>
              </div>
            </div>
          </div>
        </div>

        {/* Numbers/Impact Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-orbitron font-bold text-racing-red mb-2">98%</div>
            <div className="text-gray-300 font-inter">Satisfação dos Membros</div>
          </div>
          <div>
            <div className="text-4xl font-orbitron font-bold text-racing-red mb-2">24h</div>
            <div className="text-gray-300 font-inter">Tempo de Resposta</div>
          </div>
          <div>
            <div className="text-4xl font-orbitron font-bold text-racing-red mb-2">150+</div>
            <div className="text-gray-300 font-inter">Parcerias Ativas</div>
          </div>
          <div>
            <div className="text-4xl font-orbitron font-bold text-racing-red mb-2">5+</div>
            <div className="text-gray-300 font-inter">Anos de Tradição</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
