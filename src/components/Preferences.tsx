import { useContext } from "react"
import CollapsedSection from "./CollapsedSection"
import { PrefsContext } from "../context/prefs-context"

function Preferences() {
    const { values, setValues } = useContext(PrefsContext);
    const { apiKey, highlightVocab, nativeLanguageCode } = values;

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
