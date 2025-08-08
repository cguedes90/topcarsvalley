"use client";

import { Car, Users, Trophy, Star } from "lucide-react";

const AboutSection = () => {
  const stats = [
    { icon: Car, label: "Carros Premium", value: "500+" },
    { icon: Users, label: "Membros Ativos", value: "150+" },
    { icon: Trophy, label: "Eventos Realizados", value: "50+" },
    { icon: Star, label: "Anos de Experiência", value: "5+" },
  ];

  return (
    <section id="sobre" className="py-20 bg-charcoal">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            Sobre a <span className="text-racing-red">TopCars Valley</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
            Uma comunidade exclusiva que une paixão automotiva e inovação digital. 
            Conectamos proprietários de veículos premium em experiências únicas e 
            inesquecíveis através da nossa plataforma.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-racing-red rounded-full mb-4">
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-orbitron font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-inter">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Gallery Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative group overflow-hidden rounded-lg bg-gradient-to-br from-graphite to-steel h-64">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-2">
                Eventos Exclusivos
              </h3>
              <p className="text-gray-300 font-inter">
                Encontros únicos para entusiastas
              </p>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-racing-red rounded-full flex items-center justify-center opacity-80">
              <Trophy className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-lg bg-gradient-to-br from-steel to-charcoal h-64">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-2">
                Networking Premium
              </h3>
              <p className="text-gray-300 font-inter">
                Conecte-se com outros colecionadores
              </p>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-racing-red rounded-full flex items-center justify-center opacity-80">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-lg bg-gradient-to-br from-charcoal to-graphite h-64">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
            <div className="absolute bottom-4 left-4">
              <h3 className="text-xl font-orbitron font-semibold text-white mb-2">
                Experiências Únicas
              </h3>
              <p className="text-gray-300 font-inter">
                Vivências automotivas inesquecíveis
              </p>
            </div>
            <div className="absolute top-4 right-4 w-12 h-12 bg-racing-red rounded-full flex items-center justify-center opacity-80">
              <Car className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
