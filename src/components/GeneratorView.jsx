import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  Map as MapIcon, 
  FileCode2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import HalloweenMap from './HalloweenMap';
import TimePicker from './TimePicker';
import { PumpkinSVG } from './PumpkinIcon';

export default function GeneratorView({
  points = [],
  onSavePoints = () => {},
  onResetPoints = () => {},
  onBackToMap = () => {},
}) {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [horaInicio, setHoraInicio] = useState('07:00 p. m.');
  const [horaFin, setHoraFin] = useState('08:30 p. m.');
  const [pendingCoords, setPendingCoords] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState('form'); // 'form' or 'map'

  // Map click handler to set orange circle pin
  const handleMapClick = (coords) => {
    setPendingCoords(coords);
    setErrorMsg('');
  };

  // Add new spot
  const handleAddPoint = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setErrorMsg('Por favor ingresa el nombre del negocio o punto.');
      return;
    }

    if (!pendingCoords) {
      setErrorMsg('Por favor toca el mapa para marcar la ubicación del punto.');
      return;
    }

    const newPoint = {
      id: Date.now().toString(),
      nombre: nombre.trim(),
      direccion: direccion.trim() || 'Doctor Mora Centro',
      horaInicio: horaInicio || '07:00 pm',
      horaFin: horaFin || '08:30 pm',
      lat: pendingCoords.lat,
      lng: pendingCoords.lng,
    };

    const updated = [...points, newPoint];
    onSavePoints(updated);

    // Reset Form
    setNombre('');
    setDireccion('');
    setPendingCoords(null);
    setErrorMsg('');
  };

  // Delete spot
  const handleDeletePoint = (id) => {
    const updated = points.filter((p) => p.id !== id);
    onSavePoints(updated);
  };

  // Export JSON as downloadable file
  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(points, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'puntos.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy JSON to clipboard
  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(points, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Error al copiar JSON', err);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row bg-[#07080b] text-gray-100 overflow-hidden select-none">
      
      {/* LEFT PANEL / SIDEBAR (Form & List) */}
      <aside className={`w-full md:w-[440px] lg:w-[480px] h-full flex flex-col bg-[#090c13] border-r border-[#191f2d] z-20 shadow-2xl relative ${
        mobileTab === 'map' ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Header matching screenshot 2 */}
        <div className="p-5 pb-4 border-b border-[#181e2b] bg-gradient-to-b from-[#0e121b] to-[#090c13]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl lg:text-3xl font-extrabold font-halloween text-orange-500 tracking-wider halloween-glow-orange">
              AGREGAR PUNTO
            </h1>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsExportModalOpen(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 transition-all flex items-center gap-1.5"
                title="Exportar archivo JSON"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar</span>
              </button>

              <button
                onClick={onBackToMap}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#141924] hover:bg-[#1f2637] text-gray-300 border border-[#232b3d] transition-all flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ver mapa</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Guarda puntos localmente y expórtalos en JSON para actualizar el mapa público.
          </p>
        </div>

        {/* Scrollable Form & List Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {/* Form */}
          <form onSubmit={handleAddPoint} className="space-y-3.5">
            
            {/* Nombre del negocio */}
            <div>
              <input
                type="text"
                placeholder="Nombre del negocio"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full bg-[#11141d] border border-[#202737] focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs rounded-xl px-3.5 py-3 text-gray-100 placeholder-gray-500 transition-all"
              />
            </div>

            {/* Dirección */}
            <div>
              <input
                type="text"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full bg-[#11141d] border border-[#202737] focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 text-xs rounded-xl px-3.5 py-3 text-gray-100 placeholder-gray-500 transition-all"
              />
            </div>

            {/* Horas Inicio y Fin */}
            <div className="flex items-center gap-3">
              <TimePicker
                label="Hora de inicio"
                value={horaInicio}
                onChange={setHoraInicio}
              />
              <TimePicker
                label="Hora de fin"
                value={horaFin}
                onChange={setHoraFin}
              />
            </div>

            {/* Ubicación selector indicator (matching screenshot 2 & 3) */}
            <div className="pt-1">
              {pendingCoords ? (
                <div className="flex items-center gap-2 text-xs text-orange-400 font-medium py-1 px-2.5 rounded-lg bg-orange-500/10 border border-orange-500/25">
                  <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
                  <span>
                    Ubicación: {pendingCoords.lat}, {pendingCoords.lng}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-gray-400 py-1">
                  <span>👇</span>
                  <span>Toca el mapa para elegir la ubicación</span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/40 border border-red-800/50 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Guardar punto button (matching screenshot 3) */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-extrabold text-xs py-3 px-4 rounded-xl shadow-[0_4px_16px_rgba(249,115,22,0.35)] transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
            >
              <span>Guardar punto</span>
              <span className="text-base">🎃</span>
            </button>
          </form>

          {/* Points List Section ("Puntos (N)") */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Puntos ({points.length})
              </h2>

              {points.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Seguro que deseas vaciar todos los puntos de la lista?')) {
                      onSavePoints([]);
                    }
                  }}
                  className="text-[11px] text-gray-500 hover:text-red-400 transition-colors"
                >
                  Limpiar lista
                </button>
              )}
            </div>

            <div className="space-y-2">
              {points.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-xs border border-dashed border-[#1d2332] rounded-2xl">
                  <span>No hay puntos guardados aún.</span>
                </div>
              ) : (
                points.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#10141d] border border-[#1b2230] hover:border-orange-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <PumpkinSVG className="w-5 h-5 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-gray-200 block truncate">
                          {p.nombre}
                        </span>
                        <span className="text-[11px] text-gray-500 block truncate">
                          {p.direccion} · {p.horaInicio} – {p.horaFin}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeletePoint(p.id)}
                      title="Eliminar punto"
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Mobile View Toggle Buttons */}
        <div className="md:hidden p-3 border-t border-[#181e2b] bg-[#0c0f16] flex gap-2">
          <button
            onClick={() => setMobileTab('map')}
            className="flex-1 py-2 text-xs font-bold text-black bg-orange-500 rounded-xl flex items-center justify-center gap-1.5"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Ver mapa para marcar ({pendingCoords ? 'Marcado 📍' : 'Sin marcar'})</span>
          </button>
        </div>

      </aside>

      {/* RIGHT PANEL: INTERACTIVE MAP */}
      <main className={`flex-1 relative h-full flex flex-col ${
        mobileTab === 'form' ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Mobile Map Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0d14] border-b border-[#181e2b] z-30">
          <button
            onClick={() => setMobileTab('form')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-500 text-black flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al formulario</span>
          </button>

          <span className="text-xs text-orange-400 font-medium">
            {pendingCoords ? 'Punto colocado' : 'Toca el mapa'}
          </span>
        </div>

        <div className="flex-1 w-full h-full">
          <HalloweenMap
            points={points}
            isGenerator={true}
            pendingCoords={pendingCoords}
            onMapClick={handleMapClick}
          />
        </div>
      </main>

      {/* EXPORT JSON MODAL */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f131c] border border-orange-500/40 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            
            <div className="p-4 border-b border-[#1f2738] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-bold text-gray-100">
                  Exportar puntos.json
                </h3>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-gray-400 hover:text-gray-200 text-sm px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              <p className="text-xs text-gray-300 leading-relaxed">
                Este JSON contiene los <span className="text-orange-400 font-bold">{points.length} puntos</span> que has agregado o modificado.
                Copia este contenido o descarga el archivo y colócalo en:
                <br />
                <code className="text-amber-300 font-mono text-[11px] bg-black/50 px-2 py-0.5 rounded mt-1 inline-block">
                  src/data/puntos.json
                </code>
              </p>

              {/* JSON preview */}
              <div className="relative">
                <pre className="bg-[#07090f] border border-[#1b2230] text-gray-300 text-[11px] font-mono p-3 rounded-xl max-h-60 overflow-y-auto custom-scrollbar select-text">
                  {JSON.stringify(points, null, 2)}
                </pre>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  className="flex-1 py-2.5 px-3 bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Descargar puntos.json</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="flex-1 py-2.5 px-3 bg-[#171c28] hover:bg-[#202737] text-gray-200 border border-[#252f42] font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar al portapapeles</span>
                    </>
                  )}
                </button>
              </div>

              {/* Restore default button */}
              <div className="pt-2 border-t border-[#1b2230] flex items-center justify-between">
                <span className="text-[11px] text-gray-500">¿Deseas restablecer los puntos originales?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('¿Restablecer los datos originales de Doctor Mora?')) {
                      onResetPoints();
                      setIsExportModalOpen(false);
                    }
                  }}
                  className="text-[11px] text-amber-500 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restablecer</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#0a0d14] border-t border-[#181e2b] flex justify-end">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-1.5 text-xs text-gray-300 hover:text-white rounded-lg bg-[#141924]"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
