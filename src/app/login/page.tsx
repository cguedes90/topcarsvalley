"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Car, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      // Store token and user data in localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify(data.user));

      // Redirect based on user role
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }

    } catch (error: any) {
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-gray-300 font-inter mt-2">Área de Membros</p>
        </div>

        {/* Login Form */}
        <div className="bg-gradient-to-b from-charcoal/80 to-graphite/80 backdrop-blur-sm rounded-lg p-8 border border-steel/20">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-orbitron font-bold text-white mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-gray-300 font-inter">
              Acesse sua conta exclusiva TopCars Valley
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                Email
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

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                Senha
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

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-racing-red focus:ring-racing-red border-steel/30 rounded bg-black/20"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-300 font-inter">
                  Lembrar-me
                </label>
              </div>
              <Link href="/recuperar-senha" className="text-sm text-racing-red hover:text-racing-red/80 font-inter">
                Esqueci minha senha
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-400 text-sm font-inter">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="racing" 
              size="lg" 
              className="w-full text-lg py-3"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Help */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400 font-inter">
              Precisa de ajuda?{" "}
              <Link href="/contato" className="text-racing-red hover:text-racing-red/80">
                Fale conosco
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

export default LoginPage;
