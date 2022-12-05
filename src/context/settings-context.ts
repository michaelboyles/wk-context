import { createContext } from "react";
import { SRS_LEVELS } from "../wanikani";

export type Level = number | 'mine';

export type ISettings = {
    apiKey: string
    highlightVocab: boolean
    nativeLanguageCode: string
    minVocabLevel: Level
    maxVocabLevel: Level
    isQuestionVertical: boolean
    minSrsStage: number
}

type ISettingsContext = {
    values: ISettings
    setValues: (values: ISettings) => void
}

export const DEFAULT_SETTINGS: ISettings = Object.freeze({
    apiKey: '',
    highlightVocab: true,
    nativeLanguageCode: 'en',
    minVocabLevel: 1,
    maxVocabLevel: 'mine',
    isQuestionVertical: false,
    minSrsStage: SRS_LEVELS.apprentice.level
});

export const SettingsContext = createContext<ISettingsContext>({
    values: DEFAULT_SETTINGS,
    setValues: () => {}
});
