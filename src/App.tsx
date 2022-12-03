import { useContext, useEffect, useRef, useState } from 'react'
import './App.scss'
import Preferences from './components/Preferences';
import { PrefsContext } from './context/prefs-context';
import { ContextSentence, Vocab, VocabResponse } from './wanikani';
import { GoCheck, GoX } from 'react-icons/go';
import { SiGoogletranslate } from 'react-icons/si';
import { useSelectedText } from './hooks/useSelectedText';
import { If, Else } from 'jsx-conditionals';
import { Jisho } from './icons/Jisho';
import { clearTextSelection, randomInt } from './util';
import { HighlightedSentence } from './components/HighlightedSentence';

function Question(props: {question: TQuestion|null}) {
    const answerRef = useRef<any>();
    const { values: { highlightVocab, nativeLanguageCode } } = useContext(PrefsContext);
    const { clientRect, textContent } = useSelectedText(answerRef);

    if (!props.question) return null;
    return (
        <>
            <If condition={!!clientRect && (textContent?.length ?? 0) > 1}>
                <div className='popup' style={ {top: clientRect!.y, left: clientRect!.x }}>
                    <a className='jisho' target='_blank'
                       href={'https://jisho.org/search/' + textContent}>
                        <Jisho /> Jisho
                    </a>
                    <a className='gtranslate' target='_blank'
                       href={`https://translate.google.com/?sl=ja&tl=${nativeLanguageCode}&text=${textContent}`}>
                        <SiGoogletranslate /> Google
                    </a>
                </div>
            </If>
            <p className='sentence ja' ref={answerRef}>
                <If condition={highlightVocab}>
                    <HighlightedSentence word={props.question.vocab.characters} sentence={props.question.sentence.ja} />
                </If>
                <Else>{props.question.sentence.ja}</Else>
            </p>
        </>
    );
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

    const [prefs, setPrefs] = useState({
        apiKey: 'a146a449-147b-4b36-bae2-a1bbe706e6f8',
        highlightVocab: true,
        nativeLanguageCode: 'en'
    });

    const [vocabs, setVocabs] = useState<Vocab[]>([]);
    const [isQuestionPhase, setIsQuestionPhase] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<TQuestion|null>(null);

    const nextQuestion = (vocabs: Vocab[]) => {
        while (true) {
            const randomVocabIdx = randomInt(vocabs.length);
            const vocab = vocabs[randomVocabIdx];
            if (vocab?.context_sentences?.length) {
                clearTextSelection();
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
        if (prefs.apiKey.length == 36) {
            const doFetch = async () => {
                const levels = [...Array(userLevel).keys()].join();
                const result = await fetch(
                    `https://api.wanikani.com/v2/subjects?types=vocabulary&levels=${levels}`, {
                    headers: {
                        'Authorization': `Bearer ${prefs.apiKey}`
                    }
                });
                const response: VocabResponse = await result.json();
                const newVocabs = vocabs.concat(response.data.map(d => d.data));
                setVocabs(newVocabs);
                nextQuestion(newVocabs);
            }
            doFetch();
        }
    }, [prefs.apiKey]);

    return (
        <PrefsContext.Provider value={{ values: prefs, setValues: setPrefs }}>
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
