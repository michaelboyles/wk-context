// Copied from https://github.com/juliankrispel/use-text-selection with some fixes, marked
// with their own comments.
// Repo doesn't seem to accept PRs.

import { useCallback, useLayoutEffect, useState } from 'react'

export type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number>

function shallowDiff(prev: any, next: any) {
  if (prev != null && next != null) {
    for (const key of Object.keys(next)) {
      if (prev[key] != next[key]) {
        return true
      }
    }
  } else if (prev != next) {
    return true
  }
  return false
}

type TextSelectionState = {
  clientRects?: DOMRectList,
  isCollapsed?: boolean,
  textContent?: string
}

const defaultState: TextSelectionState = {}

export function useTextSelection(target?: HTMLElement) {
  const [{
    clientRects,
    isCollapsed,
    textContent,
  }, setState] = useState<TextSelectionState>(defaultState)

  const handler = useCallback(() => {
    let newRects: DOMRectList
    const selection = window.getSelection()
    let newState: TextSelectionState = { }

    if (selection == null || !selection.rangeCount) {
      setState(newState)
      return
    } 

    const range = selection.getRangeAt(0);
    // Changed this to accept double clicking the entire question as a valid seletion.
    if (target != null) {
      const fillsEntireContainer = range.startOffset === 0 && range.endOffset === 0;
      if (fillsEntireContainer) {
        if (!target.contains(range.startContainer)) {
            setState(newState)
            return
        }
      }
      else if (!target.contains(range.commonAncestorContainer)) {
        setState(newState)
        return
      }
    }

    if (range == null) {
      setState(newState)
      return
    }

    const contents = range.cloneContents()

    if (contents.textContent != null) {
      newState.textContent = contents.textContent
    }

    newRects = range.getClientRects();
    if (shallowDiff(clientRects, newRects)) {
      newState.clientRects = newRects
    }
    newState.isCollapsed = range.collapsed

    setState(newState)
  }, [target])

  useLayoutEffect(() => {
    document.addEventListener('selectionchange', handler)
    document.addEventListener('keydown', handler)
    document.addEventListener('keyup', handler)
    window.addEventListener('resize', handler)

    return () => {
      document.removeEventListener('selectionchange', handler)
      document.removeEventListener('keydown', handler)
      document.removeEventListener('keyup', handler)
      window.removeEventListener('resize', handler)
    }
  }, [target])

  return {
    clientRects: [...(clientRects ?? [])],
    isCollapsed,
    textContent
  }
}