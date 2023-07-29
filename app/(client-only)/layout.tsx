import NoSSR from "@/components/NoSSR";

export default async function ClientOnlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NoSSR>{children}</NoSSR>;
}
