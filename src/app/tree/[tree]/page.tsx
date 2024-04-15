interface Params {
  params: {
    tree: string
  }
}
export default function TreePage( { params }: Params) {
  return (
    <div className="flex h-screen justify-center items-center align-middle">
      {params.tree}
    </div>
  )
}
