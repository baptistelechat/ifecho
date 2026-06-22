import AppFooter from "@/components/AppFooter";
import {
  ArrowLeft,
  BarChart2,
  Eye,
  Server,
  Shield,
  ThermometerSun,
} from "lucide-react";
import type { LucideIcon, ReactNode } from "react";

interface PrivacyPageProps {
  onBack: () => void;
}

interface SectionProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}

const Section = ({ icon: Icon, title, children }: SectionProps) => (
  <section>
    <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      <Icon className="size-3.5" />
      {title}
    </p>
    <div className="space-y-2 rounded-2xl border border-border bg-card p-4 shadow-sm text-sm leading-relaxed text-foreground">
      {children}
    </div>
  </section>
);

const PrivacyPage = ({ onBack }: PrivacyPageProps) => (
  <div className="flex min-h-dvh flex-col">
    <header className="relative pb-4 pt-10 text-center">
      <button
        type="button"
        onClick={onBack}
        aria-label="Retour à l'accueil"
        className="absolute left-4 top-10 text-muted-foreground transition-colors hover:text-ember"
      >
        <ArrowLeft className="size-5" />
      </button>
      <div className="mb-2 flex items-center justify-center gap-1.5 text-ember">
        <ThermometerSun className="size-6" />
        <span className="text-2xl font-bold tracking-wide">Ifecho</span>
      </div>
      <h1 className="text-xl font-black text-foreground">
        Politique de confidentialité
      </h1>
    </header>

    <main className="flex flex-1 flex-col px-4 pb-8">
      <div className="mx-auto w-full max-w-sm space-y-4">
        <Section icon={BarChart2} title="Données collectées">
          <p>
            Ifecho utilise{" "}
            <a
              href="https://posthog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-ember"
            >
              PostHog
            </a>{" "}
            (hébergé en Europe) pour améliorer l'application. Nous collectons
            des événements anonymes : chargement météo, téléchargement du rappel
            calendrier, navigation dans les conseils.
          </p>
          <p>
            La localisation est transmise uniquement sous forme de département
            (ex : "Sarthe"), jamais sous forme de coordonnées GPS précises
          </p>
          <p>Aucune donnée personnelle identifiable n'est collectée.</p>
        </Section>

        <Section icon={Eye} title="Sessions anonymes">
          <p>
            Nous enregistrons des sessions de navigation anonymes (Session
            Replay) pour comprendre comment l'app est utilisée et détecter
            d'éventuels problèmes d'ergonomie.
          </p>
          <p>
            Les champs de saisie sont automatiquement masqués et ces
            enregistrements ne contiennent aucune information personnelle.
          </p>
        </Section>

        <Section icon={Shield} title="Cookies et stockage local">
          <p>
            Aucun cookie de suivi n'est utilisé. Les données d'analytics sont
            stockées uniquement en mémoire de session et effacées dès la
            fermeture de l'onglet.
          </p>
          <p>
            Vos préférences (température intérieure, niveau de confort) sont
            sauvegardées dans le <em>localStorage</em> de votre navigateur.
            Elles ne quittent jamais votre appareil.
          </p>
        </Section>

        <Section icon={Server} title="Hébergement">
          <p>
            Ifecho est déployé sur{" "}
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-ember"
            >
              Vercel
            </a>
            . Les données analytiques transitent vers PostHog EU (serveurs
            localisés en Europe, conformes au RGPD).{" "}
          </p>
          <p>
            <a
              href="https://posthog.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-ember"
            >
              En savoir plus sur la politique de confidentialité de PostHog
            </a>
          </p>
        </Section>
      </div>
    </main>

    <AppFooter showPrivacyLink={false} />
  </div>
);

export default PrivacyPage;
