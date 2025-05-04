export default async function Page({
  params,
}: {
  params: Promise<{ address: string }>
}) {
  const { address } = await params
  return <div>My Post: {address}</div>
}