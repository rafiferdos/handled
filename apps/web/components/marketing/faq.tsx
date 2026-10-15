"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const questions = [
  {
    question: "Can the AI take actions on its own?",
    answer:
      "Every action requires an authenticated human decision. AI gathers context and suggests a next step; the backend validates permissions, evidence, proposal version and policy before admitting a simulated action.",
  },
  {
    question: "What can I explore in this preview?",
    answer:
      "Three sample support cases: a duplicate charge, a cancellation at period end, and missing product access. Explore the workspace, inspect evidence and try the local review interaction. This preview does not connect to real accounts or execute refunds.",
  },
  {
    question: "Where do the answers come from?",
    answer:
      "The product is designed to combine workspace-scoped account records with published knowledge. Each recommendation carries source references so an agent can check the evidence. The current preview uses clearly labelled sample records.",
  },
  {
    question: "What happens when the evidence is incomplete?",
    answer:
      "Missing, conflicting or stale evidence calls for manual review. Low-confidence recommendations cannot proceed to an action. A clear escalation is more useful than an unsupported answer.",
  },
  {
    question: "Can I connect my support tools today?",
    answer:
      "Provider connections and live authentication are still being built. This foundation is an interactive product preview, not an active provider integration. Commercial billing and production payment writes are outside the current MVP.",
  },
]

export function Faq() {
  return (
    <Accordion className="rounded-none border-x-0 border-t-0">
      {questions.map((item, index) => (
        <AccordionItem key={item.question} value={String(index)}>
          <AccordionTrigger className="gap-4 px-0 py-7 text-sm hover:no-underline md:text-base">
            <span className="flex gap-4 md:gap-6">
              <span className="font-mono text-[11px] leading-6 text-signal">
                0{index + 1}
              </span>
              {item.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pr-5 pl-9 text-sm leading-[1.8] text-muted-foreground md:pl-12">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
