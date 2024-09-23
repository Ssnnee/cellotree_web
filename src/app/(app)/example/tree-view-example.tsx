"use client";

import f3 from "family-chart";
import { data } from "./data";
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


const f3Typed = f3;

export const TreeViewExample: React.FC = () => {
  const cont = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cont.current) return;

    const store = f3Typed.createStore({
        data: data,
        node_separation: 250,
        level_separation: 150
      }),
      view = f3Typed.d3AnimationView({
        store,
        cont: cont.current
      }),
      Card = f3Typed.elements.Card({
        store,
        svg: view.svg,
        card_dim: { w: 220, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 },
        card_display: [
          (d: Data) => `${d.data["first name"] ?? ""} ${d.data["last name"] ?? ""}`,
          (d: Data) => `${d.data.birthday ?? ""}`
        ],
        mini_tree: true,
        link_break: true
      });

    view.setCard(Card);
    store.setOnUpdate((props: unknown) => view.update(props ?? {}));
    store.update.tree({ initial: true });
  }, []);

  return <div className="f3" id="FamilyChart" ref={cont}></div>;
};
