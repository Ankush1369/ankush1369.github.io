import { useState } from "react";
import { BoxValue, Move } from "./Box";
import Box from "./Box";
import ScoreCard from "./Score";
import Button from "./Button";


function getWinner(grid : Array<BoxValue>) : BoxValue{
    const winnerLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for(let winnerLine of winnerLines) {
        const [a, b, c] = winnerLine;
        if(grid[a] && (grid[a] === grid[b]) && (grid[a] === grid[c])){
            return grid[a];
        }
    }
    return null;

}

const getRemainingCells = (grid : Array<BoxValue>) => {
    return grid.reduce((count, value) => {
        if(!value) {
            return count + 1;
        } else {
            return count;
        }
    },0);
}

const intialGrid : Array<BoxValue> = new Array(9).fill(null as BoxValue);

export default function Grid(){

    const [boardState, setBoardState] = useState({
        grid : intialGrid,
        currentMove : Move.O,
        startMove : Move.O,
    });
    const [isFinish, setIsFinish] = useState(false as Boolean);
    const [score, setScore] = useState({scoreO: 0, scoreX: 0});
   
    const remainingCells = getRemainingCells(boardState.grid);
    const winner = getWinner(boardState.grid);
    const isGameEnd = remainingCells === 0 || Boolean(winner);
    
    const captionText = winner ? `Winner is ${winner}` : (
        remainingCells === 0 ? 'Draw' :
        `Current Move : ${boardState.currentMove}`);
    
    const handleMove = (position : number) : void => {
        const isPositonFilled = Boolean(boardState.grid[position]);
        if(isPositonFilled || isGameEnd) {
            return;
        }

        const nextGrid = boardState.grid.map((value, index) => {
            if(index === position) {
                return boardState.currentMove;
            } else {
                return value;
            }
        });

        const nextMove = (boardState.currentMove === Move.O) ? Move.X : Move.O;
        const newWinner = getWinner(nextGrid);

        if(Boolean(newWinner)) {
            const newScore = {...score};
            if(newWinner === Move.O) {
                newScore.scoreO++;
            } else {
                newScore.scoreX++;
            }
            setScore(newScore);

        }
        setBoardState({...boardState, grid : nextGrid, currentMove: nextMove});
    }

    const nextGame = () => {
        const nextStartMove = boardState.startMove === Move.O ? Move.X : Move.O; 
        setBoardState({grid: intialGrid, currentMove: nextStartMove, startMove: nextStartMove});
    }

    const restartHandler = () => {
        setScore({scoreO: 0, scoreX: 0});
        setIsFinish(false);
        nextGame();
    }



    if(isFinish){
        return (
        <div className="grid">
            <ScoreCard {...score} />
            <Button value="Restart" className="restart" onClick={restartHandler} />
        </div>
        )
    }


    return (
        <div className="grid">
            <table>
                <caption> {captionText} </caption>
                <tbody>
                    <tr>
                        <td><Box value={boardState.grid[0]} onClick={()=>{handleMove(0)}}/></td>
                        <td><Box value={boardState.grid[1]} onClick={()=>{handleMove(1)}}/></td>
                        <td><Box value={boardState.grid[2]} onClick={()=>{handleMove(2)}}/></td>

                    </tr>
                    <tr>
                        <td><Box value={boardState.grid[3]} onClick={()=>{handleMove(3)}}/></td>
                        <td><Box value={boardState.grid[4]} onClick={()=>{handleMove(4)}}/></td>
                        <td><Box value={boardState.grid[5]} onClick={()=>{handleMove(5)}}/></td>

                    </tr>
                    <tr>
                        <td><Box value={boardState.grid[6]} onClick={()=>{handleMove(6)}}/></td>
                        <td><Box value={boardState.grid[7]} onClick={()=>{handleMove(7)}}/></td>
                        <td><Box value={boardState.grid[8]} onClick={()=>{handleMove(8)}}/></td>

                    </tr>
                </tbody>
            </table>
            {isGameEnd && (
                <>
                <Button value="Next-Game" className="next" onClick={nextGame} />
                <Button value="Restart" className="restart" onClick={restartHandler} />
                <Button value="Finish" className="finish" onClick = {() => setIsFinish(true)} />
                </>
            )}
            <ScoreCard {...score} />
        </div>
    )

}