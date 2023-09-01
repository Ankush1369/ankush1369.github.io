import { useCallback, useState } from "react";
import { BoxValue, Move } from "./Box";
import Box from "./Box";
import ScoreCard from "./Score";
import Button from "./Button";


type BoardState = {
    grid: Array<BoxValue>,
    currentMove: Move
}

const getWinner = (grid : Array<BoxValue>) : BoxValue => {
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

const getRemainingCells = (grid : Array<BoxValue>) : number => {
    
    return grid.reduce((count, value) => {
        const isNotNull = Boolean(value);
        return isNotNull ? count : count + 1;
    }, 0);
}

const intialBoardState : BoardState = {
    grid : new Array(9).fill(null as BoxValue),
    currentMove: Move.O,
};


export default function Grid(){

    const [boardStates, setBoardStates] = useState<Array<BoardState>>([intialBoardState]);

    const [startMove, setStartMove] = useState<Move>(Move.O);
    const [currentIndex, setCurrentIndex] = useState<number>(0);


    const [isFinish, setIsFinish] = useState<boolean>(false);
    const [score, setScore] = useState<{scoreO: number, scoreX: number}>({scoreO: 0, scoreX: 0});

   
    const remainingCells = getRemainingCells(boardStates[currentIndex].grid);
    const winner = getWinner(boardStates[currentIndex].grid);
    const isGameEnd = remainingCells === 0 || Boolean(winner);
    const currentBoardState : BoardState = boardStates[currentIndex];

    const captionText = winner ? `Winner is ${winner}` : 
        ( remainingCells === 0 ? 'Draw' :
        `Current Move : ${boardStates[currentIndex].currentMove}`);
    
    const handleMove = (position : number) : void => {
        const isPositonFilled = Boolean(boardStates[currentIndex].grid[position]);
        
        if(isPositonFilled || isGameEnd) {
            return;
        }

        const nextBoardState : BoardState = {
            grid: [...(currentBoardState.grid)],
            currentMove: (currentBoardState.currentMove === Move.O) ? Move.X : Move.O,
        }
        nextBoardState.grid[position] = currentBoardState.currentMove;
        const newWinner = getWinner(nextBoardState.grid);

        if(Boolean(newWinner)) {
            const newScore = {...score};
            const winnerScore = newWinner === Move.O ? "scoreO" : "scoreX";
            newScore[winnerScore]++;
            setScore(newScore);
        }
        setBoardStates([...boardStates.slice(0, currentIndex+1), nextBoardState]);
        setCurrentIndex(ci => ci + 1);
    }

    const nextGame = useCallback(() => {
        const nextStartMove = startMove === Move.O ? Move.X : Move.O; 
        setStartMove(nextStartMove);
        setBoardStates([{...intialBoardState, currentMove: nextStartMove}]);
        setCurrentIndex(0);
    }, [startMove]);

    
    const restartHandler = useCallback(() => {
        setScore({scoreO: 0, scoreX: 0});
        setIsFinish(false);
        setBoardStates([intialBoardState]);
        setCurrentIndex(0);
    },[]);




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
                        <td><Box value={currentBoardState.grid[0]} onClick={()=>{handleMove(0)}}/></td>
                        <td><Box value={currentBoardState.grid[1]} onClick={()=>{handleMove(1)}}/></td>
                        <td><Box value={currentBoardState.grid[2]} onClick={()=>{handleMove(2)}}/></td>

                    </tr>
                    <tr>
                        <td><Box value={currentBoardState.grid[3]} onClick={()=>{handleMove(3)}}/></td>
                        <td><Box value={currentBoardState.grid[4]} onClick={()=>{handleMove(4)}}/></td>
                        <td><Box value={currentBoardState.grid[5]} onClick={()=>{handleMove(5)}}/></td>

                    </tr>
                    <tr>
                        <td><Box value={currentBoardState.grid[6]} onClick={()=>{handleMove(6)}}/></td>
                        <td><Box value={currentBoardState.grid[7]} onClick={()=>{handleMove(7)}}/></td>
                        <td><Box value={currentBoardState.grid[8]} onClick={()=>{handleMove(8)}}/></td>

                    </tr>
                </tbody>
            </table>
            <Button value="Undo" className="undo" onClick = {() => setCurrentIndex(ci => ci-1)} disabled={currentIndex===0}/> 
            {isGameEnd && (
                <>
                <Button value="Next-Game" className="next" onClick={nextGame} />
                <Button value="Finish" className="finish" onClick = {() => setIsFinish(true)} />
                </>
            )}
            <ScoreCard {...score} />
        </div>
    )

}