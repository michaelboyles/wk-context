import { createContext } from "react";

type IPrefsContext = {
    apiKey: string
    setApiKey: (key: string) => void
    highlightVocab: boolean
    setHighlightVocab: (value: boolean) => void
}

export const PrefsContext = createContext<IPrefsContext>({
    apiKey: '',
    setApiKey: () => {},
    highlightVocab: true,
    setHighlightVocab: () => {}
});
