
export interface PokemonInfo {
    name: string,
    height: number,
    weight: number,
    imageUrl: string
}

export default function PokemonCard({name, height, weight, imageUrl} : PokemonInfo) {
    return (
        <div className="card">
            <img key={`${name}-image`} src={imageUrl} alt={name} />
            <table>
                <tbody>
                    <tr key={`card-${name}`}>
                        <td colSpan={2}>{name.toUpperCase()}</td>
                    </tr>
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
            </table>
        </div>
    )
}