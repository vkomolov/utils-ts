import {
  createObserver,
  createObserverKey,
  observerCache,
  registerElement,
} from '../../helpers';
/**
 * It checks whether the given style rule is supported for the given HTML Element
 * @param element - target HTML Element
 * @param param - css rule
 * @param value - the value of the css rule
 */
export function isStyleSupported(element, param, value) {
  return param in element.style && CSS.supports(param, value);
}
/**
 * it migrates the given HTML Element to another HTML Parent
 * @param target - the target HTML Element
 * @param parentFrom - the current HTML parent
 * @param parentTo - the target HTML parent to migrate to
 */
export function migrateElement({ target, parentFrom, parentTo }) {
  if (target.isConnected) {
    (target.parentElement === parentFrom ? parentTo : parentFrom).appendChild(target);
  } else {
    console.warn(`[migrateElement]: target: ${target} in not in DOM...`);
  }
}
/**
 * It creates a throttled (locked) event listener that ensures the provided callback is called
 * only after a specified delay, regardless of how frequently the event is triggered.
 *
 * @param event - The name of the event (EventMap) to listen to ("click", "scroll").
 * @param listenerOwner - The target element, window, or document
 *   that will receive the event listener.
 * @param [delay=300] - The delay in milliseconds before the callback is executed
 *   after the event is triggered. Defaults to 300ms.
 * @returns a function that accepts a callback (`cb`) and optional parameters (`params`).
 *   This function attaches the event listener with debouncing behavior. The returned function
 *   also returns another function for removing the event listener.
 *
 * @example
 * const removeClickListener = throttledEventListener("click", document.body, 500)(
 *   () => console.log("Click event triggered!"),
 *   []
 * );
 *
 * // To remove the listener:
 * removeClickListener();
 */
export function throttledEventListener(event, listenerOwner, delay = 300) {
  if (listenerOwner instanceof HTMLElement && !listenerOwner.isConnected) {
    throw new Error(
      '[throttledEventListener]: Provided listenerOwner is not a valid DOM element...',
    );
  }
  let isLocked = false;
  return (cb, params) => {
    const args = params ?? [];
    const handler = () => {
      if (isLocked) return;
      isLocked = true;
      setTimeout(() => {
        cb(...args);
        isLocked = false;
      }, delay);
    };
    listenerOwner.addEventListener(event, handler);
    return () => {
      listenerOwner.removeEventListener(event, handler);
    };
  };
}
/**
 * Toggles a CSS class on a target element when a trigger element
 * crosses the top boundary of the viewport.
 *
 * Uses IntersectionObserver instead of scroll listeners,
 * which provides better performance for scroll-based UI updates.
 *
 * @param targetElement - The element whose class will be toggled.
 * @param triggerElement - The element that triggers the class change.
 * @param activeClass - The CSS class to add/remove.
 * @param root - Optional scroll container. Defaults to the viewport.
 * @param rootMargin - Margin around the root to adjust trigger timing.
 *
 * @returns A cleanup function that disconnects the observer.
 */
