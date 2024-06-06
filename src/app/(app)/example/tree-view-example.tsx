"use client";

import f3 from "family-chart";
import { dragonBall } from "./data";
import { useEffect, useRef } from "react";

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

export const TreeViewExample: React.FC = () => {
  const cont = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cont.current) return;

    const store = f3.createStore({
        data: dragonBall,
        node_separation: 250,
        level_separation: 150
      }),
      view = f3.d3AnimationView({
        store,
        cont: cont.current
      }),
      Card = f3.elements.Card({
        store,
        svg: view.svg,
        card_dim: { w: 220, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 },
        card_display: [
          (d: Data) => `${d.data["first name"] || ""} ${d.data["last name"] || ""}`,
          (d: Data) => `${d.data["birthday"] || ""}`
        ],
        mini_tree: true,
        link_break: true
      });

    view.setCard(Card);
    store.setOnUpdate((props: any) => view.update(props || {}));
    store.update.tree({ initial: true });
  }, []);

  return <div className="f3" id="FamilyChart" ref={cont}></div>;
};

