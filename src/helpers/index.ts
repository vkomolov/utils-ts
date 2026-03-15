import type {
  ElementCallbacks,
  ObserveIntersectionOptions,
  SharedObserver,
} from '../types';

/**
 * Cache of observers by configuration key.
 */
export const observerCache = new Map<string, SharedObserver>();

/**
 * Create a stable key representing observer configuration.
 */
export function createObserverKey(
  root: Element | null,
  rootMargin: string,
  threshold: number | number[],
): string {
  const t = Array.isArray(threshold) ? threshold.join(',') : threshold;
  return `${root?.nodeName ?? 'viewport'}|${rootMargin}|${t}`;
}

/**
 * Handles intersection changes for a single entry.
 */
export function processEntry(
  observer: SharedObserver,
  entry: IntersectionObserverEntry,
): void {
  const cb = observer._callbacks.get(entry.target);
  if (!cb) return;

  cb.onChange?.(entry);

  if (entry.isIntersecting && !cb.wasIntersecting) {
    cb.onEnter?.(entry);

    if (cb.once) {
      cb.cleanup();
      return;
    }
  }

  if (!entry.isIntersecting && cb.wasIntersecting) {
    cb.onLeave?.(entry);
  }

  cb.wasIntersecting = entry.isIntersecting;
}

/**
 * Creates a shared IntersectionObserver instance.
 */
export function createObserver(
  key: string,
  root: Element | null,
  rootMargin: string,
  threshold: number | number[],
): SharedObserver {
  const observer = new IntersectionObserver(
    entries => {
      const shared = observer as SharedObserver;
      for (const entry of entries) processEntry(shared, entry);
    },
    { root, rootMargin, threshold },
  ) as SharedObserver;

  observer._callbacks = new WeakMap();
  observer._elementCount = 0;
  observer._key = key;

  return observer;
}

/**
 * Removes an element from observation and cleans up observer if unused.
 */
export function cleanupElement(observer: SharedObserver, el: HTMLElement): void {
  if (!observer._callbacks.has(el)) return;

  observer.unobserve(el);
  observer._callbacks.delete(el);
  observer._elementCount--;

  if (observer._elementCount === 0) {
    observer.disconnect();
    observerCache.delete(observer._key);
  }
}

/**
 * Registers an element to the observer.
 */
export function registerElement(
  observer: SharedObserver,
  el: HTMLElement,
  options: ObserveIntersectionOptions,
): () => void {
  if (!el.isConnected) return () => {};

  const callbacks: ElementCallbacks = {
    wasIntersecting: false,
    once: options.once ?? false,
    onEnter: options.onEnter,
    onLeave: options.onLeave,
    onChange: options.onChange,
    cleanup: () => cleanupElement(observer, el),
  };

  observer._callbacks.set(el, callbacks);
  observer._elementCount++;

  observer.observe(el);

  return callbacks.cleanup;
}

/*** SCROLL LOCKER ***/

/**
 * Creates lock style updates
 * Pure function - returns style changes without applying them
 */
export const createLockStyles = (
  scrollbarWidth: number,
  originalPadding: string,
): { overflow: string; paddingRight: string } => ({
  overflow: 'hidden',
  paddingRight: scrollbarWidth > 0 ? `${scrollbarWidth}px` : originalPadding,
});

/**
 * Creates unlock style updates
 * Pure function - returns restoration values
 */
export const createUnlockStyles = (
  originalPadding: string,
): { overflow: string; paddingRight: string } => ({
  overflow: '',
  paddingRight: originalPadding,
});

/**
 * Cancels pending animation frame if exists
 * @returns {null} always null for state reset
 */
export const cancelPendingFrame = (rafId: number | null): null => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  return null;
};
