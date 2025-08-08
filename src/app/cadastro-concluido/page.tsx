'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const CadastroConcluido = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-6">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <CheckCircle className="w-24 h-24 text-green-500 animate-pulse" />
          </div>
          <div className="text-6xl mb-4">🏎️</div>
        </div>

        {/* Content */}
        <div className="bg-charcoal rounded-lg p-8 border border-gray-800 mb-6">
          <h1 className="text-2xl font-orbitron font-bold text-white mb-4">
            Cadastro Concluído!
          </h1>
          
          <p className="text-gray-300 mb-6 leading-relaxed">
            Parabéns! Você agora faz parte da <span className="text-racing-red font-semibold">TopCars Valley</span>, 
            a comunidade mais exclusiva de entusiastas automotivos do Brasil.
          </p>

          <div className="bg-racing-red/10 border border-racing-red/30 rounded-lg p-4 mb-6">
            <h3 className="text-racing-red font-semibold mb-2 flex items-center">
              🎉 Próximos Passos:
            </h3>
            <ul className="text-sm text-gray-300 text-left space-y-2">
              <li>• Complete seu perfil com fotos do seu carro</li>
              <li>• Explore os eventos disponíveis</li>
              <li>• Conecte-se com outros membros</li>
              <li>• Participe dos nossos encontros exclusivos</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-green-400 text-sm">
              ✅ Seu cadastro foi aprovado automaticamente!<br />
              Você já pode acessar todas as funcionalidades da plataforma.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => router.push('/login')}
            className="w-full bg-racing-red hover:bg-red-700 text-white font-medium py-3"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Fazer Login
          </Button>
          
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Home className="h-4 w-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        {/* Footer Message */}
        <div className="mt-8 p-4 bg-black/50 rounded-lg border border-gray-800">
          <p className="text-xs text-gray-400">
            Bem-vindo à família TopCars Valley! 🏁<br />
            Em caso de dúvidas, entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastroConcluido;
