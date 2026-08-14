import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { senses } from "../data/senses";

export default function FooterNav({ onSelect, activeKey }) {
  return (
    <footer
      className="grid grid-cols-2 sm:grid-cols-5"
      aria-label="The six senses"
    >
      {senses.map((sense, i) => {
        const isActive = sense.key === activeKey;
        return (
          <Button
            key={sense.key}
            type="button"
            variant="ghost"
            className={`h-[clamp(100px,7.5vw,150px)] w-full rounded-none p-0 text-left hover:bg-transparent ${
              i === senses.length - 1 ? "col-span-2 sm:col-span-1" : ""
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
                <div className="flex min-w-0 flex-1 flex-col items-start gap-2 whitespace-normal">
                  <p
                    className="font-sans text-[clamp(11px,0.7vw,14px)] font-normal leading-[clamp(15px,0.9vw,18px)]"
                    style={{ color: isActive ? sense.accent : "#fff" }}
                  >
                    {sense.element}
                  </p>
                  <p className="font-heading text-[clamp(18px,0.8vw,26px)] font-medium leading-[clamp(22px,1.6vw,32px)] tracking-[-0.16px] text-white">
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
