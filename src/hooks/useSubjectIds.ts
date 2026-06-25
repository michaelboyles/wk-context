import { useCallback, useEffect } from 'react'
import { debounce, fetchWithKey, isValidApiKeyFormat } from '../util'
import { type AssignmentsResponse, getIdSet, SRS_LEVELS } from '../wanikani'
import { useInfiniteQuery } from '@tanstack/react-query'

export function useSubjectIds(minSrsStage: number, apiKey: string, delayInMillis: number = 5_000) {
    const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['assignments', minSrsStage, apiKey],
        initialPageParam: getUrl(minSrsStage),
        queryFn: ({ pageParam }) => fetchAssignments(pageParam, apiKey),
        getNextPageParam: lastPage => lastPage.pages.next_url || undefined,
        staleTime: 5 * 60 * 1000,
        enabled: isValidApiKeyFormat(apiKey)
    });
    const debouncedNextPage = useCallback(debounce(fetchNextPage, delayInMillis), [fetchNextPage]);
    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage) {
            debouncedNextPage();
        }
    }, [hasNextPage, isFetchingNextPage]);

    const subjectIds = data?.pages?.flatMap(resp => resp.data).map(datum => datum.data.subject_id) ?? [];
    return { isLoading, subjectIds };
}

async function fetchAssignments(url: string, apiKey: string): Promise<AssignmentsResponse> {
    const result = await fetchWithKey(url, apiKey);
    if (result.ok) {
        return await result.json() as AssignmentsResponse;
    }
    throw 'Error code ' + result.status;
}

function getUrl(minSrsStage: number) {
    const stages = getIdSet(minSrsStage, SRS_LEVELS.burned.level);
    return `https://api.wanikani.com/v2/assignments?types=vocabulary&srs_stages=${stages}`;
}