export function toggleClassOnIntersection(
  targetElement,
  triggerElement,
  activeClass,
  root = null,
  rootMargin = '-1px 0px 0px 0px',
) {
  if (!targetElement.isConnected || !triggerElement.isConnected) {
    throw new Error(
      '[toggleClassOnIntersection]: targetElement or triggerElement is not connected to the DOM.',
    );
  }
  let isClassActive = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      // Trigger activates when it moves above the viewport top
      const shouldActivate = entry.boundingClientRect.top <= 0 && !entry.isIntersecting;
      if (shouldActivate && !isClassActive) {
        requestAnimationFrame(() => {
          targetElement.classList.add(activeClass);
          isClassActive = true;
        });
      }
      if (!shouldActivate && isClassActive) {
        requestAnimationFrame(() => {
          targetElement.classList.remove(activeClass);
          isClassActive = false;
        });
      }
    },
    {
      root,
      threshold: 0,
      rootMargin,
    },
  );
  observer.observe(triggerElement);
  return () => observer.disconnect();
}
/**
 * Observes visibility changes of a DOM element using IntersectionObserver.
 *
 * This helper provides convenient callbacks for entering and leaving
 * the viewport (or a custom scroll container).
 *
 * @param targetElement - The element to observe.
 * @param options - Intersection observer configuration.
 *
 * @returns Cleanup function that disconnects the observer.
 *
 * @example Reveal animation:
 * observeIntersection(document.querySelector(".card"), {
 *   onEnter: (entry) => {
 *     entry.target.classList.add("visible");
 *   }
 * });
 *
 * @example Lazy image loading
 * observeIntersection(img, {
 *   once: true,
 *   onEnter: () => {
 *     img.src = img.dataset.src;
 *   }
 * });
 *
 * @example Sticky header trigger
 * observeIntersection(hero, {
 *   onLeave: () => header.classList.add("scrolled"),
 *   onEnter: () => header.classList.remove("scrolled")
 * });
 */
