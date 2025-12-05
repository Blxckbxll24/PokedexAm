import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import PokemonCard from '../components/PokemonCard'
import type { SimplePokemon } from '../types/pokemon'

const mockPokemon: SimplePokemon = {
  id: 1,
  name: 'pikachu',
  image: 'https://example.com/pikachu.png',
  types: ['electric'],
  stats: {
    hp: 35,
    attack: 55,
    defense: 40,
    specialAttack: 50,
    specialDefense: 50,
    speed: 90
  },
  height: 4,
  weight: 60
}

describe('PokemonCard', () => {
  it('renders pokemon name correctly', () => {
    const mockOnSelect = vi.fn()
    
    render(
      <PokemonCard 
        pokemon={mockPokemon} 
        onSelect={mockOnSelect} 
      />
    )
    
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument()
  })

  it('renders pokemon image with correct alt text', () => {
    const mockOnSelect = vi.fn()
    
    render(
      <PokemonCard 
        pokemon={mockPokemon} 
        onSelect={mockOnSelect} 
      />
    )
    
    const image = screen.getByAltText('pikachu')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', mockPokemon.image)
  })

  it('renders pokemon types', () => {
    const mockOnSelect = vi.fn()
    
    render(
      <PokemonCard 
        pokemon={mockPokemon} 
        onSelect={mockOnSelect} 
      />
    )
    
    expect(screen.getByText('electric')).toBeInTheDocument()
  })
})