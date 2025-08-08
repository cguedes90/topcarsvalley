"use client";

import React, { useState, useEffect } from "react";
import { CalendarDays, Clock, MapPin, Users, Loader2 } from "lucide-react";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";

interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string | null;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  price: string;
  isPublic: boolean;
  isActive: boolean;
  image?: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Erro ao carregar eventos');
        setLoading(false);
      });
  }, []);

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: Record<string, string> = {
      trackday: "Track Day",
      meeting: "Encontro",
      exhibition: "Exposição",
      workshop: "Workshop",
      charity: "Beneficente",
      other: "Outros"
    };
    return categoryMap[category] || category;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "trackday", label: "Track Day" },
    { value: "meeting", label: "Encontro" },
    { value: "exhibition", label: "Exposição" },
    { value: "workshop", label: "Workshop" },
    { value: "charity", label: "Beneficente" },
    { value: "other", label: "Outros" }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory && event.isPublic && event.isActive;
  });

  return (
    <main className="min-h-screen bg-black text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-charcoal via-graphite to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-orbitron font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-racing-red bg-clip-text text-transparent">
              Eventos Públicos
            </h1>
            <p className="text-xl text-gray-300 font-inter max-w-2xl mx-auto leading-relaxed">
              Participe dos nossos eventos abertos ao público e faça parte da comunidade TopCars Valley. 
              Experiências únicas para todos os entusiastas automotivos.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-12 bg-charcoal/50 border-b border-steel/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
            {/* Search */}
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-80 bg-steel/10 border border-steel/30 rounded-lg px-4 py-3 text-white font-inter placeholder-gray-400 focus:outline-none focus:border-racing-red focus:bg-steel/20 transition-all duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full md:w-60 bg-steel/10 border border-steel/30 rounded-lg px-4 py-3 text-white font-inter focus:outline-none focus:border-racing-red focus:bg-steel/20 transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value} className="bg-charcoal">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-racing-red" />
              <span className="ml-3 text-gray-300 font-inter">Carregando eventos...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 font-inter text-lg">{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-20">
              <CalendarDays className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-orbitron font-semibold text-gray-300 mb-2">
                Nenhum evento encontrado
              </h3>
              <p className="text-gray-400 font-inter">
                {searchTerm || selectedCategory !== "all" 
                  ? "Tente ajustar os filtros de busca"
                  : "Novos eventos serão anunciados em breve!"
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="bg-gradient-to-br from-charcoal/80 to-graphite/60 rounded-2xl overflow-hidden border border-steel/20 hover:border-racing-red/50 transition-all duration-300 hover:transform hover:-translate-y-2 group"
                >
                  {/* Event Image */}
                  {event.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}

                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-racing-red/20 text-racing-red text-sm font-inter font-medium mb-3">
                      {getCategoryDisplayName(event.category)}
                    </div>

                    {/* Event Title */}
                    <h3 className="text-xl font-orbitron font-semibold text-white mb-2 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Description */}
                    <p className="text-gray-300 font-inter text-sm mb-4 line-clamp-3">
                      {event.shortDescription || event.description}
                    </p>

                    {/* Event Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-300 text-sm">
                        <CalendarDays className="h-4 w-4 text-racing-red mr-2" />
                        <span className="font-inter">{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Clock className="h-4 w-4 text-racing-red mr-2" />
                        <span className="font-inter">{formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <MapPin className="h-4 w-4 text-racing-red mr-2" />
                        <span className="font-inter line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center text-gray-300 text-sm">
                        <Users className="h-4 w-4 text-racing-red mr-2" />
                        <span className="font-inter">
                          {event.currentParticipants}/{event.maxParticipants} participantes
                        </span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-steel/20">
                      <div>
                        <span className="text-2xl font-orbitron font-bold text-racing-red">
                          {event.price === "0.00" || event.price === "0" ? "Gratuito" : `R$ ${event.price}`}
                        </span>
                      </div>
                      <button className="bg-racing-red hover:bg-racing-red/90 text-white px-6 py-2 rounded-lg font-inter font-medium transition-colors duration-200 text-sm">
                        Participar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-charcoal via-graphite to-charcoal border-t border-steel/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-orbitron font-bold text-white mb-4">
            Quer Acesso a Eventos Exclusivos?
          </h2>
          <p className="text-gray-300 font-inter text-lg mb-8 max-w-2xl mx-auto">
            Torne-se membro da TopCars Valley e tenha acesso a eventos privados, 
            track days exclusivos e experiências premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contato"
              className="bg-racing-red hover:bg-racing-red/90 text-white px-8 py-3 rounded-lg font-inter font-semibold transition-colors duration-200 inline-block"
            >
              Solicitar Convite
            </a>
            <a
              href="/"
              className="border border-racing-red text-racing-red hover:bg-racing-red hover:text-white px-8 py-3 rounded-lg font-inter font-semibold transition-all duration-200 inline-block"
            >
              Saber Mais
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
