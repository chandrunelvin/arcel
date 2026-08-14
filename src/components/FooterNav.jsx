import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { senses } from "../data/senses";

export default function FooterNav({ onSelect, activeKey }) {
  return (
    <footer
      className="grid grid-cols-1 sm:grid-cols-5"
      aria-label="The six senses"
    >
      {senses.map((sense) => {
        const isActive = sense.key === activeKey;
        return (
          <Button
            key={sense.key}
            type="button"
            variant="ghost"
            className={`h-[75px] w-full rounded-none p-0 text-left hover:bg-transparent ${
              isActive ? "order-first sm:order-none" : ""
            }`}
            onClick={() => onSelect?.(sense.key)}
          >
            <Card
              className="relative h-full w-full overflow-hidden rounded-none border border-solid border-[#4d4d4d] bg-arcelblack text-white shadow-none"
              style={
                isActive
                  ? { boxShadow: `inset 0 -3px 0 0 ${sense.accent}` }
                  : undefined
              }
            >
              <CardContent className="mx-auto flex h-full w-full max-w-[719px] items-center justify-between gap-4 p-0 px-6">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-0.5 whitespace-normal">
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
                  className="flex h-[clamp(28px,2.2vw,58px)] w-[clamp(28px,2.2vw,58px)] shrink-0 items-center justify-center"
                >
                  <img
                    className="h-full w-full object-contain"
                    alt={sense.element}
                    src={sense.icon}
                  />
                </div>
              </CardContent>
            </Card>
          </Button>
        );
      })}
    </footer>
  );
}
