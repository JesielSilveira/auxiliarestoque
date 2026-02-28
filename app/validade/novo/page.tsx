import {prisma} from "@/lib/prisma";
import NovoLoteForm from "./NovoLoteForm";
import { serialize } from "@/lib/serializers";

export default async function Page() {

  const produtos = await prisma.produto.findMany({
    orderBy:{ nome:"asc" }
  });

  const produtosSerializados = serialize(produtos);

  return (
    <NovoLoteForm produtos={produtosSerializados}/>
  );
}