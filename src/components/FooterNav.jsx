import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { senses } from "../data/senses";

export default function FooterNav({ onSelect, activeKey, rotationMs }) {
  return (
    <footer
      className="grid grid-cols-5"
      aria-label="The six senses"
    >
      {senses.map((sense) => {
        const isActive = sense.key === activeKey;
        return (
          <Button
            key={sense.key}
            type="button"
            variant="ghost"
            className="h-[75px] w-full rounded-none p-0 text-left hover:bg-transparent"
            onClick={() => onSelect?.(sense.key)}
          >
            <Card
              className="relative h-full w-full overflow-hidden rounded-none border border-solid border-[#4d4d4d] bg-arcelblack text-white shadow-none"
              style={
                isActive && !rotationMs
                  ? { boxShadow: `inset 0 -3px 0 0 ${sense.accent}` }
                  : undefined
              }
            >
              {/* auto-rotation progress bar — fills over the active tab's
                  dwell time, in sync with the flywheel beat driving it;
                  remounts (and so restarts) each time this tab goes active */}
              {isActive && rotationMs ? (
                <span
                  className="absolute inset-x-0 bottom-0 z-10 h-[3px] origin-left animate-footer-progress"
                  style={{ background: sense.accent, animationDuration: `${rotationMs}ms` }}
                />
              ) : null}
              <CardContent className="mx-auto flex h-full w-full max-w-[719px] flex-col items-center justify-center gap-1 p-0 px-2 sm:flex-row sm:justify-between sm:gap-4 sm:px-6">
                <div className="hidden min-w-0 flex-1 flex-col items-start gap-0.5 whitespace-normal sm:flex">
                  <p
                    className="font-sans text-[clamp(9px,0.55vw,12px)] font-normal leading-[clamp(13px,0.75vw,16px)]"
                    style={{ color: isActive ? sense.accent : "#fff" }}
                  >
                    {sense.element}
                  </p>
                  <p className="font-heading text-[clamp(15px,0.65vw,21px)] font-medium leading-[clamp(19px,1.3vw,26px)] tracking-[-0.16px] text-white">
                    {sense.title}
                  </p>
                </div>
                <div
                  className="flex h-[25.6px] w-[25.6px] shrink-0 items-center justify-center sm:h-[clamp(22.4px,1.76vw,46.4px)] sm:w-[clamp(22.4px,1.76vw,46.4px)]"
                >
                  <img
                    className="h-full w-full object-contain"
                    alt={sense.element}
                    src={sense.icon}
                  />
                </div>
                <p
                  className="font-sans text-[10px] font-normal leading-none sm:hidden"
                  style={{ color: isActive ? sense.accent : "#fff" }}
                >
                  {sense.element}
                </p>
              </CardContent>
            </Card>
          </Button>
        );
      })}
    </footer>
  );
}
