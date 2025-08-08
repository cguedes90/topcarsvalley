"use client";

import Link from "next/link";
import { Car, Mail, Phone, MapPin, Instagram } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { label: "Início", href: "#inicio" },
      { label: "Sobre", href: "#sobre" },
      { label: "Serviços", href: "#servicos" },
      { label: "Eventos Públicos", href: "/eventos-publicos" },
    ],
    members: [
      { label: "Área de Membros", href: "/login" },
      { label: "Solicitar Convite", href: "/contato" },
      { label: "Cadastro", href: "/cadastro" },
      { label: "Parceiros Oficiais", href: "/parceiros" },
    ],
    support: [
      { label: "Contato", href: "/contato" },
      { label: "Suporte", href: "/contato" },
      { label: "Termos de Uso", href: "/termos" },
      { label: "Política de Privacidade", href: "/privacidade" },
    ],
  };

  return (
    <footer className="bg-black border-t border-steel/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Car className="h-10 w-10 text-racing-red" />
              <span className="text-3xl font-orbitron font-bold text-white">
                Top<span className="text-racing-red">Cars</span> Valley
              </span>
            </Link>
            
            <p className="text-gray-300 font-inter mb-6 leading-relaxed max-w-md">
              Conectando máquinas e pessoas através da paixão automotiva. 
              Uma plataforma exclusiva para entusiastas que transformam sonhos em realidade.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <Mail className="h-5 w-5 text-racing-red" />
                <span className="font-inter">contato@topcarsvalley.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone className="h-5 w-5 text-racing-red" />
                <span className="font-inter">+55 (11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <MapPin className="h-5 w-5 text-racing-red" />
                <span className="font-inter">São Paulo, SP - Brasil</span>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-orbitron font-semibold text-white mb-6">
              Plataforma
            </h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-racing-red transition-colors duration-200 font-inter"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Members Links */}
          <div>
            <h3 className="text-lg font-orbitron font-semibold text-white mb-6">
              Membros
            </h3>
            <ul className="space-y-3">
              {footerLinks.members.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-racing-red transition-colors duration-200 font-inter"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-orbitron font-semibold text-white mb-6">
              Suporte
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-racing-red transition-colors duration-200 font-inter"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Media & Newsletter */}
        <div className="border-t border-steel/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            {/* Social Media */}
            <div className="flex items-center space-x-6">
              <span className="text-gray-300 font-inter">Siga-nos:</span>
              <div className="flex space-x-4">
                <a 
                  href="https://www.instagram.com/topcarsvalley/"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="w-10 h-10 bg-steel/20 rounded-full flex items-center justify-center hover:bg-racing-red transition-colors duration-200"
                >
                  <Instagram className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 font-inter">Newsletter:</span>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Seu email"
                  className="bg-steel/20 border border-steel/30 rounded-l-lg px-4 py-2 text-white font-inter focus:outline-none focus:border-racing-red"
                />
                <button 
                  type="button"
                  onClick={() => alert('Newsletter em breve!')}
                  className="bg-racing-red text-white px-6 py-2 rounded-r-lg font-inter font-medium hover:bg-racing-red/90 transition-colors duration-200"
                >
                  Inscrever
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-steel/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 text-center md:text-left">
              <p className="text-gray-400 font-inter text-sm">
                © {currentYear} TopCars Valley. Todos os direitos reservados.
              </p>
              <div className="flex items-center space-x-1 text-sm">
                <span className="text-gray-400">Desenvolvido por</span>
                <a 
                  href="https://inovamentelabs.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-racing-red font-semibold hover:text-racing-red/80 transition-colors duration-200"
                >
                  InovaMente Labs
                </a>
              </div>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/termos" className="text-gray-400 hover:text-racing-red transition-colors duration-200">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-gray-400 hover:text-racing-red transition-colors duration-200">
                Privacidade
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-racing-red transition-colors duration-200">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
