import { useContext, useEffect, useState } from 'react'
import './App.scss'
import Preferences from './Preferences';
import { PrefsContext } from './prefs-context';
import { ContextSentence, Vocab, VocabResponse } from './WaniKani';
import { GoCheck, GoX } from 'react-icons/go';

function randomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function Question(props: {question: TQuestion|null}) {
    const { highlightVocab } = useContext(PrefsContext);

    if (!props.question) return null;
    if (!highlightVocab) return <p className='sentence ja'>{props.question.sentence.ja}</p>;

    const word = props.question.vocab.characters;
    const regex = new RegExp('(' + word + ')', "g");
    const fragments = props.question.sentence.ja.split(regex);
    return <p className='sentence ja'>{
        fragments.map((fragment, i)=> <span key={i} className={fragment === word ? 'highlight' : ''}>{fragment}</span>)
    }</p>;
}

type TQuestion = {
    sentence: ContextSentence
    vocab: Vocab
}

type AnswerProps = {
    question: TQuestion|null
    isShowing: boolean
    showAnswer: () => void
    correct: () => void
    incorrect: () => void
}

function Answer(props: AnswerProps) {
    if (!props.question) return null;
    if (props.isShowing) {
        return (
            <div className='answer'>
                <p className='sentence en'>{ props.question.sentence.en }</p>
                <div>
                    <button className='correct' onClick={props.correct}><GoCheck title='Correct' /></button>
                    <button className='incorrect' onClick={props.incorrect}><GoX title='Incorrect' /></button>
                </div>
                <ul className='links'>
                    <li><a href={props.question.vocab.document_url} target='_blank'>Open in WaniKani</a></li>
                    <li><a href={'https://translate.google.com/?sl=ja&tl=en&text=' + props.question.sentence.ja} target='_blank'>Sentence in Google Translate</a></li>
                </ul>
            </div>
        );
    }
    return (
        <div className='answer'>
            <button onClick={props.showAnswer}>Show answer</button>
        </div>
    );
}

function App() {
    const userLevel = 2; // TODO query this

    const [apiKey, setApiKey] = useState('a146a449-147b-4b36-bae2-a1bbe706e6f8');
    const [highlightVocab, setHighlightVocab] = useState(false);

    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    const [isQuestionPhase, setIsQuestionPhase] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<TQuestion|null>(null);

    const nextQuestion = (vocabs: Vocab[]) => {
        while (true) {
            const randomVocabIdx = randomInt(vocabs.length);
            const vocab = vocabs[randomVocabIdx];
            if (vocab?.context_sentences?.length) {
                const randomSentenceIndex = randomInt(vocab.context_sentences.length);
                setCurrentQuestion({
                    vocab,
                    sentence: vocab.context_sentences[randomSentenceIndex]
                });
                setIsQuestionPhase(true);
                break;
            }
        }
    }

    useEffect(() => {
        if (apiKey.length == 36) {
            const doFetch = async () => {
                const levels = [...Array(userLevel).keys()].join();
                const result = await fetch(
                    `https://api.wanikani.com/v2/subjects?types=vocabulary&levels=${levels}`, {
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                });
                const response: VocabResponse = await result.json();
                const newVocabs = vocabs.concat(response.data.map(d => d.data));
                setVocabs(newVocabs);
                nextQuestion(newVocabs);
            }
            doFetch();
        }
    }, [apiKey]);

    return (
        <PrefsContext.Provider value={{ apiKey, setApiKey, highlightVocab, setHighlightVocab }}>
            <div className="App">
                <h1>WaniKani sentence quiz</h1>
                <Question question={currentQuestion}/>
                <Answer question={currentQuestion}
                        isShowing={!isQuestionPhase}
                        showAnswer={() => {
                            setIsQuestionPhase(false);
                        }}
                        correct={() => nextQuestion(vocabs)}
                        incorrect={() => nextQuestion(vocabs)}
                />
                <Preferences />
            </div>
        </PrefsContext.Provider>
    )
}

export default App
