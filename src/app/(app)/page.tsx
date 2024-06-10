import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from "../_components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { TreeViewExample } from "./example/tree-view-example";

export default function Home() {

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>
          Découvrez votre histoire, partagez votre héritage.
        </PageHeaderHeading>
        <PageHeaderDescription>
          Une plateforme intuitive pour créer, collaborer et partager vos arbres
          généalogiques. Explorez vos racines familiales et connectez-vous avec
          vos proches, où qu&apos;ils soient dans le monde.
        </PageHeaderDescription>
      </PageHeader>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Visualisation d&apos;un arbre généalogique </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <PageHeaderDescription>
            Nous vous conseillons d&apos;activer le mode sombre pour une meilleure expérience.
              <br />
          </PageHeaderDescription>
          <TreeViewExample />
        </CardContent>
      </Card>
    </div>
  );
}

