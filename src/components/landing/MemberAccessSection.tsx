"use client";

import { Button } from "@/components/ui/button";
import { LogIn, UserPlus, Shield, Key } from "lucide-react";
import Link from "next/link";

const MemberAccessSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-charcoal to-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-6">
            <span className="text-racing-red">Área de Membros</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
            Acesse sua conta exclusiva ou solicite um convite para fazer parte 
            da comunidade mais premium do setor automotivo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Login Section */}
          <div className="bg-gradient-to-br from-graphite to-charcoal p-8 rounded-lg border border-steel/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-racing-red rounded-full mb-4">
                <LogIn className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
                Já é membro?
              </h3>
              <p className="text-gray-300 font-inter">
                Acesse sua conta para visualizar eventos exclusivos, conectar-se com outros membros 
                e aproveitar todos os benefícios da plataforma.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300 font-inter">
                <Shield className="h-5 w-5 text-racing-red" />
                <span>Dashboard personalizado</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 font-inter">
                <Shield className="h-5 w-5 text-racing-red" />
                <span>Eventos exclusivos para membros</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 font-inter">
                <Shield className="h-5 w-5 text-racing-red" />
                <span>Rede de networking premium</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 font-inter">
                <Shield className="h-5 w-5 text-racing-red" />
                <span>Acesso à loja exclusiva</span>
              </div>
            </div>

            <div className="mt-8">
              <Link href="/login">
                <Button 
                  variant="racing" 
                  size="lg" 
                  className="w-full text-lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Fazer Login
                </Button>
              </Link>
            </div>
          </div>

          {/* Registration/Invite Section */}
          <div className="bg-gradient-to-br from-steel/10 to-charcoal p-8 rounded-lg border border-racing-red/20">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-steel/20 rounded-full mb-4 border-2 border-racing-red/30">
                <UserPlus className="h-8 w-8 text-racing-red" />
              </div>
              <h3 className="text-2xl font-orbitron font-bold text-white mb-2">
                Quer fazer parte?
              </h3>
              <p className="text-gray-300 font-inter">
                Nossa comunidade é exclusiva e limitada. O acesso só é possível através de 
                convite de nossa equipe ou de membros existentes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300 font-inter">
                <Key className="h-5 w-5 text-racing-red" />
                <span>Acesso exclusivo por convite</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 font-inter">
                <Key className="h-5 w-5 text-racing-red" />
                <span>Curadoria rigorosa de membros</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 font-inter">
                <Key className="h-5 w-5 text-racing-red" />
                <span>Comunidade premium verificada</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300 font-inter">
                <Key className="h-5 w-5 text-racing-red" />
                <span>Experiências únicas e exclusivas</span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <Link href="/contato">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full text-lg border-racing-red text-racing-red hover:bg-racing-red hover:text-white"
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Solicitar Convite
                </Button>
              </Link>
              
              <div className="text-center">
                <span className="text-gray-400 font-inter text-sm">
                  Possui um token de convite?{" "}
                  <Link href="/cadastro" className="text-racing-red hover:text-racing-red/80 transition-colors duration-200">
                    Clique aqui
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats/Trust Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-black/30 p-6 rounded-lg border border-steel/10">
            <div className="text-3xl font-orbitron font-bold text-racing-red mb-2">
              150+
            </div>
            <div className="text-gray-300 font-inter">
              Membros Ativos
            </div>
          </div>
          
          <div className="bg-black/30 p-6 rounded-lg border border-steel/10">
            <div className="text-3xl font-orbitron font-bold text-racing-red mb-2">
              98%
            </div>
            <div className="text-gray-300 font-inter">
              Taxa de Satisfação
            </div>
          </div>
          
          <div className="bg-black/30 p-6 rounded-lg border border-steel/10">
            <div className="text-3xl font-orbitron font-bold text-racing-red mb-2">
              5+
            </div>
            <div className="text-gray-300 font-inter">
              Anos de Tradição
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberAccessSection;
