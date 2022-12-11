import { DEFAULT_SETTINGS, ISettings } from "./context/settings-context";

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

export function saveCookie(data: ISettings) {
    document.cookie = 'prefs=' + JSON.stringify(data) + '; expires=Tue, 19 Jan 2038 03:14:07 UTC';
}

export function readCookie(): ISettings {
    const cookiePrefs = document.cookie.split('; ')
        .map(prop => prop.split('='))
        .find(kvPair => kvPair[0] === 'prefs')?.[1];
    if (!cookiePrefs) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(cookiePrefs);
    if (typeof parsed !== 'object') {
        console.error(`Saved settings were ${typeof parsed} instead of object`);
        return DEFAULT_SETTINGS;
    }
    return {
        ...DEFAULT_SETTINGS, ...parsed
    };
}

// Get all the minimal items in the array, subject to the given comparator
export function minimums<T>(items: T[], compare: (a: T, b: T) => number): T[]  {
    let currentMins: T[] = [];
    items.forEach(item => {
        if (currentMins.length === 0) {
            currentMins.push(item);
        }
        else {
            const result = compare(item, currentMins[0]);
            if (result < 0) {
                currentMins = [item];
            }
            else if (result === 0) {
                currentMins.push(item);
            }
        }
    });
    return currentMins;
}

export function maximums<T>(items: T[], compare: (a: T, b: T) => number): T[]  {
    return minimums(items, (a, b) => compare(b, a));
}
