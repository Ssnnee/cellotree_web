import f3 from "family-chart";
import { useEffect, useRef } from "react";
import { toast } from "~/components/ui/use-toast";

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
    description?: string;
  };
}

export const FamilyChart: React.FC<{ data: Data[] }> = ({ data }) => {
  const cont = useRef<HTMLDivElement>(null);

  const validateData = (data: Data[]) => {
    if (!Array.isArray(data)) {
      return "Data must be an array.";
    }
    for (const item of data) {
      if (!item.id ?? typeof item.id !== "string") {
        return "Each data item must have an 'id' of type string.";
      }
      if (!item.data) {
        return "Each data item must have a 'data' object.";
      }
    }
    return null;
  };

  useEffect(() => {
    if (!cont.current) return;

    const error = validateData(data);
    if (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error,
      });
      return;
    }

    try {
      const store = f3.createStore({
          data: data,
          node_separation: 250,
          level_separation: 150,
        }),
        view = f3.d3AnimationView({
          store,
          cont: cont.current,
        }),
        Card = f3.elements.Card({
          store,
          svg: view.svg,
          card_dim: { w: 220, h: 70, text_x: 75, text_y: 15, img_w: 60, img_h: 60, img_x: 5, img_y: 5 },
          card_display: [
            (d: Data) => `${d.data["first name"] ?? ""} ${d.data["last name"] ?? ""}`,
            (d: Data) => `${d.data.description ?? ""}`,
            (d: Data) => `${d.data.birthday ?? ""}`,
          ],
          mini_tree: true,
          link_break: true,
        });

      view.setCard(Card);
      store.setOnUpdate((props: unknown) => view.update(props ?? {}));
      store.update.tree({ initial: true });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Il semble qu'il y ait un problème.",
        description: "Les données fournies ne sont pas valides. Assurez-vous que les conjoint sont ajoutés et réessayez.",
      });
    }
  }, [data]);

  return <div className="f3" id="FamilyChart" ref={cont}></div>;
};
