import { useEffect, useState } from 'react';
import { fetchWithKey, isValidApiKeyFormat } from '../util';

export function useUserLevel(apiKey: string) {
    const [userLevel, setUserLevel] = useState(0);
    const [responseCode, setResponseCode] = useState(200);

    useEffect(() => {
        if (isValidApiKeyFormat(apiKey)) {
            const doFetch = async () => {
                const response = await fetchWithKey('https://api.wanikani.com/v2/user', apiKey);
                if (response.ok) {
                    const json = await response.json();
                    setUserLevel(json.data.level);
                }
                setResponseCode(response.status);
            }
            doFetch();
        }
        else {
            setResponseCode(500);
        }
    }, [apiKey]);

    return { userLevel, responseCode } ;
}
