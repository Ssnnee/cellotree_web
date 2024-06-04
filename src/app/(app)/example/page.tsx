import { Button } from "~/components/ui/button";
import { PageActions, PageHeader, PageHeaderDescription, PageHeaderHeading } from "~/app/_components/page-header";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { TreeViewExample } from "./tree-view-example";

export default async function PageExample() {

  return (
    <div className="container relative">
      <PageHeader>
        <PageHeaderHeading>
          Voici un exemple de comment vous pourriez visualiser votre arbre généalogique.
        </PageHeaderHeading>
        <PageHeaderDescription>
          Nous vous conseillons d'activer le mode sombre pour une meilleure expérience.
        </PageHeaderDescription>
        <PageActions>
          <Button>
            <Link href="/">
              Retour à l&pos;accueil
            </Link>
          </Button>
        </PageActions>
      </PageHeader>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Visualisation d'un arbre généalogique </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <PageHeaderDescription>
            Nous vous conseillons d'activer le mode sombre pour une meilleure expérience.
          </PageHeaderDescription>
          <TreeViewExample />
        </CardContent>
      </Card>
    </div>
  );
}

