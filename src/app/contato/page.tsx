"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, User, Building, HelpCircle } from "lucide-react";

const ContactForm = () => {
  const searchParams = useSearchParams();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "Parcerias",
    message: "",
  });

  // Set subject from URL parameters
  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    if (subjectParam) {
      setFormData(prev => ({
        ...prev,
        subject: subjectParam
      }));
    }
  }, [searchParams]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subjects = [
    { value: "Parcerias", label: "Parcerias Comerciais" },
    { value: "Convite", label: "Solicitar Convite" },
    { value: "Eventos", label: "Informações sobre Eventos" },
    { value: "Suporte", label: "Suporte Técnico" },
    { value: "Dúvidas", label: "Dúvidas Gerais" },
    { value: "Outros", label: "Outros Assuntos" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          subject: "Parcerias",
          message: "",
        });
      } else {
        alert(data.error || 'Erro ao enviar mensagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Verifique sua conexão e tente novamente.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-charcoal to-black py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-orbitron font-bold text-white mb-6">
              <span className="text-racing-red">Contato</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-inter leading-relaxed">
              Entre em contato conosco para parcerias, convites, dúvidas ou qualquer 
              outro assunto relacionado à TopCars Valley.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-orbitron font-bold text-white mb-8">
                Fale <span className="text-racing-red">Conosco</span>
              </h2>
              
              <div className="space-y-6 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-racing-red rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-semibold text-white mb-2">
                      Email
                    </h3>
                    <p className="text-gray-300 font-inter">
                      contato@topcarsvalley.com
                    </p>
                    <p className="text-sm text-gray-400 font-inter">
                      Respondemos em até 24 horas
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-racing-red rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-semibold text-white mb-2">
                      Telefone
                    </h3>
                    <p className="text-gray-300 font-inter">
                      +55 (11) 99999-9999
                    </p>
                    <p className="text-sm text-gray-400 font-inter">
                      Segunda a sexta, 9h às 18h
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-racing-red rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-semibold text-white mb-2">
                      WhatsApp
                    </h3>
                    <p className="text-gray-300 font-inter">
                      +55 (11) 99999-9999
                    </p>
                    <p className="text-sm text-gray-400 font-inter">
                      Atendimento rápido e personalizado
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-racing-red rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-semibold text-white mb-2">
                      Localização
                    </h3>
                    <p className="text-gray-300 font-inter">
                      São Paulo, SP - Brasil
                    </p>
                    <p className="text-sm text-gray-400 font-inter">
                      Atendimento presencial mediante agendamento
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-racing-red rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-orbitron font-semibold text-white mb-2">
                      Horários
                    </h3>
                    <div className="text-gray-300 font-inter">
                      <p>Segunda a Sexta: 9h às 18h</p>
                      <p>Sábado: 9h às 14h</p>
                      <p>Domingo: Fechado</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact Options */}
              <div className="bg-gradient-to-br from-charcoal/50 to-graphite/50 rounded-lg p-6 border border-steel/20">
                <h3 className="text-xl font-orbitron font-semibold text-white mb-4">
                  Contato Rápido
                </h3>
                <div className="space-y-3">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-inter font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span>WhatsApp</span>
                  </button>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-inter font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Email</span>
                  </button>
                  <button className="w-full bg-racing-red hover:bg-racing-red/90 text-white py-3 px-4 rounded-lg font-inter font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Telefone</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gradient-to-b from-charcoal/50 to-graphite/50 rounded-lg p-8 border border-steel/20">
              <h2 className="text-3xl font-orbitron font-bold text-white mb-6">
                Envie uma <span className="text-racing-red">Mensagem</span>
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                    Telefone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
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

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Assunto *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <HelpCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="block w-full pl-10 pr-3 py-3 border border-steel/30 rounded-lg bg-black/20 text-white focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter appearance-none"
                    >
                      {subjects.map(subject => (
                        <option key={subject.value} value={subject.value} className="bg-charcoal">
                          {subject.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-inter font-medium text-gray-300 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="block w-full px-3 py-3 border border-steel/30 rounded-lg bg-black/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-racing-red font-inter resize-none"
                    placeholder="Descreva detalhadamente sua solicitação ou dúvida..."
                  />
                  <p className="text-xs text-gray-400 mt-1 font-inter">
                    Mínimo de 10 caracteres
                  </p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-racing-red/10 border border-racing-red/20 rounded-lg p-4">
                  <p className="text-sm text-gray-300 font-inter">
                    <strong className="text-racing-red">Garantia de Resposta:</strong> 
                    {" "}Respondemos todas as mensagens em até 24 horas. Seus dados são 
                    protegidos conforme nossa política de privacidade.
                  </p>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  variant="racing" 
                  size="lg" 
                  className="w-full text-lg py-3"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ContactPage = () => {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <ContactForm />
    </Suspense>
  );
};

export default ContactPage;
