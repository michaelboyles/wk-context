import { useEffect, useState } from 'react';
import { IPrefs } from '../context/prefs-context';
import { readCookie, saveCookie } from '../util';

export function useCookie(): [IPrefs, (prefs: IPrefs) => void] {
    const [prefs, setPrefs] = useState(readCookie);
    const setAndSavePrefs = (prefs: IPrefs) => {
        saveCookie(prefs);
        setPrefs(prefs);
    }

    // Chrome only allows cookies to live 2 years. So if you're using the app for longer
    // than that but never updating prefs then everything would be lost after that time.
    // This just touches the prefs when you log in to the same value they already have in
    // order to refresh the timestamp
    useEffect(() => {
        saveCookie(prefs);
    }, []);

    return [prefs, setAndSavePrefs];
}
