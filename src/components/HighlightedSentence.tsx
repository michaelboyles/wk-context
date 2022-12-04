export function HighlightedSentence(props: {word: string, sentence: string}) {
    const word = props.word.startsWith('〜') ? props.word.substring(1) : props.word;
    const regex = new RegExp('(' + word + ')', "g");
    const fragments = props.sentence.split(regex);
    return (<>{
        fragments.map(
            (fragment, i)=> <span key={i} className={fragment === word ? 'highlight' : ''}>{fragment}</span>
        )
    }</>);
}
