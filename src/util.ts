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
