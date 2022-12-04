import { useContext } from "react"
import CollapsedSection from "./CollapsedSection"
import { PrefsContext } from "../context/prefs-context"
import LevelInput from "./LevelInput";

function Preferences(props: {userLevel: number}) {
    const { values, setValues } = useContext(PrefsContext);
    const { apiKey, highlightVocab, nativeLanguageCode, minVocabLevel, maxVocabLevel, isQuestionVertical } = values;

    return (
        <CollapsedSection title='Preferences' className='preferences'>
            <form>
                <label>API key</label>
                <input type='text'
                       value={apiKey}
                       onChange={e => setValues({...values, apiKey: e.target.value.trim() })}
                />
                <label>Highlight vocab</label>
                <input type='checkbox'
                       checked={highlightVocab}
                       onChange={() => setValues({...values, highlightVocab: !highlightVocab })}
                />
                <label>Vertical question</label>
                <input type='checkbox'
                       checked={isQuestionVertical}
                       onChange={() => setValues({...values, isQuestionVertical: !isQuestionVertical })}
                />
                <label>Min vocab level</label>
                <LevelInput level={minVocabLevel}
                            userLevel={props.userLevel}
                            setValue={level => setValues({...values, minVocabLevel: level})}
                />
                <label>Max vocab level</label>
                <LevelInput level={maxVocabLevel}
                            userLevel={props.userLevel}
                            setValue={level => setValues({...values, maxVocabLevel: level})}
                />
                <label>Native language code</label>
                <input type='text'
                       value={nativeLanguageCode}
                       onChange={e => setValues({...values, nativeLanguageCode: e.target.value })}
                       maxLength={2}
                />
            </form>
        </CollapsedSection>
    )
}

export default Preferences
