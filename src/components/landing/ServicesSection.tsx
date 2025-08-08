"use client";

import { Calendar, MessageCircle, Handshake, Zap } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: Calendar,
      title: "Gestão de Eventos",
      description: "Organizamos encontros exclusivos, track days e eventos corporativos para nossa comunidade de entusiastas.",
      features: ["Eventos privados para membros", "Track days exclusivos", "Encontros temáticos", "Eventos corporativos"]
    },
    {
      icon: MessageCircle,
      title: "Networking Automotivo",
      description: "Conectamos proprietários, colecionadores e empresários do setor automotivo em uma rede premium.",
      features: ["Rede de contatos exclusiva", "Parcerias estratégicas", "Grupos de interesse", "Mentoria especializada"]
    },
    {
      icon: Handshake,
      title: "Parcerias Comerciais",
      description: "Facilitamos conexões entre membros e empresas do setor, criando oportunidades de negócio únicas.",
      features: ["Oportunidades de negócio", "Parcerias estratégicas", "Consultoria especializada", "Acesso a fornecedores premium"]
    },
    {
      icon: Zap,
      title: "Plataforma Digital",
      description: "Sistema completo de comunicação interna, gestão de eventos e ferramentas exclusivas para membros.",
      features: ["Dashboard personalizado", "Sistema de RSVP", "Comunicação interna", "Ferramentas exclusivas"]
    }
  ];

  return (
    <section id="servicos" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            Nossos <span className="text-racing-red">Serviços</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
            Oferecemos uma gama completa de serviços exclusivos para nossa comunidade premium, 
            conectando paixão automotiva com oportunidades de negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-charcoal to-graphite p-8 rounded-lg border border-steel/20 hover:border-racing-red/30 transition-all duration-300 hover:transform hover:scale-[1.02]"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-racing-red rounded-lg flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-orbitron font-semibold text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 font-inter mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li 
                          key={featureIndex}
                          className="flex items-center text-gray-400 font-inter"
                        >
                          <div className="w-1.5 h-1.5 bg-racing-red rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-racing-red/10 to-transparent p-8 rounded-lg border border-racing-red/20">
            <h3 className="text-3xl font-orbitron font-bold text-white mb-4">
              Pronto para fazer parte?
            </h3>
            <p className="text-gray-300 font-inter mb-6 max-w-2xl mx-auto">
              Nossa plataforma é exclusiva por convite. Entre em contato para saber mais 
              sobre como se tornar um membro da TopCars Valley.
            </p>
            <button 
              className="bg-racing-red text-white px-8 py-3 rounded-lg font-orbitron font-semibold hover:bg-racing-red/90 transition-colors duration-200"
              onClick={() => window.location.href = '/contato'}
            >
              Solicitar Convite
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
