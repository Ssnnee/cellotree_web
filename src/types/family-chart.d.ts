declare module 'family-chart' {
  interface Store {
    setOnUpdate: (callback: (props: unknown) => void) => void;
    update: {
      tree: (options: { initial: boolean }) => void;
    };
  }

  interface View {
    svg: SVGElement;
    update: (props: unknown) => void;
    setCard: (card: Card) => void;
  }

  interface CardOptions {
    store: Store;
    svg: SVGElement;
    card_dim: {
      w: number;
      h: number;
      text_x: number;
      text_y: number;
      img_w: number;
      img_h: number;
      img_x: number;
      img_y: number;
    };
    card_display: ((d: Data) => string)[];
    mini_tree: boolean;
    link_break: boolean;
  }

  class Card {
    constructor(options: CardOptions);
  }

  interface Elements {
    Card: (options: CardOptions) => Card;
  }

  interface F3 {
    createStore: (options: { data: Data[]; node_separation: number; level_separation: number }) => Store;
    d3AnimationView: (options: { store: Store; cont: HTMLDivElement }) => View;
    elements: Elements;
  }

  const f3: F3;
  export default f3;
}
