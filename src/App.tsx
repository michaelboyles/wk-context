import { useContext, useEffect, useRef, useState } from 'react'
import './App.scss'
import Preferences from './components/Preferences';
import { PrefsContext } from './context/prefs-context';
import { ContextSentence, Vocab } from './wanikani';
import { IoMdChatboxes } from 'react-icons/io';
import { GoCheck, GoX } from 'react-icons/go';
import { SiGoogletranslate } from 'react-icons/si';
import { useSelectedText } from './hooks/useSelectedText';
import { If, Else } from 'jsx-conditionals';
import { Jisho } from './icons/Jisho';
import { clearTextSelection, randomInt } from './util';
import { HighlightedSentence } from './components/HighlightedSentence';
import { useUserLevel } from './hooks/useUserLevel';
import Welcome from './components/Welcome';
import { useCookie } from './hooks/useCookie';
import { useVocabs } from './hooks/useVocab';
import { GiSadCrab } from 'react-icons/gi';

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
                    <li><a href={props.question.vocab.document_url} target='_blank'>View { props.question.vocab.characters } in <GiSadCrab className='crab' /></a></li>
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

function Stats(props: {correct: number, wrong: number}) {
    const total = props.correct + props.wrong;
    const percentage = total === 0 ? 100 : Math.floor(props.correct / total * 100);
    return (
        <section className='stats'>
            { `${props.correct} / ${total} (${percentage}%)` }
        </section>
    )
}

function App() {
    const [prefs, setPrefs] = useCookie();

    const userLevel = useUserLevel(prefs.apiKey);
    const vocabs = useVocabs(
        prefs.minVocabLevel === 'mine' ? userLevel : prefs.minVocabLevel,
        prefs.maxVocabLevel === 'mine' ? userLevel : prefs.maxVocabLevel,
        prefs.apiKey
    );
    const [isQuestionPhase, setIsQuestionPhase] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<TQuestion|null>(null);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);

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
            <div className='content'>
                <If condition={prefs.apiKey.length >= 1}>
                    <div className={'App ' + (prefs.isQuestionVertical ? 'vertical' : 'horizontal')}>
                        <h1>WaniKani sentence quiz</h1>
                        <Question question={currentQuestion}/>
                        <Answer question={currentQuestion}
                                isShowing={!isQuestionPhase}
                                showAnswer={() => {
                                    setIsQuestionPhase(false);
                                }}
                                correct={() => {
                                    setCorrect(correct + 1);
                                    nextQuestion();
                                }}
                                incorrect={() => {
                                    setWrong(wrong + 1);
                                    nextQuestion();
                                }}
                        />
                        <Stats correct={correct} wrong={wrong} />
                        <Preferences userLevel={userLevel} />
                    </div>
                </If>
                <Else>
                    <Welcome onKeyEntered={apiKey => setPrefs({...prefs, apiKey})} />
                </Else>
            </div>
            <footer>
                <a href='https://github.com/michaelboyles/wk-sentences'>Contribute on GitHub</a>
                <span>Content is © WaniKani</span>
            </footer>
        </PrefsContext.Provider>
    )
}

export default App
