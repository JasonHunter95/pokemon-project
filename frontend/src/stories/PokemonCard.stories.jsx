import React from 'react';
import PokemonCard from '../components/PokemonCard';
import PokemonCardGrid from '../components/PokemonCardGrid';

export default {
  title: 'Components/PokemonCard',
  component: PokemonCard,
};

const basePokemon = {
  id: 35,
  name: 'clefairy',
  types: ['fairy'],
  sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/35.png' },
};

export const Default = {
  args: {
    pokemon: basePokemon,
  },
};

export const MultipleTypes = {
  args: {
    pokemon: { ...basePokemon, id: 3, name: 'venusaur', types: ['grass', 'poison'], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png' } },
  },
};

export const MissingSprite = {
  args: {
    pokemon: { ...basePokemon, id: 9999, name: 'mysterymon', sprites: { front_default: '' } },
  },
};

export const WithActions = {
  args: {
    pokemon: basePokemon,
    onTypeClick: (t) => alert(`Filter by ${t}`),
    linkHref: '/pokemon/35',
  },
};

export const InGrid = {
  render: () => (
    <PokemonCardGrid>
      {[basePokemon,
        { ...basePokemon, id: 1, name: 'bulbasaur', types: ['grass', 'poison'], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png' } },
        { ...basePokemon, id: 4, name: 'charmander', types: ['fire'], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png' } },
        { ...basePokemon, id: 7, name: 'squirtle', types: ['water'], sprites: { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png' } },
      ].map((p) => (
        <PokemonCard key={p.id} pokemon={p} onTypeClick={(t) => console.log('type', t)} />
      ))}
    </PokemonCardGrid>
  ),
};