import { useEffect, useState } from 'react';
import { fetchWithKey } from '../util';

export function useUserLevel(apiKey: string): number {
    const [level, setLevel] = useState(0);

    useEffect(() => {
        const doFetch = async () => {
            const response = await fetchWithKey('https://api.wanikani.com/v2/user', apiKey);
            const json = await response.json();
            console.log('set level to ', json.data.level)
            setLevel(json.data.level);
        }
        doFetch();
    }, [apiKey]);

    return level;
}
