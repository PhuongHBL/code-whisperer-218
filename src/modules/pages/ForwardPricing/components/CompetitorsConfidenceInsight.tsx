import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { fetchMicroFishChat } from "@/api/fetchMicroFishChat";
import { sanitizeInsightHtml } from "@/lib/sanitizeInsightHtml";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import TextPrimary from "@/modules/common/components/TextPrimary";
import { confidenceLabelInsightButtonClass } from "./confidenceLabelStyles";

type Props = {
  category: string;
  company: string;
  selectedDate: string;
  location: string;
  /** Matches row confidence badge for icon color (high / medium / low / …). */
  confidenceLabel: string | undefined;
  /** When false, button is disabled and explains why in title. */
  canRequest: boolean;
};

export default function CompetitorsConfidenceInsight({
  category,
  company,
  selectedDate,
  location,
  confidenceLabel,
  canRequest,
}: Props) {
  const tooltipContentId = useId();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const inFlight = useRef(false);

  useEffect(() => {
    setOpen(false);
    setPhase("idle");
    setBody("");
    setError("");
    inFlight.current = false;
  }, [category, company, selectedDate, location, confidenceLabel]);

  const runFetch = useCallback(async () => {
    if (!canRequest || inFlight.current) return;
    inFlight.current = true;
    setPhase("loading");
    setError("");
    try {
      const res = await fetchMicroFishChat({
        category,
        company,
        selected_date: selectedDate,
        location,
      });
      setBody(
        res.response?.trim() ? res.response : "No insight text returned.",
      );
      setPhase("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
      setPhase("error");
    } finally {
      inFlight.current = false;
    }
  }, [canRequest, category, company, location, selectedDate]);

  /** Tooltip is click-driven: only we set `open` to true; Radix may only close (escape, etc.). */
  const onTooltipOpenChange = (next: boolean) => {
    if (!next) setOpen(false);
  };

  const handleInsightClick = () => {
    if (!canRequest) return;
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    if (phase === "idle" || phase === "error") void runFetch();
  };

  const insightHtml = useMemo(
    () => (phase === "done" ? sanitizeInsightHtml(body) : ""),
    [body, phase],
  );

  return (
    <Tooltip open={open} onOpenChange={onTooltipOpenChange}>
      <TooltipTrigger asChild>
        <button
          type="button"
          disabled={!canRequest}
          title={
            canRequest
              ? "Click for AI insight (microFish)"
              : "Need category, company, location, and date to load insight"
          }
          className={confidenceLabelInsightButtonClass(confidenceLabel)}
          aria-label="Confidence insight"
          aria-expanded={open}
          aria-controls={tooltipContentId}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleInsightClick();
          }}
        >
          <TextPrimary
            text="lightbulb"
            className="material-symbols-outlined text-base leading-none"
          />
        </button>
      </TooltipTrigger>
      <TooltipContent
        id={tooltipContentId}
        dir="ltr"
        align="end"
        side="left"
        sideOffset={8}
        className="z-[100] w-[min(22rem,calc(100vw-2rem))] max-w-none max-h-[min(20rem,50vh)] overflow-y-auto border border-outline-variant/30 bg-popover px-3 py-2 text-left text-xs text-popover-foreground shadow-lg"
        onPointerDownOutside={() => setOpen(false)}
      >
        <p className="mb-2 text-left text-[0.5625rem] font-black uppercase tracking-widest text-on-surface-variant">
          Insight
        </p>
        {phase === "loading" ? (
          <p className="text-left text-on-surface-variant">Loading…</p>
        ) : phase === "error" ? (
          <p className="text-left text-destructive">{error}</p>
        ) : (
          <div
            className="insight-html text-left text-xs leading-relaxed text-on-surface [&_a]:break-words [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-outline-variant [&_blockquote]:pl-2 [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:text-[0.6875rem] [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_p]:last:mb-0 [&_pre]:max-h-40 [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2 [&_pre]:text-[0.6875rem] [&_table]:w-full [&_table]:border-collapse [&_table]:text-[0.6875rem] [&_td]:border [&_td]:border-outline-variant/40 [&_td]:p-1.5 [&_th]:border [&_th]:border-outline-variant/40 [&_th]:p-1.5 [&_th]:text-left [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: insightHtml }}
          />
        )}
      </TooltipContent>
    </Tooltip>
  );
}
