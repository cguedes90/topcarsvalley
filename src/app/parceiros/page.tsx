'use client';

import { useState } from 'react';
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

// Parceiros estáticos (originais do design)
const staticPartners: Partner[] = [
  {
    id: 'static-bmw',
    name: 'BMW Center Vale',
    description: 'A BMW Center Vale representa a excelência alemã no Vale do Paraíba, oferecendo toda a sofisticação e performance dos veículos BMW. Como parceiro entusiasta da TopCars Valley, compartilham nossa paixão pela engenharia de precisão e design inovador. Seus showrooms apresentam as mais recentes tecnologias automotivas, desde os esportivos da série M até os elegantes sedãs da linha executive.',
    logo: '/images/partners/bmw-logo.svg',
    website: 'https://www.bmw.com.br',
    category: 'Montadora'
  },
  {
    id: 'static-honda',
    name: 'Honda Premium Vale',
    description: 'A Honda Premium Vale traz a confiabilidade e inovação japonesa para o Vale do Paraíba, destacando-se pelos veículos de alta qualidade e tecnologia avançada. Parceiro oficial da TopCars Valley, oferece desde os icônicos Type R até os híbridos mais eficientes do mercado. Sua expertise em motores de alta performance e compromisso com a excelência fazem desta concessionária uma referência regional.',
    logo: '/images/partners/honda-logo.svg',
    website: 'https://www.honda.com.br',
    category: 'Montadora'
  },
  {
    id: 'static-audi',
    name: 'Audi Center Vale',
    description: 'A Audi Center Vale representa a excelência alemã no Vale do Paraíba, oferecendo toda a sofisticação e performance dos veículos Audi. Como parceiro entusiasta da TopCars Valley, compartilham nossa paixão pela engenharia de precisão e design inovador. Seus showrooms apresentam as mais recentes tecnologias automotivas, desde os esportivos RS até os elegantes sedãs da linha A.',
    logo: '/images/partners/audi-logo.svg',
    website: 'https://www.audi.com.br',
    category: 'Montadora'
  },
  {
    id: 'static-inovamente',
    name: 'InovaMente Labs',
    description: 'O InovaMente Labs é um laboratório de inovação especializado em soluções tecnológicas para o setor automotivo. Parceiro estratégico da TopCars Valley, desenvolve tecnologias de ponta para melhorar a experiência dos entusiastas automotivos. Suas soluções incluem sistemas de telemetria avançada, aplicativos de performance e plataformas digitais para comunidades automotivas.',
    logo: '/images/partners/inovamente-logo.svg',
    website: 'https://www.inovamentelabs.com',
    category: 'Tecnologia'
  }
];

export default function ParceirosPage() {
  const [loading, setLoading] = useState(false); // Mudando para false já que não vamos buscar da API
  
  // Usando apenas os parceiros estáticos
  const allPartners = staticPartners;

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
              Parceiros <span className="text-racing-red">Oficiais</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">
              Conheça as concessionárias premium que compartilham nossa paixão 
              automotiva e oferecem experiências exclusivas aos membros da TopCars Valley
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-racing-red mx-auto"></div>
              <p className="text-gray-400 mt-4">Carregando parceiros...</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(partnersByCategory).map(([category, partners]) => (
                <div key={category} className="space-y-8">
                  <h2 className="text-3xl font-orbitron font-bold text-racing-red text-center">
                    {category}
                  </h2>
                  <div className="space-y-8">
                    {partners.map((partner) => (
                      <div 
                        key={partner.id}
                        className="bg-white text-black rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row gap-8 items-start">
                          {/* Logo Section */}
                          <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-gray-100 rounded-xl p-4 flex items-center justify-center">
                              {partner.logo ? (
                                <img 
                                  src={partner.logo} 
                                  alt={`${partner.name} logo`}
                                  className="max-w-full max-h-full object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    if (target.parentElement) {
                                      target.parentElement.innerHTML = `<div class="text-4xl font-bold text-gray-400">${partner.name.charAt(0)}</div>`;
                                    }
                                  }}
                                />
                              ) : (
                                <div className="text-4xl font-bold text-gray-400">
                                  {partner.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 space-y-4">
                            <h3 className="text-3xl font-orbitron font-bold text-black">
                              {partner.name}
                            </h3>
                            
                            {partner.description && (
                              <p className="text-gray-700 text-lg leading-relaxed">
                                {partner.description}
                              </p>
                            )}

                            {/* Especialidades/Features */}
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-racing-red font-semibold">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Especialidades
                              </div>
                              <div className="flex flex-wrap gap-3">
                                {partner.category === 'Montadora' && (
                                  <>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Veículos de Alto Desempenho
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Tecnologia Quattro
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Design Premium
                                    </span>
                                  </>
                                )}
                                {partner.category === 'Tecnologia' && (
                                  <>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Inovação Tecnológica
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Soluções Automotivas
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Desenvolvimento
                                    </span>
                                  </>
                                )}
                                {partner.category === 'AUTOMOTIVE' && (
                                  <>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Produtos Premium
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Alta Performance
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Qualidade Mundial
                                    </span>
                                  </>
                                )}
                                {partner.category === 'SERVICES' && (
                                  <>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Eventos Especiais
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Track Days
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Experiências Únicas
                                    </span>
                                  </>
                                )}
                                {partner.category === 'MEDIA' && (
                                  <>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Conteúdo Especializado
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Reviews Técnicos
                                    </span>
                                    <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium">
                                      Cobertura Exclusiva
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Call to Action */}
                            {partner.website && (
                              <div className="pt-2">
                                <a
                                  href={partner.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-6 py-3 bg-racing-red hover:bg-racing-red/90 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                  </svg>
                                  Visitar Site
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
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

          {/* Call to Action para se tornar parceiro */}
          <div className="mt-20 text-center">
            <div className="bg-graphite/30 border border-gray-600 rounded-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-orbitron font-bold text-white mb-4">
                Seja Nosso Parceiro
              </h3>
              <p className="text-gray-300 mb-6">
                Sua empresa faz parte do universo automotivo? Entre em contato conosco 
                e descubra como podemos trabalhar juntos para oferecer ainda mais valor 
                à nossa comunidade.
              </p>
              <a
                href="/contato"
                className="inline-block px-8 py-3 bg-racing-red hover:bg-racing-red/80 text-white font-bold rounded-lg transition-colors duration-200"
              >
                Entre em Contato
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
