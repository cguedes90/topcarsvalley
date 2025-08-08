"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Car } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/#inicio", label: "Início" },
    { href: "/#sobre", label: "Sobre" },
    { href: "/#servicos", label: "Serviços" },
    { href: "/contato", label: "Contato" },
    { href: "/parceiros", label: "Parceiros Oficiais" },
    { href: "/eventos", label: "Eventos Públicos" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-racing-red" />
            <span className="text-2xl font-orbitron font-bold text-white">
              Top<span className="text-racing-red">Cars</span> Valley
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-inter"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Member Access Button */}
          <div className="hidden lg:flex">
            <Link href="/login">
              <Button 
                variant="racing" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <span>👤</span>
                <span>Área de Membros</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-inter"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="racing" size="sm" className="w-full">
                  <span className="mr-2">👤</span>
                  Área de Membros
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
