import { createContext } from "react";

export const DEFAULT_PREFS = Object.freeze({
    apiKey: '',
    highlightVocab: true,
    nativeLanguageCode: 'en'
});

export type IPrefs = {
    apiKey: string
    highlightVocab: boolean
    nativeLanguageCode: string
}

type IPrefsContext = {
    values: IPrefs
    setValues: (values: IPrefs) => void
}

export const PrefsContext = createContext<IPrefsContext>({
    values: DEFAULT_PREFS,
    setValues: () => {}
});
