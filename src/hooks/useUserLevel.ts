import { useEffect, useState } from 'react';
import { fetchWithKey, isValidApiKeyFormat } from '../util';

export function useUserLevel(apiKey: string): number {
    const [level, setLevel] = useState(0);

    useEffect(() => {
        if (isValidApiKeyFormat(apiKey)) {
            const doFetch = async () => {
                const response = await fetchWithKey('https://api.wanikani.com/v2/user', apiKey);
                const json = await response.json();
                setLevel(json.data.level);
            }
            doFetch();
        }
    }, [apiKey]);

    return level;
}
