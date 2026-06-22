import { Database, Heart, Lock, ThermometerSun } from "lucide-react";

interface AppFooterProps {
  showPrivacyLink?: boolean;
}

const AppFooter = ({ showPrivacyLink = true }: AppFooterProps) => (
  <footer className="py-4 text-center text-xs text-muted-foreground">
    <div className="mx-auto my-3 w-16 border-t border-border" />
    <p className="mt-1 flex items-center justify-center gap-1">
      <ThermometerSun className="size-3 text-ember" />
      Ifecho • Made by{" "}
      <a
        href="https://baptistelechat.vercel.app/"
        className="inline-block py-1 underline transition-colors hover:text-ember"
        target="_blank"
        rel="noopener noreferrer"
      >
        @baptistelechat
      </a>{" "}
      with <Heart className="size-3 fill-ember text-ember" />
    </p>
    <p className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
      <span className="flex items-center gap-1">
        <Database className="size-3" />
        Données :{" "}
        <a
          href="https://open-meteo.com"
          className="underline transition-colors hover:text-ember"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open-Meteo
        </a>
        {" • "}
        <a
          href="https://adresse.data.gouv.fr"
          className="underline transition-colors hover:text-ember"
          target="_blank"
          rel="noopener noreferrer"
        >
          API Adresse
        </a>
      </span>
      {showPrivacyLink && (
        <>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1">
            <Lock className="size-3" />
            <a
              href="#confidentialite"
              className="underline transition-colors hover:text-ember"
            >
              Confidentialité
            </a>
          </span>
        </>
      )}
    </p>
  </footer>
);

export default AppFooter;
