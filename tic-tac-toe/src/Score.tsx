export default function ScoreCard({scoreO , scoreX} : {scoreO : number, scoreX : number}) {
    return (
    <table className="score">
        <caption>
            ScoreCard
        </caption>
        <thead>
            <tr>
                <th>O</th>
                <th>X</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>{scoreO}</td>
                <td>{scoreX}</td>
            </tr>
        </tbody>
    </table>)
}