import { CSSProperties, useContext, useEffect, useRef, useState } from 'react'
import Settings from './components/Settings'
import { SettingsContext } from './context/settings-context'
import { ContextSentence, Vocab } from './wanikani'
import { IoMdChatboxes } from 'react-icons/io'
import { GoCheck, GoX } from 'react-icons/go'
import { SiGoogletranslate } from 'react-icons/si'
import { If, Else, ElseIf } from 'jsx-conditionals'
import { Jisho } from './icons/Jisho'
import { clearTextSelection, maximums, minimums, randomInt } from './util'
import { HighlightedSentence } from './components/HighlightedSentence'
import { useUserLevel } from './hooks/useUserLevel'
import Welcome from './components/Welcome'
import { useVocabs } from './hooks/useVocab'
import { GiCrabClaw, GiSadCrab } from 'react-icons/gi'
import { useTextSelection } from './hooks/useTextSelection'
import './WkContext.scss'

function getPopupStyle(isVertical: boolean, selection: DOMRect[]): CSSProperties {
    if (!selection) {
        return {};
    }
    if (isVertical) {
        const rightMostRects = maximums(selection, (a, b) => a.x - b.x);
        if (rightMostRects.length === 0) {
            return {};
        }

        const top = Math.min(...rightMostRects.map(rect => rect.y));
        const left = rightMostRects[0].right;
        return { top, left }
    }
    else {
        const highestRects = minimums(selection, (a, b) => a.y - b.y);
        if (highestRects.length === 0) {
            return {};
        }
        const clientWidth = document.body.clientWidth;
        const top = highestRects[0].y;
        const left = Math.min(...highestRects.map(rect => rect.left));

        if ((clientWidth - left) < 130) {
            const right = clientWidth - Math.max(...highestRects.map(rect => rect.right));
            return { top, right }
        }
        return { top, left }
    }
}

function Question(props: {question?: TQuestion}) {
    const answerRef = useRef<any>();
    const { values: { highlightVocab, nativeLanguageCode, isQuestionVertical } } = useContext(SettingsContext);
    const { clientRects, textContent } = useTextSelection(answerRef.current);

    if (!props.question) return null;
    return (
        <>
            <If condition={clientRects && textContent?.length}>
                <div className='popup' style={getPopupStyle(isQuestionVertical, clientRects)}>
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
            <div ref={answerRef}>
                <p className='sentence ja'>
                    <If condition={highlightVocab}>
                        <HighlightedSentence word={props.question.vocab.characters} sentence={props.question.sentence.ja} />
                    </If>
                    <Else>{props.question.sentence.ja}</Else>
                </p>
            </div>
        </>
    );
}

type TQuestion = {
    sentence: ContextSentence
    vocab: Vocab
}

type AnswerProps = {
    question?: TQuestion
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
                    <li><a href={props.question.vocab.document_url} target='_blank'>View <span className='ja'>{props.question.vocab.characters}</span> in <GiSadCrab className='crab' /></a></li>
                </ul>
            </div>
        );
    }
    return (
        <div className='answer'>
            <button className='show-answer' onClick={props.showAnswer}><IoMdChatboxes /> Show Answer</button>
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

function WkContext() {
    const { values: settings, setValues: setSettings } = useContext(SettingsContext);

    const { userLevel, isError, isLoading: isLevelLoading } = useUserLevel(settings.apiKey);
    const { vocabs, isVocabLoading } = useVocabs(
        settings.minVocabLevel === 'mine' ? userLevel : settings.minVocabLevel,
        settings.maxVocabLevel === 'mine' ? userLevel : settings.maxVocabLevel,
        settings.minSrsStage,
        settings.apiKey
    );
    const [isQuestionPhase, setIsQuestionPhase] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState<TQuestion|undefined>(undefined);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);

    const nextQuestion = () => {
        if (vocabs.length < 1) {
            setCurrentQuestion(undefined);
        }
        else {
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
    }

    useEffect(() => {
        if (!currentQuestion) nextQuestion();
    }, [vocabs.length]);

    return (
        <>
            <h1><GiCrabClaw /><span className='app-name'>WKContext</span></h1>
            <div className='content'>
                <If condition={settings.apiKey.length}>
                    <div className={'app ' + (settings.isQuestionVertical ? 'vertical' : 'horizontal')}>
                        <Stats correct={correct} wrong={wrong} />
                        <If condition={currentQuestion}>
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
                        </If>
                        <ElseIf condition={isError}>
                            <div className='status'>Failed to query WaniKani. If your API key is correct then the site may be down</div>
                        </ElseIf>
                        <ElseIf condition={isLevelLoading || isVocabLoading || (!currentQuestion && vocabs.length > 0)}>
                            <div className='status'>Loading...</div>
                        </ElseIf>
                        <Else>
                            <div className='status'>No questions match your current settings</div>
                        </Else>
                    </div>
                </If>
                <Else>
                    <Welcome onKeyEntered={apiKey => setSettings({...settings, apiKey})} />
                </Else>
            </div>
            <If condition={settings.apiKey.length}>
                <Settings userLevel={userLevel} />
            </If>
            <footer>
                <a href='https://github.com/michaelboyles/wk-context'>Contribute on GitHub</a>
                <span>Content is © WaniKani</span>
            </footer>
        </>
    )
}

export default WkContext
