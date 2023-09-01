import { useState, memo, useMemo, useEffect, useRef } from "react";

export interface PokemonInfo {
    name: string,
    height: number,
    weight: number,
    imageUrl: string
}

function useOnScreen() {

    const [isIntersecting, setIntersecting] = useState<boolean>(false);
    const cardElement = useRef<HTMLDivElement>(null);
  
    const observer = useMemo(() => new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting)
    ), [])
  
  
    useEffect(() => {
      if(cardElement.current) {
        observer.observe(cardElement.current)
      }
      return () => observer.disconnect()
    }, [cardElement, observer])
  
    return {isOnScreen : isIntersecting, cardElement : cardElement};
}

const PokemonCard = memo(({name, height, weight, imageUrl, index} : PokemonInfo & {index : number}) => {
    const [viewMore, setViewMore] = useState(false);

    const viewMoreButton = (
        <button onClick={()=>{setViewMore(!viewMore);}}>
            {viewMore ? "Show Less" : "Show More"}
        </button>
    )
    return (
        <div className="card">
            <img key={`${name}-image`} src={imageUrl} alt={name} loading="lazy"/>
            <h2>{index}.{name.toUpperCase()}</h2>
            {viewMoreButton}
            {viewMore &&
            (<table>
                <tbody>
                    <tr key={`${name}-header`}>
                        <th>Stat-Name</th>
                        <th>Stat-Value</th>
                    </tr>
                    <tr key={`${name}-height`}>
                        <td>height</td>
                        <td>{String(height)}</td>
                    </tr>
                    <tr key={`${name}-weight`}>
                        <td>Weight</td>
                        <td>{String(weight)}</td>
                    </tr>
                </tbody>
            </table>)
            }

        </div>
    )
});

export default PokemonCard;