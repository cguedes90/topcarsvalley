'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/navigation/Navigation';
import Footer from '@/components/navigation/Footer';

interface Partner {
  id: string;
  name: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  category: string;
}

// Parceiros estáticos (originais)
const staticPartners = [
  {
    id: 'static-bmw',
    name: 'BMW',
    description: 'A BMW é reconhecida mundialmente por seus carros esportivos de alta performance e tecnologia avançada.',
    logo: '/images/partners/bmw-logo.png',
    website: 'https://www.bmw.com.br',
    category: 'Montadora'
  },
  {
    id: 'static-honda',
    name: 'Honda',
    description: 'Honda oferece uma ampla gama de veículos confiáveis e eficientes, incluindo carros esportivos icônicos.',
    logo: '/images/partners/honda-logo.png',
    website: 'https://www.honda.com.br',
    category: 'Montadora'
  },
  {
    id: 'static-audi',
    name: 'Audi',
    description: 'Audi combina luxo, performance e tecnologia em seus veículos premium e carros esportivos.',
    logo: '/images/partners/audi-logo.png',
    website: 'https://www.audi.com.br',
    category: 'Montadora'
  },
  {
    id: 'static-inovamente',
    name: 'InovaMente Labs',
    description: 'Laboratório de inovação especializado em soluções tecnológicas para o setor automotivo.',
    logo: '/images/partners/inovamente-logo.png',
    website: 'https://www.inovamentelabs.com',
    category: 'Tecnologia'
  }
];

export default function Partners() {
  const [dynamicPartners, setDynamicPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch('/api/partners');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setDynamicPartners(data.partners);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar parceiros:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Combinar parceiros estáticos e dinâmicos
  const allPartners = [...staticPartners, ...dynamicPartners];

  // Agrupar por categoria
  const partnersByCategory = allPartners.reduce((acc, partner) => {
    if (!acc[partner.category]) {
      acc[partner.category] = [];
    }
    acc[partner.category].push(partner);
    return acc;
  }, {} as Record<string, Partner[]>);

  return (
    <div className="min-h-screen bg-charcoal text-white">
      <Navigation />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-6">
              Nossos <span className="text-racing-red">Parceiros</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Conectamos você com as melhores marcas e empresas do universo automotivo. 
              Conheça nossos parceiros que compartilham a mesma paixão por carros esportivos e excelência.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
              <p className="text-gray-400 mt-4">Carregando parceiros...</p>
            </div>
          ) : (
            <div className="space-y-16">
              {Object.entries(partnersByCategory).map(([category, partners]) => (
                <div key={category}>
                  <h2 className="text-2xl font-orbitron font-bold text-racing-red mb-8 text-center">
                    {category}
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {partners.map((partner) => (
                      <div 
                        key={partner.id}
                        className="bg-graphite/50 border border-gray-600 rounded-lg p-6 hover:border-racing-red/50 transition-all duration-300 hover:transform hover:scale-105"
                      >
                        {partner.logo && (
                          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-lg p-2 flex items-center justify-center">
                            <img 
                              src={partner.logo} 
                              alt={`${partner.name} logo`}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                // Se a imagem não carregar, ocultar o container
                                const target = e.target as HTMLImageElement;
                                target.parentElement!.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        <h3 className="text-xl font-orbitron font-bold text-white text-center mb-3">
                          {partner.name}
                        </h3>
                        
                        {partner.description && (
                          <p className="text-gray-300 text-center mb-4 text-sm leading-relaxed">
                            {partner.description}
                          </p>
                        )}
                        
                        {partner.website && (
                          <div className="text-center">
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-racing-red hover:bg-racing-red/80 text-white font-medium rounded-lg transition-colors duration-200"
                            >
                              Visitar Site
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {allPartners.length === 0 && !loading && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">Nenhum parceiro encontrado.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
