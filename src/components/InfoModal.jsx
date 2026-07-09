import { X, Waves, Github, Globe } from 'lucide-react'

/**
 * InfoModal Component
 * Displays information about the app and usage instructions
 */
const InfoModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Waves className="w-6 h-6 text-ocean-400" />
              <h2 className="text-2xl font-bold text-white">Denmark Tide Map</h2>
            </div>
            <p className="text-sm text-slate-400">Version 1.0.0 (MVP)</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-white mb-3">About</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Denmark Tide Map is a Progressive Web App (PWA) that provides real-time tide 
              information for major locations along the Danish coast. Track tide levels, 
              view predictions, and plan your coastal activities with confidence.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">How to Use</h3>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-ocean-400 mt-1">•</span>
                <span>Click any station marker on the map to view tide information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ocean-400 mt-1">•</span>
                <span>Use the search bar to find specific locations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ocean-400 mt-1">•</span>
                <span>View current tide levels and upcoming high/low tides</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ocean-400 mt-1">•</span>
                <span>Check the 48-hour prediction chart for planning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-ocean-400 mt-1">•</span>
                <span>Install as a PWA on your device for offline access</span>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Stations Coverage</h3>
            <p className="text-slate-300 text-sm mb-2">
              Currently tracking {11} tide stations across Denmark:
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-slate-400">• Copenhagen</div>
              <div className="text-slate-400">• Esbjerg</div>
              <div className="text-slate-400">• Aarhus</div>
              <div className="text-slate-400">• Skagen</div>
              <div className="text-slate-400">• Aalborg</div>
              <div className="text-slate-400">• Helsingør</div>
              <div className="text-slate-400">• Gedser</div>
              <div className="text-slate-400">• Korsør</div>
              <div className="text-slate-400">• Fredericia</div>
              <div className="text-slate-400">• Hirtshals</div>
              <div className="text-slate-400">• Rønne</div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Data Sources</h3>
            <p className="text-slate-300 text-sm">
              <span className="font-semibold text-ocean-400">Note:</span> Currently using 
              demo data for development. In production, this app integrates with WorldTides 
              API and DMI (Danish Meteorological Institute) for accurate tide predictions.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white mb-3">Technology</h3>
            <div className="flex flex-wrap gap-2">
              {['React', 'Vite', 'Leaflet', 'Recharts', 'Tailwind CSS', 'PWA'].map((tech) => (
                <span 
                  key={tech}
                  className="px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-full text-xs text-slate-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
          <p className="text-xs text-center text-slate-500">
            Built with ❤️ for coastal enthusiasts in Denmark
          </p>
        </div>
      </div>
    </div>
  )
}

export default InfoModal
