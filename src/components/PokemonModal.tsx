import { useEffect } from 'react';
import type { SimplePokemon } from '../types/pokemon';

interface PokemonModalProps {
  pokemon: SimplePokemon;
  isOpen: boolean;
  onClose: () => void;
}

const PokemonModal: React.FC<PokemonModalProps> = ({ pokemon, isOpen, onClose }) => {
  // Cerrar modal con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTypeColor = (type: string): string => {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return typeColors[type] || '#68A090';
  };

  const getStatName = (statName: string): string => {
    const statNames: { [key: string]: string } = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defensa',
      specialAttack: 'At. Esp.',
      specialDefense: 'Def. Esp.',
      speed: 'Velocidad'
    };
    return statNames[statName] || statName;
  };

  const getStatColor = (value: number): string => {
    if (value >= 100) return '#22c55e';
    if (value >= 80) return '#eab308';
    if (value >= 60) return '#f97316';
    return '#ef4444';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-5 backdrop-blur-sm">
      <div 
        className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        aria-modal="true"
        aria-labelledby="pokemon-modal-title"
      >
        <div className="flex justify-between items-center mb-6 pb-6 border-b-2 border-gray-200">
          <h2 
            id="pokemon-modal-title"
            className="text-2xl md:text-3xl font-extrabold text-slate-800 capitalize"
          >
            #{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
          </h2>
          <button 
            className="text-2xl p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
            onClick={onClose} 
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        <div className="text-center">
          <div className="mb-6">
            <img src={pokemon.image} alt={pokemon.name} className="w-36 h-36 md:w-40 md:h-40 object-contain mx-auto" />
          </div>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-4 py-2 rounded-full text-sm font-bold text-white capitalize shadow-lg"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-slate-50 rounded-2xl">
            <div className="text-center">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Altura</div>
              <div className="text-lg font-bold text-slate-800">{(pokemon.height / 10).toFixed(1)}m</div>
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Peso</div>
              <div className="text-lg font-bold text-slate-800">{(pokemon.weight / 10).toFixed(1)}kg</div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Estadísticas Base</h3>
            {Object.entries(pokemon.stats).map(([statKey, statValue]) => (
              <div key={statKey} className="flex items-center mb-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-24 md:w-28 text-sm font-semibold text-slate-800 capitalize">{getStatName(statKey)}</div>
                <div className="flex-1 h-2 bg-gray-300 rounded-full mx-3 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((statValue / 150) * 100, 100)}%`,
                      backgroundColor: getStatColor(statValue)
                    }}
                  />
                </div>
                <div className="w-10 text-right text-sm font-bold text-slate-800">{statValue}</div>
              </div>
            ))}
            <div className="flex items-center p-3 bg-purple-50 rounded-xl border-2 border-purple-200">
              <div className="w-24 md:w-28 text-sm font-semibold text-purple-800">Total</div>
              <div className="flex-1 h-2 bg-purple-200 rounded-full mx-3 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min((Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0) / 600) * 100, 100)}%`
                  }}
                />
              </div>
              <div className="w-10 text-right text-sm font-bold text-purple-800">
                {Object.values(pokemon.stats).reduce((sum, stat) => sum + stat, 0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonModal;