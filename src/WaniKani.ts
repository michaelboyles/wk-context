export interface VocabResponse {
    object:          string;
    url:             string;
    pages:           Pages;
    total_count:     number;
    data_updated_at: Date;
    data:            Datum[];
}

export interface Datum {
    id:              number;
    object:          string;
    url:             string;
    data_updated_at: Date;
    data:            Vocab;
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
    next_url:     string;
    previous_url: null;
}
