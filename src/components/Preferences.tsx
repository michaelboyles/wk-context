import { useContext } from "react"
import CollapsedSection from "./CollapsedSection"
import { PrefsContext } from "../context/prefs-context"

function Preferences() {
    const { apiKey, setApiKey, highlightVocab, setHighlightVocab } = useContext(PrefsContext);

    return (
        <CollapsedSection title='Preferences' className='preferences'>
            <form>
                <label>API key</label>
                <input type='text'
                       value={apiKey}
                       onChange={e => setApiKey(e.target.value)}
                />
                <label>Highlight vocab</label>
                <input type='checkbox'
                       checked={highlightVocab}
                       onChange={() => setHighlightVocab(!highlightVocab)}
                />
            </form>
        </CollapsedSection>
    )
}

export default Preferences
