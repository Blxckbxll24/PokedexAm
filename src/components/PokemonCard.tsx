import type { SimplePokemon } from '../types/pokemon';
import { NotificationService } from '../services/notificationService';

interface PokemonCardProps {
  pokemon: SimplePokemon;
  onSelect: (pokemon: SimplePokemon) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect }) => {
  const handleClick = async () => {
    // Enviar notificación push nativa
    const notificationService = NotificationService.getInstance();
    await notificationService.notifyPokemonSelected(pokemon.name);
    
    // Llamar al callback para abrir el modal
    onSelect(pokemon);
  };

  const getTypeColorClass = (type: string): string => {
    const typeClasses: { [key: string]: string } = {
      normal: 'bg-gray-400',
      fire: 'bg-red-500',
      water: 'bg-blue-500',
      electric: 'bg-yellow-400',
      grass: 'bg-green-500',
      ice: 'bg-blue-200',
      fighting: 'bg-red-700',
      poison: 'bg-purple-500',
      ground: 'bg-yellow-600',
      flying: 'bg-indigo-400',
      psychic: 'bg-pink-500',
      bug: 'bg-lime-500',
      rock: 'bg-yellow-800',
      ghost: 'bg-purple-700',
      dragon: 'bg-indigo-700',
      dark: 'bg-gray-800',
      steel: 'bg-gray-500',
      fairy: 'bg-pink-300',
    };
    return typeClasses[type] || 'bg-teal-500';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button 
      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-pokemon-red focus:outline-none focus:ring-4 focus:ring-pokemon-yellow focus:ring-opacity-50 w-full"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      aria-label={`Seleccionar ${pokemon.name}`}
    >
      {/* Imagen del Pokemon */}
      <div className="text-center mb-4 p-5 bg-gradient-to-br from-slate-100 to-gray-200 rounded-xl">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          loading="lazy"
          className="w-28 h-28 sm:w-32 sm:h-32 object-contain mx-auto filter drop-shadow-md transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/pokemon-placeholder.png';
          }}
        />
      </div>
      
      {/* Información del Pokemon */}
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 capitalize">
          #{pokemon.id.toString().padStart(3, '0')} {pokemon.name}
        </h3>
        
        {/* Tipos */}
        <div className="flex flex-wrap gap-2 justify-center">
          {pokemon.types.map((type) => (
            <span
              key={type}
              className={`px-3 py-1 rounded-full text-sm font-semibold text-white capitalize shadow-md ${
                getTypeColorClass(type)
              }`}
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
};

export default PokemonCard;