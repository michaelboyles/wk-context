import { useContext, useEffect, useRef, useState } from 'react'
import './App.scss'
import Preferences from './components/Preferences';
import { PrefsContext } from './context/prefs-context';
import { ContextSentence, Vocab, VocabResponse } from './wanikani';
import { IoMdChatboxes } from 'react-icons/io';
import { GoCheck, GoX } from 'react-icons/go';
import { SiGoogletranslate } from 'react-icons/si';
import { useSelectedText } from './hooks/useSelectedText';
import { If, Else } from 'jsx-conditionals';
import { Jisho } from './icons/Jisho';
import { clearTextSelection, fetchWithKey, isValidApiKeyFormat, randomInt, readCookie, saveCookie } from './util';
import { HighlightedSentence } from './components/HighlightedSentence';
import { useUserLevel } from './hooks/useUserLevel';
import Welcome from './components/Welcome';
import { useCookie } from './hooks/useCookie';
import { useVocabs } from './hooks/useVocab';

function Question(props: {question: TQuestion|null}) {
    const answerRef = useRef<any>();
    const { values: { highlightVocab, nativeLanguageCode } } = useContext(PrefsContext);
    const { clientRect, textContent } = useSelectedText(answerRef);

    if (!props.question) return null;
    return (
        <>
            <If condition={!!clientRect && (textContent?.length ?? 0) >= 1}>
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
            <button className='showAnswer' onClick={props.showAnswer}><IoMdChatboxes /> Show Answer</button>
        </div>
    );
}

function App() {
    const [prefs, setPrefs] = useCookie();

    const userLevel = useUserLevel(prefs.apiKey);
    const vocabs = useVocabs(userLevel, prefs.apiKey);
    const [isQuestionPhase, setIsQuestionPhase] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<TQuestion|null>(null);

    const nextQuestion = () => {
        if (vocabs.length < 1) return;
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
        if (!currentQuestion) nextQuestion();
    }, [vocabs.length]);

    return (
        <PrefsContext.Provider value={{ values: prefs, setValues: setPrefs }}>
            <If condition={prefs.apiKey.length >= 1}>
                <div className="App">
                    <h1>WaniKani sentence quiz</h1>
                    <Question question={currentQuestion}/>
                    <Answer question={currentQuestion}
                            isShowing={!isQuestionPhase}
                            showAnswer={() => {
                                setIsQuestionPhase(false);
                            }}
                            correct={nextQuestion}
                            incorrect={nextQuestion}
                    />
                    <Preferences />
                </div>
            </If>
            <Else>
                <Welcome onKeyEntered={apiKey => setPrefs({...prefs, apiKey})} />
            </Else>
        </PrefsContext.Provider>
    )
}

export default App
