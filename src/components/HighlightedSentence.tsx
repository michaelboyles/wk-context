export function HighlightedSentence(props: {word: string, sentence: string}) {
    const regex = new RegExp('(' + props.word + ')', "g");
    const fragments = props.sentence.split(regex);
    return (<>{
        fragments.map(
            (fragment, i)=> <span key={i} className={fragment === props.word ? 'highlight' : ''}>{fragment}</span>
        )
    }</>);
}
