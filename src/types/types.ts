export type TEventMap<T> = T extends Window
  ? WindowEventMap
  : T extends Document
    ? DocumentEventMap
    : T extends HTMLElement
      ? HTMLElementEventMap
      : never;

export type ImageDimensions = {
  naturalWidth: number;
  naturalHeight: number;
  offsetWidth: number;
  offsetHeight: number;
};