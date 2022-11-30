import { useEffect, useState } from 'react'
import './App.css'
import { ContextSentence, Vocab, VocabResponse } from './WaniKani';

function randomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function Question(props: {question: TQuestion|null}) {
    if (!props.question) return null;
    const word = props.question.vocab.characters;
    const regex = new RegExp('(' + word + ')', "g");
    const fragments = props.question.sentence.ja.split(regex);
    return <p>{
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
            <>
                <div>{ props.question.sentence.en }</div>
                <div>
                    <button onClick={props.correct}>Right</button>
                    <button onClick={props.incorrect}>Wrong</button>
                </div>
            </>
        );
    }
    return <button onClick={props.showAnswer}>Show answer</button>;
}

function App() {
    const userLevel = 2; // TODO query this

    const [apiKey, setApiKey] = useState('');
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
        <div className="App">
            <h1>WaniKani sentence quiz</h1>
            <input type='text' onChange={e => setApiKey(e.target.value)} />
            <div className="card">
                Key is {apiKey}
            </div>
            <Question question={currentQuestion}/>
            <Answer question={currentQuestion}
                    isShowing={!isQuestionPhase}
                    showAnswer={() => {
                        setIsQuestionPhase(false);
                    }}
                    correct={() => nextQuestion(vocabs)}
                    incorrect={() => nextQuestion(vocabs)}
            />
        </div>
    )
}

export default App
