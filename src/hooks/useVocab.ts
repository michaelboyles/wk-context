import { useEffect, useState } from "react";
import { fetchWithKey, isValidApiKeyFormat } from "../util";
import { Vocab, VocabResponse } from "../wanikani";

export function useVocabs(minLevel: number, maxLevel: number, apiKey: string, delayInMillis: number = 5_000) {
    let [vocabs, setVocabs] = useState<Vocab[]>([]);
    useEffect(() => {
        if (isValidApiKeyFormat(apiKey) && maxLevel > 0) {
            vocabs = [];

            const levels = [...Array(maxLevel).keys()]
                .map(lvl => lvl + 1)
                .filter(lvl => lvl >= minLevel)
                .join();
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
    }, [apiKey, minLevel, maxLevel]);
    return vocabs;
}
