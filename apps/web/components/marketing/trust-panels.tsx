import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Check,
  FileCheck2,
  Fingerprint,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrandMark } from "@/components/shared/brand"
import { Reveal } from "@/components/motion/reveal"

function ContextDiagram() {
  return (
    <div aria-hidden="true" className="trust-source-scene">
      <div className="trust-source-grid" />
      <div className="trust-source-orbit" />
      <svg
        className="trust-source-connectors"
        viewBox="0 0 480 360"
        fill="none"
        preserveAspectRatio="none"
      >
        <path d="M115 75V140Q115 158 133 158H222Q240 158 240 176V230" />
        <path d="M365 75V140Q365 158 347 158H258Q240 158 240 176V270" />
        <path
          className="trust-source-trace"
          pathLength="1"
          d="M115 75V140Q115 158 133 158H222Q240 158 240 176V270"
        />
      </svg>
      <div className="trust-source-sheet trust-source-question">
        <div className="trust-source-sheet-label">
          <MessageSquare />
          <p>The question</p>
          <span>01</span>
        </div>
        <p className="trust-source-quote">“I was charged twice.”</p>
        <p className="trust-source-id">TKT-1001</p>
      </div>
      <div className="trust-source-sheet trust-source-record">
        <div className="trust-source-sheet-label">
          <FileCheck2 />
          <p>Account context</p>
          <span>02</span>
        </div>
        <div className="trust-source-payments">
          <p>
            PAY-9001 <Check />
          </p>
          <p>
            PAY-9002 <Check />
          </p>
        </div>
      </div>
      <div className="trust-source-center">
        <span className="trust-source-center-mark">
          <BrandMark />
        </span>
        <span className="trust-source-center-caption">One connected view</span>
      </div>
      <div className="trust-source-sheet trust-source-knowledge">
        <span className="trust-source-knowledge-icon">
          <BookOpen />
        </span>
        <div>
          <p>Published knowledge</p>
          <span>KB-REFUND · version 1</span>
        </div>
        <span className="trust-source-status">
          <Check />
        </span>
      </div>
    </div>
  )
}

function DecisionDiagram() {
  return (
    <div aria-hidden="true" className="trust-decision-scene">
      <div className="trust-decision-halo" />
      <div className="trust-recommendation">
        <span className="trust-recommendation-icon">
          <Sparkles />
        </span>
        <div>
          <p>A recommendation</p>
          <span>Sources attached. Ready to inspect.</span>
        </div>
        <Check className="trust-recommendation-check" />
      </div>
      <div className="trust-decision-bridge">
        <ArrowDown />
      </div>
      <div className="trust-decision-card">
        <div className="trust-decision-topline">
          <ShieldCheck />
          <span>Human decision</span>
          <span className="trust-decision-dot" />
        </div>
        <p className="trust-decision-title">
          You have the
          <br />
          final word.
        </p>
        <div className="trust-decision-options">
          {["Review", "Edit", "Escalate"].map((label, index) => (
            <span
              key={label}
              className={
                index === 0
                  ? "trust-decision-option trust-decision-option-active"
                  : "trust-decision-option"
              }
            >
              {label}
              {index === 0 && <ArrowUpRight />}
            </span>
          ))}
        </div>
      </div>
      <p className="trust-decision-caption">Judgment stays with you</p>
    </div>
  )
}

export function TrustPanels() {
  return (
    <div className="trust-premium">
      <Reveal preset="panel" className="trust-chapter trust-chapter-context">
        <Card className="story-trust-context material-panel glass-panel trust-editorial-panel trust-context-panel">
          <CardContent className="trust-panel-content">
            <div className="trust-chapter-header">
              <span className="eyebrow">Connected context</span>
              <span className="trust-chapter-index">
                01 <span>/ 03</span>
              </span>
            </div>
            <h3 className="trust-panel-heading">
              The whole story.
              <br />
              <span>Finally in the same place.</span>
            </h3>
            <p className="trust-panel-description">
              The question, account records and published policies, brought
              together around one conversation.
            </p>
            <ContextDiagram />
            <p className="trust-context-caption">
              <span />
              Three sources. One connected view.
            </p>
          </CardContent>
        </Card>
      </Reveal>
      <Reveal
        preset="panel"
        delay={0.08}
        className="trust-chapter trust-chapter-control"
      >
        <Card className="story-ink glass-dark-panel trust-editorial-panel trust-control-panel">
          <CardContent className="trust-panel-content">
            <div className="trust-chapter-header">
              <span className="eyebrow">Deliberate control</span>
              <span className="trust-chapter-index">
                02 <span>/ 03</span>
              </span>
            </div>
            <h3 className="trust-panel-heading">
              A little intelligence.
              <br />
              <span>A lot of human judgment.</span>
            </h3>
            <p className="trust-panel-description">
              Check the evidence, refine the reply and choose what comes next.
              Uncertainty stays visible.
            </p>
            <DecisionDiagram />
          </CardContent>
        </Card>
      </Reveal>
      <Reveal preset="rise" className="trust-chapter trust-chapter-provenance">
        <Card className="material-panel glass-panel trust-editorial-panel trust-provenance-panel">
          <CardContent className="trust-provenance-content">
            <div className="trust-provenance-heading">
              <span aria-hidden="true" className="trust-provenance-number">
                03
              </span>
              <div>
                <p className="eyebrow">A traceable answer</p>
                <h3>
                  Less “trust me.”
                  <br />
                  <span>More “here’s the source.”</span>
                </h3>
              </div>
            </div>
            <div className="trust-provenance-evidence">
              <div className="trust-evidence-document">
                <span className="trust-evidence-icon">
                  <BookOpen />
                </span>
                <div className="trust-evidence-title">
                  <p>Duplicate-charge policy</p>
                  <span>KB-REFUND-v1 / Published policy</span>
                </div>
                <Badge variant="outline" className="trust-evidence-badge">
                  <Check />
                  <span>Referenced</span>
                </Badge>
              </div>
              <p className="trust-provenance-note">
                <Fingerprint />
                Every recommendation should lead back to the records and
                policies that support it.
              </p>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  )
}
