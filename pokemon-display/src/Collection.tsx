import PokemonCard, { PokemonInfo } from "./PokemonCard";
import { useEffect, useState, useCallback } from "react";


const POKE_API_BASE_URL : string = "https://pokeapi.co/api/v2/pokemon";
const LIMIT = 20;


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


const Collection = () => {
    const [pokemonCollection, setPokemonCollection] = useState<Array<PokemonInfo>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error|null>(null);
    const [offSet, setOffSet] = useState<number>(1);

    const fetchData = async ({offSet = 0, shouldIgnore = false}) => {
        setIsLoading(true);
        setError(null);

        const URL = `${POKE_API_BASE_URL}?offset=${0}&limit=${LIMIT}`;

        try {
            const response : any = await (await fetch(URL)).json();
            if(!shouldIgnore) {
                for(let pokemon of response.results) {
                    const newPokemonInfo = await fetchPokemonInfo(pokemon);
                    setPokemonCollection(pokemonCollection => [...pokemonCollection, newPokemonInfo]);
                }
                setOffSet(offSet => offSet + LIMIT);
            }
        } catch (error) {
            setError(error as Error);
        } finally {
            setIsLoading(false);
        }

    }

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || isLoading) {
          return;
        }
        console.log("scrolling...")
        fetchData({offSet: offSet});
      }, [isLoading, offSet]);

    
    useEffect(() => {
        const parameters = {
            offSet : 0,
            shouldIgnore : false
        }
        if(!parameters.shouldIgnore){
            fetchData(parameters);
        }
        return () => {
            parameters.shouldIgnore = true;
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    
    return (
        <div className="card-container">
            <ul>
            {pokemonCollection.map((pokemon, index) => 
                <li key={index}>
                    <PokemonCard {...pokemon} index={index} />
                </li>)}
            </ul>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
}

export default Collection;