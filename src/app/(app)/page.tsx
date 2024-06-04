import { Button } from "~/components/ui/button";
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading
} from "../_components/page-header";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { TreeViewExample } from "./example/tree-view-example";
import { getUser } from "~/actions/auth.actions";


export default async function Home() {
  const user = await getUser();

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
        <PageActions>
          <Button>
            <MagnifyingGlassIcon className="w-6 h-6" />
            Search
          </Button>
        </PageActions>
      </PageHeader>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Visualisation d&apos;un arbre généalogique </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <PageHeaderDescription>
            Nous vous conseillons d&apos;activer le mode sombre pour une meilleure expérience.
              <br />
            {user ? `Bienvenue ${JSON.stringify(user)}` : "Bienvenue, connectez-vous pour continuer"}
          </PageHeaderDescription>
          <TreeViewExample />
        </CardContent>
      </Card>
    </div>
  );
}

