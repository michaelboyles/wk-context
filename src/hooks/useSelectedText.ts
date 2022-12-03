import React from 'react';
import { useTextSelection } from 'use-text-selection';

type Selection = ReturnType<typeof useTextSelection>;

type Area = {
    top: number
    bottom: number
    left: number
    right: number
}

const EMPTY_SELECTION: Selection = Object.freeze({
    clientRect: undefined,
    isCollapsed: true,
    textContent: ''
});

function isAreaInsideOtherArea(inner: Area, outer: Area) {
    const lenienceInPx = 10;
    return inner.left >= (outer.left - lenienceInPx)
        && inner.right <= (outer.right + lenienceInPx)
        && inner.top >= (outer.top - lenienceInPx)
        && inner.bottom <= (outer.bottom + lenienceInPx);
}

export function useSelectedText(ref: React.RefObject<HTMLElement>): Selection {
    const selection = useTextSelection();

    if (!ref.current || !selection.clientRect) return EMPTY_SELECTION;
    if (isAreaInsideOtherArea(selection.clientRect, ref.current.getBoundingClientRect())) {
        return selection;
    }
    return EMPTY_SELECTION;
}
