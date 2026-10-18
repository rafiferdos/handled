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
      "Handled is designed around a human checkpoint: AI gathers context and suggests a next step, while a person reviews the evidence and decides what happens next.",
  },
  {
    question: "What can I explore today?",
    answer:
      "Three support cases: a duplicate charge, a cancellation at period end, and missing product access. Explore the workspace, inspect evidence and try the review interaction. Actions stay local; your accounts are not connected.",
  },
  {
    question: "Where do the answers come from?",
    answer:
      "The product is designed to combine workspace-scoped account records with published knowledge. Each recommendation carries source references so an agent can check the evidence.",
  },
  {
    question: "What happens when the evidence is incomplete?",
    answer:
      "Missing, conflicting or stale evidence calls for manual review. Low-confidence recommendations cannot proceed to an action. A clear escalation is more useful than an unsupported answer.",
  },
  {
    question: "Can I connect my support tools today?",
    answer:
      "Account connections and sign-in are still being built. You can explore the workspace today without connecting your tools. Live account changes and payments are not available yet.",
  },
]

export function Faq() {
  return (
    <Accordion className="premium-faq rounded-none border-0">
      {questions.map((item, index) => (
        <AccordionItem
          key={item.question}
          value={String(index)}
          className="premium-faq-item"
        >
          <AccordionTrigger className="premium-faq-trigger gap-4 px-0 py-7 text-sm hover:no-underline md:text-base">
            <span className="flex gap-4 md:gap-6">
              <span className="faq-number font-mono text-[11px] leading-6 text-signal">
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
