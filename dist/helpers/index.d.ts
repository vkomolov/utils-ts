import type { ObserveIntersectionOptions, SharedObserver } from '../types';
/**
 * Cache of observers by configuration key.
 */
export declare const observerCache: Map<string, SharedObserver>;
/**
 * Create a stable key representing observer configuration.
 */
export declare function createObserverKey(root: Element | null, rootMargin: string, threshold: number | number[]): string;
/**
 * Handles intersection changes for a single entry.
 */
export declare function processEntry(observer: SharedObserver, entry: IntersectionObserverEntry): void;
/**
 * Creates a shared IntersectionObserver instance.
 */
export declare function createObserver(key: string, root: Element | null, rootMargin: string, threshold: number | number[]): SharedObserver;
/**
 * Removes an element from observation and cleans up observer if unused.
 */
export declare function cleanupElement(observer: SharedObserver, el: HTMLElement): void;
/**
 * Registers an element to the observer.
 */
export declare function registerElement(observer: SharedObserver, el: HTMLElement, options: ObserveIntersectionOptions): () => void;
//# sourceMappingURL=index.d.ts.map