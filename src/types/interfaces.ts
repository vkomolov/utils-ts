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

/**
 * State interface for scroll lock controller
 * @interface
 */
export interface ScrollLockState {
  /** Animation frame ID for cancellation */
  rafId: number | null;
  /** Current lock status */
  isLocked: boolean;
  /** Original padding-right value before lock */
  originalPaddingRight: string;
  /** Cached scrollbar width */
  scrollbarWidth: number;
  /** Flag indicating if controller was ever used */
  isInitialized: boolean;
}

/**
 * Return type for initLockScroll factory
 * @interface
 */
export interface ScrollLockController {
  /**
   * Locks or unlocks page scroll with scrollbar width compensation
   * @param lock - true to lock scroll, false to unlock
   */
  lockScroll(lock?: boolean): void;

  /**
   * Destroys controller and restores original state
   * Call this when unmounting component to prevent memory leaks
   */
  destroy(): void;
}
