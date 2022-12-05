import { useContext } from "react"
import CollapsedSection from "./CollapsedSection"
import { SettingsContext } from "../context/settings-context"
import LevelInput from "./LevelInput";
import { SRS_LEVELS } from "../wanikani";

function Settings(props: {userLevel: number}) {
    const { values, setValues } = useContext(SettingsContext);
    const { apiKey, highlightVocab, nativeLanguageCode, minVocabLevel, maxVocabLevel, isQuestionVertical, minSrsStage } = values;

    return (
        <CollapsedSection title='Settings' className='settings'>
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
                <label>Min SRS stage</label>
                <select value={minSrsStage} onChange={e => setValues({...values, minSrsStage: Number(e.target.value) })}>{
                    Object.values(SRS_LEVELS).map(
                        value => <option key={value.level} value={value.level}>{value.label}</option>
                    )
                }
                </select>
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

export default Settings
