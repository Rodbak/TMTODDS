import { notFound } from "next/navigation";
import { SlipBody } from "@/components/demo/SlipBody";
import { DEMO_SLIPS } from "@/lib/demo/data";

export default async function SlipPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slip = DEMO_SLIPS.find((s) => s.slug === slug);
  if (!slip) return notFound();
  return <SlipBody slip={slip} />;
}

