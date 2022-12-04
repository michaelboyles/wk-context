import { useEffect, useState } from "react";
import { fetchWithKey, isValidApiKeyFormat } from "../util";
import { Vocab, VocabResponse } from "../wanikani";

export function useVocabs(userLevel: number, apiKey: string, delayInMillis: number = 5_000) {
    let [vocabs, setVocabs] = useState<Vocab[]>([]);
    useEffect(() => {
        if (isValidApiKeyFormat(apiKey) && userLevel > 0) {
            vocabs = [];

            const levels = [...Array(userLevel).keys()].map(lvl => lvl + 1).join();
            const url = `https://api.wanikani.com/v2/subjects?types=vocabulary&levels=${levels}`;

            const doFetch = async (url: string, vocabs: Vocab[]) => {
                const result = await fetchWithKey(url, apiKey);
                const response: VocabResponse = await result.json();
                const newVocabs = vocabs.concat(response.data.map(d => d.data));
                if (response.pages.next_url) {
                    setTimeout(() => doFetch(response.pages.next_url, newVocabs), delayInMillis);
                }
                setVocabs(newVocabs);
            }
            doFetch(url, vocabs);
        }
    }, [apiKey, userLevel]);
    return vocabs;
}
