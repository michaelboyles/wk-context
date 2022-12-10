import { fetchWithKey, isValidApiKeyFormat } from '../util'
import { useQuery } from '@tanstack/react-query'

async function fetchUserLevel(apiKey: string): Promise<number> {
    const response = await fetchWithKey('https://api.wanikani.com/v2/user', apiKey);
    if (response.ok) {
        const json = await response.json();
        return json.data.level;
    }
    throw 'Bad response ' + response.status;
}

export function useUserLevel(apiKey: string) {
    const { data, error, isLoading } = useQuery({
        queryKey: ['userLevel', apiKey],
        queryFn: () => fetchUserLevel(apiKey),
        staleTime: 5 * 60 * 1000,
        retry: false,
        enabled: isValidApiKeyFormat(apiKey)
    });

    return {
        userLevel: data ?? 0,
        isError: !isValidApiKeyFormat(apiKey) || !!error,
        isLoading
    } ;
}
