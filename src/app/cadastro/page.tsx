"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Mail, Lock, Eye, EyeOff, User, Phone, Building, Key } from "lucide-react";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    token: "",
    name: "",
    email: "",
    phone: "",
    company: "",
    car: "",
    password: "",
    confirmPassword: "",
  });

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validar token aqui
    if (formData.token) {
      setStep(2);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de cadastro aqui
    console.log("Register attempt:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-graphite flex items-center justify-center p-4">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Car className="h-12 w-12 text-racing-red" />
            <span className="text-3xl font-orbitron font-bold text-white">
              Top<span className="text-racing-red">Cars</span>
            </span>
          </Link>
          <p className="text-gray-300 font-inter mt-2">Cadastro Exclusivo</p>
        </div>

        {/* Steps Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-racing-red' : 'bg-steel/30'}`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-racing-red' : 'bg-steel/30'}`}></div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-charcoal/80 to-graphite/80 backdrop-blur-sm rounded-lg p-8 border border-steel/20">
          
          {/* Step 1: Token Validation */}
          {step === 1 && (
            <>
              <div className="text-center mb-6">
                <Key className="h-12 w-12 text-racing-red mx-auto mb-4" />
                <h1 className="text-2xl font-orbitron font-bold text-white mb-2">
                  Token de Convite
                </h1>
                <p className="text-gray-300 font-inter text-sm">
                  Digite o token de convite que você recebeu para acessar o cadastro exclusivo da TopCars Valley.
                </p>
              </div>

              <form onSubmit={handleTokenSubmit} className="space-y-6">
                <div>
                  <label htmlFor="token" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Token de Convite
                  </label>
                  <input
                    type="text"
                    id="token"
                    required
                    value={formData.token}
                    onChange={(e) => setFormData(prev => ({ ...prev, token: e.target.value.toUpperCase() }))}
                    className="block w-full px-4 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-mono text-lg text-center tracking-wider"
                    placeholder="XXXX-XXXX-XXXX"
                    maxLength={14}
                  />
                </div>

                <Button type="submit" variant="racing" size="lg" className="w-full text-lg py-3">
                  Validar Token
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400 font-inter">
                  Não possui um token?{" "}
                  <Link href="/contato" className="text-racing-red hover:text-racing-red/80">
                    Solicite um convite
                  </Link>
                </p>
              </div>
            </>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <User className="h-12 w-12 text-racing-red mx-auto mb-4" />
                <h1 className="text-2xl font-orbitron font-bold text-white mb-2">
                  Complete seu Cadastro
                </h1>
                <p className="text-gray-300 font-inter text-sm">
                  Preencha seus dados para finalizar o acesso à comunidade TopCars Valley.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter"
                      placeholder="Seu nome completo"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Telefone *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label htmlFor="company" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Empresa
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter"
                      placeholder="Sua empresa (opcional)"
                    />
                  </div>
                </div>

                {/* Car */}
                <div>
                  <label htmlFor="car" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Veículo Principal *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="car"
                      required
                      value={formData.car}
                      onChange={(e) => setFormData(prev => ({ ...prev, car: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter"
                      placeholder="Ex: Porsche 911 GT3"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Senha *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      className="block w-full pl-10 pr-10 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-racing-red" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-racing-red" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="block w-full pl-10 pr-10 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-racing-red" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-racing-red" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="flex items-start space-x-3">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 text-racing-red focus:ring-racing-red border-steel/30 rounded bg-black/20"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-300 font-inter">
                    Aceito os{" "}
                    <Link href="/termos" className="text-racing-red hover:text-racing-red/80">
                      termos de uso
                    </Link>
                    {" "}e{" "}
                    <Link href="/privacidade" className="text-racing-red hover:text-racing-red/80">
                      política de privacidade
                    </Link>
                  </label>
                </div>

                <Button type="submit" variant="racing" size="lg" className="w-full text-lg py-3">
                  Finalizar Cadastro
                </Button>
              </form>

              <button 
                onClick={() => setStep(1)}
                className="mt-4 text-sm text-gray-400 hover:text-racing-red font-inter transition-colors duration-200"
              >
                ← Voltar para validação do token
              </button>
            </>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400 font-inter">
              Já possui uma conta?{" "}
              <Link href="/login" className="text-racing-red hover:text-racing-red/80">
                Fazer login
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link href="/" className="text-gray-300 hover:text-white font-inter transition-colors duration-200">
            ← Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
