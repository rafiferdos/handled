import {
  ArrowUpRight,
  BookOpen,
  FileCheck2,
  MessageSquare,
  ShieldCheck,
} from "lucide-react"
import { ButtonLink } from "@/components/shared/button-link"
import { Reveal } from "@/components/motion/reveal"

const stages = [
  {
    icon: MessageSquare,
    n: "01",
    title: "The question",
    copy: "Start with the person behind the ticket.",
  },
  {
    icon: BookOpen,
    n: "02",
    title: "The context",
    copy: "Find the relevant records and published knowledge.",
  },
  {
    icon: ShieldCheck,
    n: "03",
    title: "Your decision",
    copy: "Inspect, edit, approve or ask for a closer look.",
  },
  {
    icon: FileCheck2,
    n: "04",
    title: "A clear outcome",
    copy: "Keep the action and its evidence together.",
  },
]

export function WorkflowMap() {
  return (
    <section className="border-y bg-muted/25 py-20 md:py-24">
      <div className="page-container">
        <Reveal className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-4 text-muted-foreground">
              One workspace. Fewer loose ends.
            </p>
            <h2 className="max-w-xl font-heading text-4xl leading-[1.08] font-medium tracking-[-0.045em] md:text-5xl">
              A better rhythm
              <br />
              for the actual work.
            </h2>
          </div>
          <ButtonLink
            variant="outline"
            href="/how-it-works"
            className="h-11 w-fit rounded-full bg-transparent px-5 text-xs"
          >
            Follow the process
            <ArrowUpRight className="ml-5 size-3.5" />
          </ButtonLink>
        </Reveal>
        <div className="relative mt-12 grid gap-8 sm:grid-cols-2 md:mt-16 lg:grid-cols-4">
          <div
            aria-hidden="true"
            className="workflow-connector absolute inset-x-6 top-6 hidden h-px opacity-60 lg:block"
          />
          {stages.map((stage, index) => (
            <Reveal key={stage.n} delay={index * 0.06}>
              <div className="relative">
                <div className="mb-5 flex size-12 items-center justify-center rounded-2xl border bg-background">
                  <stage.icon className="size-5 text-muted-foreground" />
                </div>
                <p className="eyebrow mb-2 text-muted-foreground">
                  {stage.n} /
                </p>
                <h3 className="font-heading text-xl font-medium tracking-tight">
                  {stage.title}
                </h3>
                <p className="mt-3 max-w-[245px] text-sm leading-relaxed text-muted-foreground">
                  {stage.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
