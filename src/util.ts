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
