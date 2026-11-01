import React, { useState, useRef, useCallback } from 'react';
import { MapPin, Clock, Search } from 'lucide-react';
import HalloweenMap from './HalloweenMap';
import { PumpkinSVG } from './PumpkinIcon';

export default function PublicView({
  points = [],
  onNavigateToGenerator = () => { },
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

  // Handle selecting a point (memoized to avoid map re-renders)
  const handleSelectPoint = useCallback((point) => {
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
  }, []);

  return (
    <div className="w-full h-dvh flex flex-col md:flex-row bg-[#07080b] text-gray-100 overflow-hidden select-none">

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
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  className={`group p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${isSelected
                      ? 'bg-[#151a26] border-orange-500 shadow-lg shadow-orange-500/20 ring-1 ring-orange-500/50'
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

      {/* RIGHT SIDE (FULL MAP ON DESKTOP, 3/4 MAP + 1/4 SOLID CARDS SECTION ON MOBILE) */}
      <main className="flex-1 h-full flex flex-col overflow-hidden relative">

        {/* Interactive Dark Map: Full height on desktop, exactly 3/4 (75%) on mobile */}
        <div className="w-full h-3/4 md:h-full min-h-0 relative overflow-hidden">
          <HalloweenMap
            points={points}
            selectedPoint={selectedPoint}
            onSelectPoint={handleSelectPoint}
          />
        </div>

        {/* MOBILE BOTTOM SOLID SECTION (1/4 of screen height, solid background like desktop) */}
        <section className="md:hidden w-full h-1/4 min-h-0 bg-[#0a0d14] border-t border-[#181e2b] flex flex-col justify-between px-3 pt-2 pb-2.5 z-30 shadow-2xl">

          {/* Header inside mobile bottom section (matching Lovable style) */}
          <div className="flex items-center justify-between px-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-base">🎃</span>
              <h2 className="text-lg font-extrabold font-halloween text-orange-500 tracking-wide halloween-glow-orange leading-none">
                RUTA DE DULCES
              </h2>
            </div>
            <span className="text-[11px] text-orange-400 font-semibold bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
              {points.length} puntos
            </span>
          </div>

          {/* Fully visible horizontal cards carousel */}
          <div
            ref={mobileScrollRef}
            className="w-full flex items-center gap-3 overflow-x-auto overflow-y-hidden py-1 px-1 snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {points.map((point) => {
              const isSelected = point.id === selectedPointId;
              return (
                <div
                  key={point.id}
                  ref={(el) => cardRefs.current.set(point.id, el)}
                  onClick={() => handleSelectPoint(point)}
                  className={`flex-shrink-0 w-[265px] p-2.5 rounded-xl cursor-pointer transition-transform duration-200 snap-center border ${isSelected
                      ? 'bg-[#151a26] border-orange-500 shadow-md shadow-orange-500/20 ring-1 ring-orange-500/60 scale-[1.01]'
                      : 'bg-[#0f131c] border-[#1d2332] hover:border-orange-500/40'
                    }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex-shrink-0">
                      <PumpkinSVG className="w-5 h-5" glow={isSelected} />
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

                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                        <span className="truncate">{point.direccion || 'Doctor Mora'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mt-0.5">
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
        </section>

      </main>

    </div>
  );
}
