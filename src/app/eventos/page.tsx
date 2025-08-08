"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";
import { CalendarDays, Clock, MapPin, Users, Loader2 } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  category: string;
  price: string;
}

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetch('/api/events')
      .then(response => response.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      "TRACK_DAY": "Track Day",
      "ENCONTRO": "Encontro", 
      "WORKSHOP": "Workshop",
      "ROAD_TRIP": "Road Trip",
      "EXPOSICAO": "Exposição",
      "COMPETICAO": "Competição"
    };
    return categoryMap[category] || category;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "TRACK_DAY", label: "Track Day" },
    { value: "ENCONTRO", label: "Encontro" },
    { value: "WORKSHOP", label: "Workshop" },
    { value: "ROAD_TRIP", label: "Road Trip" },
    { value: "EXPOSICAO", label: "Exposição" },
    { value: "COMPETICAO", label: "Competição" },
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-4">
              Eventos <span className="text-racing-red">Públicos</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Participe dos nossos eventos exclusivos e conecte-se com outros entusiastas automotivos
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-charcoal/50 backdrop-blur-sm border border-gray-800 rounded-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Pesquisar eventos por título, descrição ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-transparent"
                />
              </div>
              <div className="w-full md:w-64">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-black/50 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-racing-red focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value} className="bg-black">
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-racing-red" />
                <p className="text-lg text-gray-300">Carregando eventos...</p>
              </div>
            </div>
          )}

          {/* Events Grid */}
          {!loading && filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-gray-300 mb-4">Nenhum evento encontrado</p>
              <p className="text-gray-400">Tente ajustar os filtros de pesquisa</p>
            </div>
          )}

          {!loading && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-charcoal/30 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden hover:border-racing-red/50 transition-all duration-300 group">
                  {/* Event Image/Header */}
                  <div className="aspect-video bg-gradient-to-br from-racing-red to-red-700 relative">
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <h3 className="text-white text-lg font-orbitron font-semibold text-center px-4">
                        {event.title}
                      </h3>
                    </div>
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {getCategoryDisplayName(event.category)}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-orbitron font-bold text-white mb-3">{event.title}</h4>
                    
                    <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <CalendarDays className="h-4 w-4 text-racing-red" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <Clock className="h-4 w-4 text-racing-red" />
                        <span>{formatTime(event.time)}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <MapPin className="h-4 w-4 text-racing-red" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-300">
                        <Users className="h-4 w-4 text-racing-red" />
                        <span>{event.currentParticipants}/{event.maxParticipants} participantes</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-semibold text-racing-red">
                        {event.price === "0" || event.price.toLowerCase() === "gratuito" ? "Gratuito" : `R$ ${event.price}`}
                      </div>
                    </div>

                    <button 
                      className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-300 ${
                        event.currentParticipants >= event.maxParticipants
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-racing-red hover:bg-red-700 text-white transform hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      disabled={event.currentParticipants >= event.maxParticipants}
                    >
                      {event.currentParticipants >= event.maxParticipants 
                        ? "Evento Lotado" 
                        : "Participar do Evento"
                      }
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