export function observeIntersection(targetElement, options = {}) {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    once = false,
    onEnter,
    onLeave,
    onChange,
  } = options;
  if (!targetElement.isConnected) {
    throw new Error('[observeIntersection]: targetElement is not connected to the DOM.');
  }
  let wasIntersecting = false;
  const observer = new IntersectionObserver(
    ([entry]) => {
      const isIntersecting = entry.isIntersecting;
      // Generic state change callback
      onChange?.(entry);
      // Element entered viewport
      if (isIntersecting && !wasIntersecting) {
        onEnter?.(entry);
        if (once) {
          observer.disconnect();
          return;
        }
      }
      // Element left viewport
      if (!isIntersecting && wasIntersecting) {
        onLeave?.(entry);
      }
      wasIntersecting = isIntersecting;
    },
    {
      root,
      rootMargin,
      threshold,
    },
  );
  observer.observe(targetElement);
  return () => observer.disconnect();
}
/**
 * Observes one or multiple elements using shared IntersectionObserver instances.
 *
 * Observers are reused when the configuration (`root`, `rootMargin`, `threshold`)
 * matches an existing observer. This significantly reduces the number of
 * IntersectionObserver instances when many elements are observed.
 *
 * The observer is automatically cleaned up when no elements remain observed.
 *
 * @param elements Element or array of elements to observe;
 * @param options Intersection observer configuration and callbacks;
 *
 * @returns An array of cleanup functions corresponding to each observed element;
 *
 * @example
 * // Basic usage — detect when an element enters the viewport;
 * const element = document.querySelector(".card") as HTMLElement;
 *
 * const [cleanup] = observeIntersections(element, {
 *   onEnter: () => {
 *     console.log("Element entered viewport");
 *   }
 * });
 *
 * cleanup();
 *
 * @example
 * // Observe multiple elements (e.g., list items or cards);
 * const cards = Array.from(document.querySelectorAll(".card")) as HTMLElement[];
 *
 * const cleanups = observeIntersections(cards, {
 *   threshold: 0.25,
 *   onEnter: (entry) => {
 *     entry.target.classList.add("visible");
 *   }
 * });
 *
 * cleanups.forEach(fn => fn());
 *
 * @example
 * // Trigger animation only once when the element appears;
 * const hero = document.querySelector(".hero") as HTMLElement;
 *
 * observeIntersections(hero, {
 *   once: true,
 *   threshold: 0.3,
 *   onEnter: (entry) => {
 *     entry.target.classList.add("animate");
 *   }
 * });
 *
 * @example
 * // Lazy-load images when they approach the viewport;
 * const images = Array.from(document.querySelectorAll("img[data-src]")) as HTMLElement[];
 *
 * observeIntersections(images, {
 *   rootMargin: "200px",
 *   once: true,
 *   onEnter: (entry) => {
 *     const img = entry.target as HTMLImageElement;
 *     img.src = img.dataset.src!;
 *   }
 * });
 *
 * @example
 * // Track element visibility analytics;
 * const banner = document.querySelector(".banner") as HTMLElement;
 *
 * observeIntersections(banner, {
 *   threshold: 0.5,
 *   onEnter: () => {
 *     console.log("Banner viewed");
 *   },
 *   onLeave: () => {
 *     console.log("Banner left viewport");
 *   }
 * });
 *
 * @example
 * // Infinite scroll trigger (load more when sentinel appears);
 * const sentinel = document.querySelector("#scroll-end") as HTMLElement;
 *
 * observeIntersections(sentinel, {
 *   threshold: 0,
 *   onEnter: () => {
 *     loadMoreItems();
 *   }
 * });
 *
 * function loadMoreItems() {
 *   console.log("Fetching more data...");
 * };
 *
 * @example
 * // Scroll-based UI state (e.g., sticky header activation);
 * const section = document.querySelector("#top-section") as HTMLElement;
 *
 * observeIntersections(section, {
 *   threshold: 0,
 *   onLeave: () => {
 *     document.body.classList.add("header-sticky");
 *   },
 *   onEnter: () => {
 *     document.body.classList.remove("header-sticky");
 *   }
 * });
 *
 * @example
 * // Scroll-driven CSS animation (reveal elements when scrolling);
 * const sections = Array.from(document.querySelectorAll(".reveal")) as HTMLElement[];
 *
 * observeIntersections(sections, {
 *   threshold: 0.15,
 *   onEnter: (entry) => {
 *     entry.target.classList.add("reveal-active");
 *   }
 * });
 *
 * // CSS example;
 * // .reveal { opacity: 0; transform: translateY(40px); transition: all 600ms ease; };
 * // .reveal-active { opacity: 1; transform: translateY(0); };
 *
 * @example
 * // Scroll-driven animation with GSAP;
 * import { gsap } from "gsap";
 *
 * const boxes = Array.from(document.querySelectorAll(".box")) as HTMLElement[];
 *
 * observeIntersections(boxes, {
 *   threshold: 0.2,
 *   onEnter: (entry) => {
 *     gsap.fromTo(
 *       entry.target,
 *       { opacity: 0, y: 50 },
 *       { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
 *     );
 *   }
 * });
 *
 * @example
 * // Performance-optimized lazy component initialization;
 * const widgets = Array.from(document.querySelectorAll("[data-widget]")) as HTMLElement[];
 *
 * observeIntersections(widgets, {
 *   rootMargin: "300px",
 *   once: true,
 *   onEnter: (entry) => {
 *     const el = entry.target as HTMLElement;
 *
 *     import("./widgets/chartWidget").then(module => {
 *       module.mountChartWidget(el);
 *     });
 *   }
 * });
 *
 * @example
 * // Lazy hydration of expensive UI components (performance optimization);
 * const components = Array.from(document.querySelectorAll("[data-component]")) as HTMLElement[];
 *
 * observeIntersections(components, {
 *   rootMargin: "250px",
 *   once: true,
 *   onEnter: (entry) => {
 *     const el = entry.target as HTMLElement;
 *
 *     if (el.dataset.component === "map") {
 *       import("./components/map").then(m => m.mountMap(el));
 *     }
 *
 *     if (el.dataset.component === "carousel") {
 *       import("./components/carousel").then(m => m.mountCarousel(el));
 *     }
 *   }
 * });
 */
export function observeIntersections(elements, options) {
  const { root = null, rootMargin = '0px', threshold = 0 } = options;
  const key = createObserverKey(root, rootMargin, threshold);
  let observer = observerCache.get(key);
  if (!observer) {
    observer = createObserver(key, root, rootMargin, threshold);
    observerCache.set(key, observer);
  }
  const list = Array.isArray(elements) ? elements : [elements];
  const cleanups = [];
  for (const el of list) {
    cleanups.push(registerElement(observer, el, options));
  }
  return cleanups;
}
//# sourceMappingURL=index.js.map
