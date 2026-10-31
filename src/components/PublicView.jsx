import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Clock, Search, SlidersHorizontal, Sparkles, Navigation } from 'lucide-react';
import HalloweenMap from './HalloweenMap';
import { PumpkinSVG } from './PumpkinIcon';

export default function PublicView({
  points = [],
  onNavigateToGenerator = () => {},
}) {
  const [selectedPointId, setSelectedPointId] = useState(points[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const mobileScrollRef = useRef(null);
  const cardRefs = useRef(new Map());

  // Filter points based on search
  const filteredPoints = points.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nombre?.toLowerCase().includes(term) ||
      p.direccion?.toLowerCase().includes(term)
    );
  });

  const selectedPoint = points.find((p) => p.id === selectedPointId) || null;

  // Handle selecting a point
  const handleSelectPoint = (point) => {
    setSelectedPointId(point.id);

    // Scroll card into view in horizontal mobile carousel
    const el = cardRefs.current.get(point.id);
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-[#07080b] text-gray-100 overflow-hidden select-none">
      
      {/* DESKTOP SIDEBAR (Left on desktop, hidden in mobile view in favor of bottom sliding carousel) */}
      <aside className="hidden md:flex flex-col w-[400px] lg:w-[440px] h-full bg-[#0a0d14] border-r border-[#191f2d] z-20 shadow-2xl relative">
        
        {/* Sidebar Header */}
        <div className="p-5 pb-4 border-b border-[#181e2b] bg-gradient-to-b from-[#0e121b] to-[#0a0d14]">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🎃</span>
              <h1 className="text-3xl font-extrabold font-halloween text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400 tracking-wider halloween-glow-orange">
                RUTA DE DULCES
              </h1>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
              <span>Doctor Mora · Halloween</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              <span className="text-orange-400 font-semibold">{points.length} puntos</span>
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-3.5 relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por negocio o calle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111622] border border-[#202737] focus:border-orange-500/70 focus:outline-none focus:ring-1 focus:ring-orange-500/40 text-xs rounded-xl pl-9 pr-3 py-2.5 text-gray-200 placeholder-gray-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs px-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Spots List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {filteredPoints.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-3xl block mb-2">👻</span>
              <p className="text-sm font-medium">No se encontraron puntos de dulces</p>
              <p className="text-xs mt-1 text-gray-600">Intenta con otra búsqueda</p>
            </div>
          ) : (
            filteredPoints.map((point) => {
              const isSelected = point.id === selectedPointId;
              return (
                <div
                  key={point.id}
                  onClick={() => handleSelectPoint(point)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                    isSelected
                      ? 'bg-[#151a26] border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.22)] ring-1 ring-orange-500/50'
                      : 'bg-[#0f131c] border-[#1d2332] hover:bg-[#141824] hover:border-orange-500/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex-shrink-0">
                      <PumpkinSVG className="w-6 h-6" glow={isSelected} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-sm text-gray-100 truncate group-hover:text-orange-400">
                          {point.nombre}
                        </h3>
                        {isSelected && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            En mapa
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{point.direccion || 'Doctor Mora Centro'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>
                          {point.horaInicio || '7:00 pm'} – {point.horaFin || '9:00 pm'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-3 border-t border-[#181e2b] bg-[#090b10] flex items-center justify-between text-[11px] text-gray-500">
          <span>¡Dulce o truco! Feliz Halloween 🎃</span>
          <span className="text-orange-400/80 font-mono">Doctor Mora, Gto</span>
        </div>
      </aside>

      {/* MOBILE TOP BAR (Fixed on top on mobile) */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0d14]/95 backdrop-blur-md border-b border-[#181e2b] z-30">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎃</span>
          <div>
            <h1 className="text-xl font-extrabold font-halloween text-orange-500 tracking-wide halloween-glow-orange leading-tight">
              RUTA DE DULCES
            </h1>
            <p className="text-[10px] text-gray-400">Doctor Mora · Halloween</p>
          </div>
        </div>

        <div className="text-[11px] text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
          {points.length} puntos
        </div>
      </header>

      {/* RIGHT SIDE (FULL MAP ON DESKTOP, MAIN VIEW ON MOBILE) */}
      <main className="flex-1 relative h-full flex flex-col overflow-hidden">
        
        {/* Interactive Dark Map */}
        <div className="flex-1 w-full h-full">
          <HalloweenMap
            points={points}
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
          />
        </div>

        {/* MOBILE BOTTOM HORIZONTAL SLIDING CAROUSEL */}
        <div className="md:hidden absolute bottom-3 left-0 right-0 z-30 px-3 pointer-events-none">
          <div
            ref={mobileScrollRef}
            className="flex items-stretch gap-3 overflow-x-auto pb-2 pt-1 px-1 snap-x snap-mandatory pointer-events-auto no-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {points.map((point) => {
              const isSelected = point.id === selectedPointId;
              return (
                <div
                  key={point.id}
                  ref={(el) => cardRefs.current.set(point.id, el)}
                  onClick={() => handleSelectPoint(point)}
                  className={`flex-shrink-0 w-[290px] p-3.5 rounded-2xl cursor-pointer transition-all duration-200 snap-center border backdrop-blur-xl ${
                    isSelected
                      ? 'bg-[#121622]/95 border-orange-500 shadow-[0_8px_25px_rgba(249,115,22,0.3)] ring-1 ring-orange-500/60 scale-[1.02]'
                      : 'bg-[#0c0f17]/90 border-[#1e2535] hover:border-orange-500/40 shadow-xl'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex-shrink-0">
                      <PumpkinSVG className="w-6 h-6" glow={isSelected} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-bold text-sm text-gray-100 truncate">
                          {point.nombre}
                        </h3>
                        {isSelected && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                            Activo
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{point.direccion || 'Doctor Mora'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="truncate">
                          {point.horaInicio || '7:00 pm'} – {point.horaFin || '9:00 pm'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

    </div>
  );
}
