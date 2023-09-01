export default function Button({onClick, className, value, disabled=false} : {
    onClick : () => void,
    className : string,
    value : string
    disabled ?: boolean
}) {
    return (
        <button className={className} onClick={onClick} disabled={disabled}>
            {value}
        </button>
    )
}