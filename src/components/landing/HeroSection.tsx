"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Zap } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section 
      id="inicio"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-charcoal to-graphite overflow-hidden"
      style={{
        backgroundImage: "url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 800\"%3E%3Cdefs%3E%3ClinearGradient id=\"carGradient\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\"%3E%3Cstop offset=\"0%\" style=\"stop-color:%23262626;stop-opacity:0.9\" /%3E%3Cstop offset=\"100%\" style=\"stop-color:%23404040;stop-opacity:0.7\" /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d=\"M200,600 Q300,550 400,580 T600,600 Q700,620 800,600 Q900,580 1000,600 L1200,800 L0,800 Z\" fill=\"url(%23carGradient)\" /%3E%3C/svg%3E')",
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 hero-gradient"></div>
      
      {/* Car silhouette background */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2/3 h-full opacity-20">
        <div className="relative w-full h-full">
          {/* Car outline representation */}
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
            <div className="w-96 h-48 relative">
              {/* Car body */}
              <div className="absolute bottom-0 w-full h-20 bg-gradient-to-r from-steel to-graphite rounded-lg opacity-60"></div>
              {/* Car roof */}
              <div className="absolute bottom-12 left-16 w-64 h-16 bg-gradient-to-r from-steel to-charcoal rounded-t-3xl opacity-70"></div>
              {/* Wheels */}
              <div className="absolute bottom-0 left-8 w-12 h-12 bg-steel rounded-full opacity-80"></div>
              <div className="absolute bottom-0 right-8 w-12 h-12 bg-steel rounded-full opacity-80"></div>
              {/* Headlight glow */}
              <div className="absolute bottom-6 right-0 w-8 h-4 bg-racing-red opacity-50 rounded-r blur-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-orbitron font-black mb-6">
            <span className="text-white">Conectando</span>{" "}
            <span className="text-racing-red">Máquinas</span>
            <br />
            <span className="text-white">e</span>{" "}
            <span className="text-racing-red">Pessoas</span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 font-inter leading-relaxed max-w-3xl mx-auto">
            Onde a paixão automotiva encontra a inovação digital. Uma
            plataforma exclusiva para entusiastas que transformam ferro em
            sonhos e conectam histórias através de rodas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              variant="racing" 
              size="lg" 
              className="text-lg px-8 py-4 flex items-center space-x-2 hover:scale-105 transition-transform duration-200"
              onClick={() => {
                document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Zap className="h-5 w-5" />
              <span>Quero saber mais</span>
            </Button>
            
            <Link href="/eventos-publicos">
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 py-4 text-black bg-white border-white hover:bg-gray-100 hover:text-black transition-all duration-200 font-orbitron font-semibold"
              >
                Ver Eventos Públicos
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center animate-bounce">
            <ChevronDown className="h-8 w-8 text-racing-red" />
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
      
      {/* Racing stripes */}
      <div className="absolute right-0 top-0 w-1 h-full bg-racing-red opacity-30"></div>
      <div className="absolute right-4 top-0 w-0.5 h-full bg-white opacity-20"></div>
    </section>
  );
};

export default HeroSection;
