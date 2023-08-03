export default function Button({onClick, className, value} : {onClick : () => void, className : string, value : string}) {
    return (
        <button className={className} onClick={onClick}>
            {value}
        </button>
    )
}