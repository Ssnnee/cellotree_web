"use client"

import React, { Component, createRef } from "react";
import f3 from "family-chart";
import { data } from "./data";

interface Data {
  id: string;
  rels: {
    spouses?: string[];
    children?: string[];
    father?: string;
    mother?: string;
  };
  data: {
    "first name"?: string;
    "last name"?: string;
    birthday?: string;
    avatar?: string;
    gender?: string;
  };
}

export default class TreeViewExample extends Component {
  cont: React.RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);
    this.cont = createRef();
  }

  componentDidMount() {
    if (!this.cont.current) return;

    const store = f3.createStore({
        data: this.getData(),
        node_separation: 250,
        level_separation: 150
      }),
      view = f3.d3AnimationView({
        store,
        cont: this.cont.current
      }),
      Card = f3.elements.Card({
        store,
        svg: view.svg,
        card_dim: { w: 220, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 },
        card_display: [
          (d: Data) => `${d.data['first name'] || ''} ${d.data['last name'] || ''}`,
            (d: Data) => `${d.data['birthday'] || ''}`
        ],
        mini_tree: true,
        link_break: true
      });

    view.setCard(Card);
    store.setOnUpdate((props: any) => view.update(props || {}));
    store.update.tree({ initial: true });
  }

  getData(): Data[] {
    return data;
  }

  render() {
    return <div className="f3" id="FamilyChart" ref={this.cont}></div>;
  }
}

