import type { Metadata } from "next"
import { KnowledgeLibrary } from "@/components/dashboard/knowledge-library"
export const metadata: Metadata = { title: "Knowledge library" }
export default function KnowledgePage() {
  return <KnowledgeLibrary />
}
