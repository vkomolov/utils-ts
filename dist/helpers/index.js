/**
 * Cache of observers by configuration key.
 */
export const observerCache = new Map();
/**
 * Create a stable key representing observer configuration.
 */
export function createObserverKey(root, rootMargin, threshold) {
    const t = Array.isArray(threshold) ? threshold.join(',') : threshold;
    return `${root?.nodeName ?? 'viewport'}|${rootMargin}|${t}`;
}
/**
 * Handles intersection changes for a single entry.
 */
export function processEntry(observer, entry) {
    const cb = observer._callbacks.get(entry.target);
    if (!cb)
        return;
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
export function createObserver(key, root, rootMargin, threshold) {
    const observer = new IntersectionObserver(entries => {
        const shared = observer;
        for (const entry of entries)
            processEntry(shared, entry);
    }, { root, rootMargin, threshold });
    observer._callbacks = new WeakMap();
    observer._elementCount = 0;
    observer._key = key;
    return observer;
}
/**
 * Removes an element from observation and cleans up observer if unused.
 */
export function cleanupElement(observer, el) {
    if (!observer._callbacks.has(el))
        return;
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
export function registerElement(observer, el, options) {
    if (!el.isConnected)
        return () => { };
    const callbacks = {
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
//# sourceMappingURL=index.js.map