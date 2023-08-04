import { useState } from "react";

export interface PokemonInfo {
    name: string,
    height: number,
    weight: number,
    imageUrl: string
}

export default function PokemonCard({name, height, weight, imageUrl} : PokemonInfo) {
    const [viewMore, setViewMore] = useState(false);
    
    const viewMoreButton = (
        <button onClick={()=>{setViewMore(!viewMore);}}>
            {viewMore ? "Show Less" : "Show More"}
        </button>
    )
    return (
        <div className="card">
            <img key={`${name}-image`} src={imageUrl} alt={name} />
            <h2>{name.toUpperCase()}</h2>
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
}