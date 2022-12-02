import { useState } from "react"

type Props = {
    title: string
    className?: string
    children: JSX.Element
}

function Preferences(props: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={props?.className ?? ''}>
            <h2 onClick={() => setIsExpanded(!isExpanded)}>{props.title} {isExpanded ? '^' : 'V'}</h2>
            { isExpanded ? props.children : null }
        </div>
    )
}

export default Preferences
