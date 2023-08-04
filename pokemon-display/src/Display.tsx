import { useEffect, useState } from "react";
import PokemonCard, { PokemonInfo } from "./PokemonCard";

const fetchPokemonInfo = async (pokemon : {name: string, url : string,}) : Promise<PokemonInfo> => {
    const pokemonInfo = await (await fetch(pokemon.url)).json();
    const imageSprites = pokemonInfo.sprites.other
    return {
        name: pokemon.name,
        height: pokemonInfo.height,
        weight: pokemonInfo.weight,
        imageUrl: imageSprites.home.front_default ?? imageSprites.dream_world.front_default ?? imageSprites["official-artwork"].front_default
    }
}

export default function Display() {
    const [allPokemons, setAllPokemons] = useState([] as PokemonInfo[])
    const [apiLink, setApiLink] = useState("https://pokeapi.co/api/v2/pokemon");
    useEffect(() => {

        let shouldSkip = false;
        let shouldFetchInfo = true;
        const fetchData = async (apiLink : string) => {
            const response = await (await fetch(apiLink)).json();
            if(!shouldSkip) {
                for(let pokemon of response.results) {
                    const newPokemonInfo = await fetchPokemonInfo(pokemon);
                    if(shouldFetchInfo){
                        setAllPokemons((allPokemons) => [...allPokemons, newPokemonInfo]);
                    }
                }
                setApiLink(response.next);
            }
        }
        if(Boolean(apiLink)) {
            fetchData(apiLink);
        }
        return () => {
            shouldSkip = true;
            shouldFetchInfo = false;
        }
    }, [apiLink])

    console.log("updating...", allPokemons.length, allPokemons[allPokemons.length-1]);

    return (
        <div className="card-container">
            <ul>
            {allPokemons.map((pokemon, index) => 
                <li key={index}>
                    <PokemonCard {...pokemon} />
                </li>)}
            </ul>
        </div>
    );
}