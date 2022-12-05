import { useEffect, useState } from "react";
import { fetchWithKey, isValidApiKeyFormat } from "../util";
import { AssignmentsResponse, SRS_LEVELS, Vocab, VocabResponse } from "../wanikani";

interface VocabWithId extends Vocab {
    id: number
}

function getIdSet(min: number, max: number): string {
    return [...Array(max).keys()]
        .map(id => id + 1)
        .filter(id => id >= min)
        .join();
}

const INITIAL_VOCABS: VocabWithId[] = [];
const INITIAL_SUBJECT_IDS: number[] = [];

export function useVocabs(minLevel: number, maxLevel: number, minSrsStage: number, apiKey: string, delayInMillis: number = 5_000) {
    let [vocabs, setVocabs] = useState<VocabWithId[]>(INITIAL_VOCABS);
    let [relevantSubjectIds, setRelevantSubjectIds] = useState<number[]>(INITIAL_SUBJECT_IDS);

    useEffect(() => {
        if (maxLevel <= 0 || !isValidApiKeyFormat(apiKey)) return;
        vocabs = [];

        const fetchVocab = async (url: string, vocabs: VocabWithId[]) => {
            const result = await fetchWithKey(url, apiKey);
            if (result.ok) {
                const response: VocabResponse = await result.json();
                const newVocabs = vocabs.concat(
                    response.data.map(d => {
                        return { id: d.id, ...d.data };
                    })
                );
                if (response.pages.next_url) {
                    const nextUrl = response.pages.next_url;
                    setTimeout(() => fetchVocab(nextUrl, newVocabs), delayInMillis);
                }
                setVocabs(newVocabs);
            }
        }
        const levels = getIdSet(minLevel, maxLevel);
        fetchVocab(`https://api.wanikani.com/v2/subjects?types=vocabulary&levels=${levels}`, vocabs);
    }, [apiKey, minLevel, maxLevel]);

    useEffect(() => {
        if (minSrsStage < 1 || !isValidApiKeyFormat(apiKey)) return;
        relevantSubjectIds = [];

        const fetchAssignments = async (url: string, relevantSubjectIds: number[]) => {
            const result = await fetchWithKey(url, apiKey);
            if (result.ok) {
                const response: AssignmentsResponse = await result.json();
                const newSubjectIds = relevantSubjectIds.concat(response.data.map(d => d.data.subject_id));
                if (response.pages.next_url) {
                    const nextUrl = response.pages.next_url;
                    setTimeout(() => fetchAssignments(nextUrl, newSubjectIds), delayInMillis);
                }
                setRelevantSubjectIds(newSubjectIds);
            }
        }
        const stages = getIdSet(minSrsStage, SRS_LEVELS.burned.level);
        fetchAssignments(`https://api.wanikani.com/v2/assignments?types=vocabulary&srs_stages=${stages}`, relevantSubjectIds);
    }, [apiKey, minSrsStage]);
    
    return {
        vocabs: (minSrsStage < 1) ? vocabs : vocabs.filter(vocab => relevantSubjectIds.includes(vocab.id)),
        isVocabLoading: vocabs === INITIAL_VOCABS || (minSrsStage >= 1 && relevantSubjectIds === INITIAL_SUBJECT_IDS)
    }
}
