"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (token) {
      setStep('reset');
      validateToken(token);
    }
  }, [token]);

  const validateToken = async (resetToken: string) => {
    try {
      const response = await fetch(`/api/auth/validate-reset-token?token=${resetToken}`);
      const data = await response.json();
      
      if (!data.success) {
        setError('Token inválido ou expirado. Solicite um novo link de redefinição.');
      }
    } catch (err) {
      setError('Erro ao validar token. Tente novamente.');
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Link de redefinição enviado para seu email!');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || 'Erro ao enviar email de redefinição');
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password: formData.password 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('success');
      } else {
        setError(data.error || 'Erro ao redefinir senha');
      }
    } catch (err) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-graphite text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-racing-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-racing-red" />
            </div>
            <h1 className="text-3xl font-orbitron font-bold mb-2">
              {step === 'request' && 'Esqueceu sua senha?'}
              {step === 'reset' && 'Redefinir Senha'}
              {step === 'success' && 'Senha Redefinida!'}
            </h1>
            <p className="text-gray-300">
              {step === 'request' && 'Digite seu email para receber o link de redefinição'}
              {step === 'reset' && 'Digite sua nova senha'}
              {step === 'success' && 'Sua senha foi alterada com sucesso'}
            </p>
          </div>

          {/* Card */}
          <div className="bg-gradient-to-br from-charcoal/80 to-graphite/60 backdrop-blur-lg rounded-2xl border border-steel/20 p-8 shadow-2xl">
            
            {/* Request Reset Form */}
            {step === 'request' && (
              <form onSubmit={handleRequestReset} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 bg-steel/10 border border-steel/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-racing-red focus:bg-steel/20 transition-all duration-200"
                      placeholder="Digite seu email"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {message && (
                  <div className="flex items-center space-x-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg p-3">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">{message}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-racing-red hover:bg-racing-red/90 text-white py-3 rounded-lg font-inter font-semibold transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
                </Button>
              </form>
            )}

            {/* Reset Password Form */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      minLength={8}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 bg-steel/10 border border-steel/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-racing-red focus:bg-steel/20 transition-all duration-200"
                      placeholder="Digite sua nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Mínimo de 8 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirmar Nova Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      minLength={8}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 bg-steel/10 border border-steel/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-racing-red focus:bg-steel/20 transition-all duration-200"
                      placeholder="Confirme sua nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-racing-red hover:bg-racing-red/90 text-white py-3 rounded-lg font-inter font-semibold transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                </Button>
              </form>
            )}

            {/* Success Message */}
            {step === 'success' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-400/20 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-orbitron font-semibold text-green-400 mb-2">
                    Senha Redefinida com Sucesso!
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Sua senha foi alterada com sucesso. Agora você pode fazer login com sua nova senha.
                  </p>
                  <Button
                    onClick={() => router.push('/login')}
                    className="w-full bg-racing-red hover:bg-racing-red/90 text-white py-3 rounded-lg font-inter font-semibold transition-colors duration-200"
                  >
                    Fazer Login
                  </Button>
                </div>
              </div>
            )}

            {/* Back to Login */}
            {step !== 'success' && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push('/login')}
                  className="inline-flex items-center text-racing-red hover:text-racing-red/80 transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Login
                </button>
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            <p>
              Não recebeu o email? Verifique sua caixa de spam ou{' '}
              <a href="/contato" className="text-racing-red hover:text-racing-red/80 transition-colors">
                entre em contato
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-graphite flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
