import { useCallback, useEffect } from 'react'
import { fetchWithKey, isValidApiKeyFormat } from '../util'
import { AssignmentsResponse, getIdSet, SRS_LEVELS } from '../wanikani'
import { useInfiniteQuery } from '@tanstack/react-query'
import _ from 'lodash'

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

export default function useSubjectIds(minSrsStage: number, apiKey: string, delayInMillis: number = 5_000) {

    const { isLoading, data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['assignments', minSrsStage, apiKey],
        queryFn: ({pageParam}) => fetchAssignments(pageParam ?? getUrl(minSrsStage), apiKey),
        getNextPageParam: lastPage => lastPage.pages.next_url || undefined,
        staleTime: 5 * 60 * 1000,
        enabled: isValidApiKeyFormat(apiKey)
    });
    const debouncedNextPage = useCallback(_.debounce(fetchNextPage, delayInMillis), [fetchNextPage]);
    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage) {
            debouncedNextPage();
        }
    }, [hasNextPage, isFetchingNextPage]);

    const subjectIds = data?.pages?.flatMap(resp => resp.data).map(datum => datum.data.subject_id) ?? [];
    return { isLoading, subjectIds };
}
