import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SLOTS = 5;

const PRIZES = [
  "Бисквит домашний",
  "Билет на концерт",
  "Торт 1 кг",
  "Набор инструментов для авто",
  "Кофе премиум",
  "Книга бестселлер",
  "Наушники беспроводные",
  "Ужин в кафе на двоих",
];

const STATS: [string, string][] = [
  ["12 480", "билетов разыграно"],
  ["318", "активных тиражей"],
  ["100%", "проверяемо"],
];

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const randomTarget = () =>
  Array.from({ length: SLOTS }, () => Math.floor(Math.random() * 10));

function TicketDraw() {
  const [digits, setDigits] = useState<number[]>(() => randomTarget());
  const [locked, setLocked] = useState(0);
  const target = useRef<number[]>(randomTarget());
  const tick = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDigits(target.current);
      setLocked(SLOTS);
      return;
    }

    const SPIN = 13;
    const GAP = 4;
    const HOLD = 34;
    const CYCLE = SPIN + SLOTS * GAP + HOLD;

    const id = window.setInterval(() => {
      const c = tick.current % CYCLE;
      tick.current += 1;

      if (c === 0) target.current = randomTarget();

      let lockedNow: number;
      if (c < SPIN) lockedNow = 0;
      else if (c < SPIN + SLOTS * GAP)
        lockedNow = Math.min(SLOTS, Math.floor((c - SPIN) / GAP) + 1);
      else lockedNow = SLOTS;

      setLocked(lockedNow);
      setDigits((prev) =>
        prev.map((_, i) =>
          i < lockedNow ? target.current[i] : Math.floor(Math.random() * 10),
        ),
      );
    }, 70);

    return () => window.clearInterval(id);
  }, []);

  const done = locked === SLOTS;

  return (
    <div className="flex gap-1.5 sm:gap-2">
      {digits.map((d, i) => {
        const isLocked = i < locked;
        return (
          <div
            key={i}
            className={cn(
              "flex h-14 w-10 items-center justify-center rounded-md border font-mono text-3xl tabular-nums transition-colors duration-150 sm:h-16 sm:w-12 sm:text-4xl",
              isLocked && done && "border-acid bg-acid text-acid-foreground",
              isLocked &&
                !done &&
                "border-foreground bg-foreground text-background",
              !isLocked && "border-border text-muted-foreground/70",
            )}
          >
            {d}
          </div>
        );
      })}
    </div>
  );
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function msToMidnight() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  let s = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  const h = Math.floor(s / 3600);
  s %= 3600;
  const m = Math.floor(s / 60);
  s %= 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function Countdown() {
  const [t, setT] = useState(msToMidnight);
  useEffect(() => {
    const id = window.setInterval(() => setT(msToMidnight()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span className="tabular-nums">{t}</span>;
}

export default function PageMain() {
  const navigate = useNavigate();

  return (
    <main className="relative isolate min-h-[calc(100svh-3.5rem)] bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px)] [background-size:calc(100%/6)_100%] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_72%,transparent)]" />
        <div className="absolute -left-6 bottom-2 select-none font-black leading-none tracking-tighter text-foreground/[0.04] text-[36vw] sm:text-[30vw]">
          №07
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rotate-180 font-mono text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70 [writing-mode:vertical-rl] lg:block"
      >
        random.org · проверяемо
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100svh-3.5rem)] max-w-6xl flex-col justify-center px-6 pt-10 pb-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span className="inline-block size-2 rounded-full bg-acid motion-safe:animate-[acid-pulse_1.4s_ease-in-out_infinite]" />
              Честный тираж № 07 / 2026
            </div>

            <h1 className="font-black uppercase leading-[0.84] tracking-tighter text-[clamp(3rem,11vw,8.5rem)]">
              Выигрывай
              <br />
              Честно<span className="text-acid">.</span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              Прозрачные розыгрыши, результат которых{" "}
              <span className="font-medium text-foreground">
                нельзя подкрутить
              </span>
              . Победителя выбирает подписанная случайность random.org —
              проверить может каждый.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/lotteries")}
                className="group h-12 rounded-md bg-acid px-7 text-base font-bold text-acid-foreground hover:bg-acid/90"
              >
                Купить билет
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => navigate("/lotteries/create")}
                className="h-12 rounded-md px-5 text-base underline-offset-4 hover:underline"
              >
                Создать розыгрыш
              </Button>
            </div>

            <dl className="mt-12 grid max-w-xl grid-cols-3 border-y border-border font-mono">
              {STATS.map(([value, label], i) => (
                <div
                  key={label}
                  className={cn(
                    "px-4 py-3",
                    i < STATS.length - 1 && "border-r border-border",
                  )}
                >
                  <dt className="text-2xl font-bold tracking-tight tabular-nums">
                    {value}
                  </dt>
                  <dd className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 lg:justify-self-end">
            <div className="relative w-full max-w-sm">
              <div
                aria-hidden
                className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-xl bg-acid"
              />
              <div className="relative rounded-xl border border-foreground bg-card px-8 py-6">
                <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  <span>Разыгрываемый розыгрыш</span>
                  <span className="flex items-center gap-1.5 text-foreground">
                    <span className="inline-block size-1.5 rounded-full bg-acid motion-safe:animate-[acid-pulse_1.1s_ease-in-out_infinite]" />
                    украшения
                  </span>
                </div>

                <div className="my-5 border-t border-dashed border-border" />

                <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  Выигрышная № номер билета
                </p>
                <TicketDraw />

                <div className="mt-6 flex items-end justify-between gap-4">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <ShieldCheck className="size-3.5 text-acid" />
                    random.org · отлично
                  </span>
                  <span className="text-right font-mono text-xs text-muted-foreground">
                    до розыгрыша
                    <br />
                    <span className="text-base font-bold text-foreground">
                      <Countdown />
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden border-t border-border bg-background/70 backdrop-blur-sm"
      >
        <div className="flex w-max gap-0 whitespace-nowrap py-2.5 font-mono text-xs uppercase tracking-widest text-muted-foreground motion-safe:animate-[ticket-marquee_36s_linear_infinite]">
          {[0, 1].map((k) => (
            <span key={k} className="flex shrink-0 items-center">
              {PRIZES.map((p, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-6">{p}</span>
                  <span className="text-acid">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
