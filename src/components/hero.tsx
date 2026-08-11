import {
  ArrowDown,
  Download,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { profile } from "@/data/profile";

/** Delays da entrada em stagger (CSS animation-delay). */
const delays = [
  "[animation-delay:0ms]",
  "[animation-delay:80ms]",
  "[animation-delay:160ms]",
  "[animation-delay:240ms]",
  "[animation-delay:320ms]",
  "[animation-delay:400ms]",
] as const;

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Decoração de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-28%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-sky-500/5 blur-3xl" />
        <div className="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="bg-grid-pattern mask-fade-hero absolute inset-0" />
      </div>

      <div className="mx-auto w-full max-w-3xl px-4 py-24 text-center sm:px-6">
        <p
          className={`animate-fade-up motion-reduce:animate-none font-mono text-sm text-primary ${delays[0]}`}
        >
          &gt;_ {profile.role.toLowerCase()}
        </p>

        {/* O título é o elemento LCP, com delay 0 para pintar o mais cedo possível */}
        <h1
          className="animate-fade-up motion-reduce:animate-none mt-3 text-5xl font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
        >
          {profile.displayName}
          <span className="block text-muted-foreground">
            {profile.surname}
          </span>
        </h1>

        <p
          className={`animate-fade-up motion-reduce:animate-none mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg ${delays[1]}`}
        >
          {profile.bio}
        </p>

        <p
          className={`animate-fade-up motion-reduce:animate-none mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground ${delays[2]}`}
        >
          <MapPin className="size-3.5" aria-hidden />
          {profile.location}
        </p>

        <div
          className={`animate-fade-up motion-reduce:animate-none mt-8 flex flex-wrap items-center justify-center gap-3 ${delays[3]}`}
        >
          <Button size="lg" render={<a href="#projetos" />} nativeButton={false}>
            Ver projetos
            <ArrowDown data-icon="inline-end" className="size-4" aria-hidden />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<a href={profile.cvUrl} download />}
            nativeButton={false}
          >
            <Download
              data-icon="inline-start"
              className="size-4"
              aria-hidden
            />
            Baixar CV
          </Button>
        </div>

        <ul
          className={`animate-fade-up motion-reduce:animate-none mt-10 flex flex-wrap items-center justify-center gap-2 ${delays[4]}`}
          aria-label="Tecnologias"
        >
          {profile.stack.map((tech) => (
            <li key={tech}>
              <span className="inline-flex items-center rounded-md border border-border bg-secondary/40 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
                {tech}
              </span>
            </li>
          ))}
        </ul>

        <div
          className={`animate-fade-up motion-reduce:animate-none mt-10 flex items-center justify-center gap-3 ${delays[5]}`}
        >
          <TooltipProvider delay={100}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/30 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  />
                }
              >
                <GitHubIcon className="size-4" />
              </TooltipTrigger>
              <TooltipContent>GitHub</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/30 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  />
                }
              >
                <LinkedInIcon className="size-4" />
              </TooltipTrigger>
              <TooltipContent>LinkedIn</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={`mailto:${profile.email}`}
                    aria-label="Email"
                    className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/30 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  />
                }
              >
                <Mail className="size-4" aria-hidden />
              </TooltipTrigger>
              <TooltipContent>Email</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <a
                    href={`tel:${profile.phoneRaw}`}
                    aria-label="Telefone"
                    className="focus-ring inline-flex size-10 items-center justify-center rounded-full border border-border bg-secondary/30 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  />
                }
              >
                <Phone className="size-4" aria-hidden />
              </TooltipTrigger>
              <TooltipContent>{profile.phone}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <a
        href="#sobre"
        aria-label="Rolar para a seção sobre"
        className="animate-fade-in motion-reduce:animate-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted-foreground transition-colors hover:text-foreground [animation-delay:1200ms] sm:block"
      >
        <ArrowDown className="size-5 animate-bounce motion-reduce:animate-none" aria-hidden />
      </a>
    </section>
  );
}
