import { useCallback, useEffect } from 'react'
import { fetchWithKey, isValidApiKeyFormat } from '../util'
import { EMPTY_RESPONSE, getIdSet, Vocab, VocabResponse } from '../wanikani'
import { useInfiniteQuery } from '@tanstack/react-query'
import useSubjectIds from './useSubjectIds'
import _ from 'lodash'
import useDebouncedValue from './useDebouncedValue'

function getVocabUrl(minLevel: number, maxLevel: number) {
    if (maxLevel <= 0) return '';
    const levels = getIdSet(minLevel, maxLevel);
    return `https://api.wanikani.com/v2/subjects?types=vocabulary&levels=${levels}`;
}

async function fetchVocab(url: string, apiKey: string): Promise<VocabResponse> {
    if (!isValidApiKeyFormat(apiKey)) {
        throw 'Invalid API Key' + apiKey;
    }
    if (url.length === 0) return Promise.resolve(EMPTY_RESPONSE);

    const result = await fetchWithKey(url, apiKey);
    if (result.ok) {
        return await result.json() as VocabResponse;
    }
    throw 'Error code ' + result.status;
}

export function useVocabs(minLevel: number, maxLevel: number, minSrsStage: number, apiKey: string, delayInMillis: number = 5_000) {
    const dMinLevel = useDebouncedValue(minLevel);
    const dMaxLevel = useDebouncedValue(maxLevel);

    const { isLoading: isVocabLoading, data: vocabResponses, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['vocab', dMinLevel, dMaxLevel],
        queryFn: ({pageParam}) => fetchVocab(pageParam ?? getVocabUrl(dMinLevel, dMaxLevel), apiKey),
        getNextPageParam: lastPage => lastPage.pages.next_url || undefined,
        staleTime: 5 * 60 * 1000
    });

    const debouncedFetchNextPage = useCallback(_.debounce(fetchNextPage, delayInMillis), [fetchNextPage]);
    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage) {
            debouncedFetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage]);

    const {subjectIds, isLoading: subjectIdsLoading } = useSubjectIds(minSrsStage, apiKey);
    
    const vocabs: Vocab[] = vocabResponses?.pages?.flatMap(a => a.data)
        .filter(a => minSrsStage < 1 ? true : subjectIds.includes(a.id))
        .map(a => a.data) ?? [];
    return {
        vocabs,
        isVocabLoading: isVocabLoading || (minSrsStage >= 1 && subjectIdsLoading)
    }
}
