export type VocabResponse = Response<Vocab>;

export type AssignmentsResponse = Response<Assignment>;

export interface Response<T> {
    object:          string;
    url:             string;
    pages:           Pages;
    total_count:     number;
    data_updated_at: Date;
    data:            Datum<T>[];
}

export interface Datum<T> {
    id:              number;
    object:          string;
    url:             string;
    data_updated_at: Date;
    data:            T;
}

export interface Vocab {
    created_at:                  Date;
    level:                       number;
    slug:                        string;
    hidden_at:                   null;
    document_url:                string;
    characters:                  string;
    meanings:                    Meaning[];
    auxiliary_meanings:          AuxiliaryMeaning[];
    readings:                    Reading[];
    parts_of_speech:             string[];
    component_subject_ids:       number[];
    meaning_mnemonic:            string;
    reading_mnemonic:            string;
    context_sentences:           ContextSentence[];
    pronunciation_audios:        PronunciationAudio[];
    lesson_position:             number;
    spaced_repetition_system_id: number;
}

export type SubjectType = 'radical' | 'kanji' | 'vocabulary';

export interface Assignment {
    created_at:     Date;
    subject_id:     number;
    subject_type:   SubjectType;
    srs_stage:      number,
    unlocked_at:    Date | null;
    started_at:     Date | null;
    passed_at:      Date | null;
    burned_at:      Date | null;
    available_at:   Date | null;
    resurrected_at: Date | null;
}

export interface AuxiliaryMeaning {
    type:    string;
    meaning: string;
}

export interface ContextSentence {
    en: string;
    ja: string;
}

export interface Meaning {
    meaning:         string;
    primary:         boolean;
    accepted_answer: boolean;
}

export interface PronunciationAudio {
    url:          string;
    metadata:     Metadata;
    content_type: string;
}

export interface Metadata {
    gender:            string;
    source_id:         number;
    pronunciation:     string;
    voice_actor_id:    number;
    voice_actor_name:  string;
    voice_description: string;
}

export interface Reading {
    primary:         boolean;
    reading:         string;
    accepted_answer: boolean;
}

export interface Pages {
    per_page:     number;
    next_url:     string | null;
    previous_url: string | null;
}

export const SRS_LEVELS = Object.freeze({
    any: {
        level: 0,
        label: 'Any'
    },
    levelOne: {
        level: 1,
        label: 'Level 1'
    },
    levelTwo: {
        level: 2,
        label: 'Level 2'
    },
    levelThree: {
        level: 3,
        label: 'Level 3'
    },
    levelFour: {
        level: 4,
        label: 'Level 4'
    },
    apprentice: {
        level: 5,
        label: 'Apprentice'
    },
    guru: {
        level: 6,
        label: 'Guru'
    },
    master: {
        level: 7,
        label: 'Master'
    },
    enlightened: {
        level: 8,
        label: 'Enlightened'
    },
    burned: {
        level: 9,
        label: 'Burned'
    }
});
