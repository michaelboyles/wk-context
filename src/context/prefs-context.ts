import { createContext, useState } from "react";

type IPrefs = {
    apiKey: string
    highlightVocab: boolean
    nativeLanguageCode: string
}

type IPrefsContext = {
    values: IPrefs
    setValues: (values: IPrefs) => void
}

export const PrefsContext = createContext<IPrefsContext>({
    values: {
        apiKey: '',
        highlightVocab: true,
        nativeLanguageCode: 'en'
    },
    setValues: () => {}
});
