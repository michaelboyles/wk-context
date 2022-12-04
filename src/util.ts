import { DEFAULT_PREFS, IPrefs } from "./context/prefs-context";

export function clearTextSelection() {
    var sel = window.getSelection ? window.getSelection() : (document as any).selection;
    if (sel) {
        if (sel.removeAllRanges) {
            sel.removeAllRanges();
        } else if (sel.empty) {
            sel.empty();
        }
    };
}

export function randomInt(max: number) {
    return Math.floor(Math.random() * max);
}

export function fetchWithKey(url: string, apiKey: string) {
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    }) 
}

export function isValidApiKeyFormat(possibleToken: string) {
    return /^[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}$/g.test(possibleToken);
}

export function saveCookie(data: IPrefs) {
    document.cookie = 'prefs=' + JSON.stringify(data) + '; expires=Tue, 19 Jan 2038 03:14:07 UTC';
}

export function readCookie(): IPrefs {
    const cookiePrefs = document.cookie.split('; ')
        .map(prop => prop.split('='))
        .find(kvPair => kvPair[0] === 'prefs')?.[1];
    if (!cookiePrefs) return DEFAULT_PREFS;
    const parsed = JSON.parse(cookiePrefs);
    if (typeof parsed !== 'object') {
        console.error(`Saved preferences were ${typeof parsed} instead of object`);
        return DEFAULT_PREFS;
    }
    return {
        ...DEFAULT_PREFS, ...parsed
    };
}
