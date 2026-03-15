export interface ObserveIntersectionOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onLeave?: (entry: IntersectionObserverEntry) => void;
  onChange?: (entry: IntersectionObserverEntry) => void;
}
/**
 * Callbacks and state associated with a single observed element.
 */
export interface ElementCallbacks {
  wasIntersecting: boolean;
  once: boolean;
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onLeave?: (entry: IntersectionObserverEntry) => void;
  onChange?: (entry: IntersectionObserverEntry) => void;
  cleanup: () => void;
}
/**
 * Internal shared observer with extra metadata.
 */
export interface SharedObserver extends IntersectionObserver {
  _callbacks: WeakMap<Element, ElementCallbacks>;
  _elementCount: number;
  _key: string;
}
//# sourceMappingURL=interfaces.d.ts.map
