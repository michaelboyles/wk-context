import { createContext } from "react";

export type Level = number | 'mine';

export type IPrefs = {
    apiKey: string
    highlightVocab: boolean
    nativeLanguageCode: string
    minVocabLevel: Level
    maxVocabLevel: Level
    isQuestionVertical: boolean
}

type IPrefsContext = {
    values: IPrefs
    setValues: (values: IPrefs) => void
}

export const DEFAULT_PREFS: IPrefs = Object.freeze({
    apiKey: '',
    highlightVocab: true,
    nativeLanguageCode: 'en',
    minVocabLevel: 1,
    maxVocabLevel: 'mine',
    isQuestionVertical: false
});

export const PrefsContext = createContext<IPrefsContext>({
    values: DEFAULT_PREFS,
    setValues: () => {}
});
