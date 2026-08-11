import { Mail, Phone } from "lucide-react";

import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { profile } from "@/data/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-5 px-4 sm:flex-row sm:px-6">
        <a
          href="#inicio"
          className="focus-ring rounded-md font-mono text-sm font-medium tracking-tight text-foreground"
        >
          <span className="text-primary">&gt;_</span> pedrolevi
        </a>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} {profile.name} · {profile.location}
        </p>

        <div className="flex items-center gap-1.5">
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="focus-ring rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <GitHubIcon className="size-4" />
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="focus-ring rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LinkedInIcon className="size-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="focus-ring rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Mail className="size-4" aria-hidden />
          </a>
          <a
            href={`tel:${profile.phoneRaw}`}
            aria-label="Telefone"
            className="focus-ring rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Phone className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
