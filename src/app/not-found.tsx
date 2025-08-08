"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-graphite flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center space-x-2 mb-8">
            <Car className="h-12 w-12 text-racing-red" />
            <span className="text-3xl font-orbitron font-bold text-white">
              Top<span className="text-racing-red">Cars</span>
            </span>
          </Link>

          {/* 404 */}
          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-orbitron font-black text-racing-red mb-4">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl font-orbitron font-bold text-white mb-4">
              Página não encontrada
            </h2>
            <p className="text-gray-300 font-inter leading-relaxed">
              Ops! Parece que você saiu da pista. A página que você está procurando 
              não existe ou foi movida para outro local.
            </p>
          </div>

          {/* Car illustration */}
          <div className="mb-8 opacity-20">
            <div className="relative mx-auto w-48 h-24">
              {/* Car body */}
              <div className="absolute bottom-0 w-full h-10 bg-gradient-to-r from-steel to-graphite rounded-lg"></div>
              {/* Car roof */}
              <div className="absolute bottom-6 left-8 w-32 h-8 bg-gradient-to-r from-steel to-charcoal rounded-t-2xl"></div>
              {/* Wheels */}
              <div className="absolute bottom-0 left-4 w-6 h-6 bg-steel rounded-full"></div>
              <div className="absolute bottom-0 right-4 w-6 h-6 bg-steel rounded-full"></div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="racing" size="lg" className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Voltar ao Início</span>
              </Button>
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center space-x-2 px-6 py-3 border border-steel text-steel rounded-lg hover:bg-steel hover:text-black transition-colors duration-200 font-inter font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Página Anterior</span>
            </button>
          </div>

          {/* Help */}
          <div className="mt-8">
            <p className="text-sm text-gray-400 font-inter">
              Precisa de ajuda?{" "}
              <Link href="/contato" className="text-racing-red hover:text-racing-red/80 transition-colors duration-200">
                Entre em contato
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
