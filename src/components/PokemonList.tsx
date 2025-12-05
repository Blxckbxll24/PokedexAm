import React, { useState, useEffect } from 'react';
import PokemonCard from './PokemonCard';
import PokemonModal from './PokemonModal';
import type { SimplePokemon } from '../types/pokemon';
import { pokemonAPI } from '../services/pokemonAPI';

const PokemonList: React.FC = () => {
  const [pokemon, setPokemon] = useState<SimplePokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<SimplePokemon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar 30 Pokemon como mínimo requerido
        const pokemonList = await pokemonAPI.getPokemonList(30);
        setPokemon(pokemonList);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
        console.error('Error loading Pokemon:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemon();
  }, []);

  const handlePokemonSelect = (selectedPokemon: SimplePokemon) => {
    setSelectedPokemon(selectedPokemon);
    setIsModalOpen(true);
    console.log('Pokemon seleccionado:', selectedPokemon.name);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPokemon(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-pokemon-red rounded-full animate-spin mb-5"></div>
        <p className="text-lg text-gray-600 font-medium">Cargando Pokemon...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-10 bg-white rounded-2xl shadow-lg max-w-lg mx-auto my-10">
        <h3 className="text-pokemon-red mb-4 text-2xl font-bold">Error al cargar Pokemon</h3>
        <p className="text-gray-600 mb-5 leading-relaxed">{error}</p>
        <button 
          onClick={() => globalThis.location.reload()}
          className="bg-pokemon-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <header className="text-center mb-10 p-8 bg-gradient-to-br from-pokemon-red to-red-600 rounded-3xl text-white shadow-xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 drop-shadow-md">Pokedex</h1>
          <p className="text-lg md:text-xl opacity-90">Selecciona un Pokemon para ver sus estadísticas</p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-10">
          {pokemon.map((poke) => (
            <PokemonCard
              key={poke.id}
              pokemon={poke}
              onSelect={handlePokemonSelect}
            />
          ))}
        </div>

        <footer className="text-center p-8 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-600 mb-2 text-sm">Total de Pokemon cargados: {pokemon.length}</p>
          <p className="font-semibold text-pokemon-red">Explora la increíble diversidad del mundo Pokemon</p>
        </footer>

        {selectedPokemon && (
          <PokemonModal
            pokemon={selectedPokemon}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default PokemonList;