import { useState } from 'react'
import { GoChevronDown, GoChevronUp } from 'react-icons/go'

type Props = {
    title: string
    className?: string
    children: JSX.Element
}

function CollapsedSection(props: Props) {
    const [isExpanded, setIsExpanded] = useState(false);

    const baseClassName = 'collapsable ' + (isExpanded ? 'open ' : 'closed ');
    return (
        <div className={baseClassName + props?.className ?? ''}>
            <h2 onClick={() => setIsExpanded(!isExpanded)}>{props.title} {isExpanded ? <GoChevronDown title='collapse' /> : <GoChevronUp title='expand' /> }</h2>
            { isExpanded ? props.children : null }
        </div>
    )
}

export default CollapsedSection
