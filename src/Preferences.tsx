import { useContext } from "react"
import CollapsedSection from "./CollapsedSection"
import { PrefsContext } from "./prefs-context"

function Preferences() {
    const { apiKey, setApiKey, highlightVocab, setHighlightVocab } = useContext(PrefsContext);

    return (
        <CollapsedSection title='Preferences' className='preferences'>
            <>
                <label>
                    API key
                    <input type='text'
                           value={apiKey}
                           onChange={e => setApiKey(e.target.value)}
                    />
                </label>
                <label>
                    Highlight vocab
                    <input type='checkbox'
                           checked={highlightVocab}
                           onChange={() => setHighlightVocab(!highlightVocab)}
                    />
                </label>
            </>
        </CollapsedSection>
    )
}

export default Preferences
