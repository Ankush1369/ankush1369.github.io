
export enum Move {
    O = "O",
    X = "X"
}
export type BoxValue = Move | null
type BoxInput = {
    onClick: () => void;
    value : BoxValue;
}
export default function Box({onClick, value} : BoxInput){
    return (
        <div className="box" onClick={onClick}>
        {value}
        </div>
    )
}