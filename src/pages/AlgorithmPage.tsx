import AppFooter from "@/components/AppFooter";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  Calculator,
  Sun,
  Thermometer,
  ThermometerSun,
  TrendingDown,
  Wind,
} from "lucide-react";
import type { ReactNode } from "react";

interface AlgorithmPageProps {
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
    <div className="space-y-2 rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground shadow-sm">
      {children}
    </div>
  </section>
);

const Formula = ({ children }: { children: ReactNode }) => (
  <div className="my-2 rounded-xl bg-secondary px-4 py-3 text-center font-mono text-sm font-medium text-foreground">
    {children}
  </div>
);

const Source = ({ href, children }: { href?: string; children: ReactNode }) => {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline transition-colors hover:text-ember"
      >
        {children}
      </a>
    );
  }
  return <span className="italic text-muted-foreground">{children}</span>;
};

const AlgorithmPage = ({ onBack }: AlgorithmPageProps) => (
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
        Comment ça marche ?
      </h1>
    </header>

    <main className="flex flex-1 flex-col px-4 pb-8">
      <div className="mx-auto w-full max-w-sm space-y-4">
        {/* Formule */}
        <Section icon={Calculator} title="Score de ventilation">
          <p>
            À chaque heure, Ifecho calcule un score de bénéfice à ventiler :
          </p>
          <Formula>Score = ΔT − malus UV</Formula>
          <p>
            Avec <strong>ΔT = ressenti intérieur − ressenti extérieur</strong>.
            Un score positif signifie que l'air extérieur est plus frais que
            l'air intérieur. Un créneau est affiché comme "favorable" si trois
            conditions sont réunies simultanément :
          </p>
          <ul className="ml-4 list-disc space-y-1 text-xs text-muted-foreground">
            <li>Votre intérieur dépasse 26 °C (seuil d'inconfort thermique)</li>
            <li>Le score dépasse 2 °C (écart suffisant pour être utile)</li>
            <li>
              Le ressenti extérieur est d'au moins 16 °C (plancher empirique
              hors-saison)
            </li>
          </ul>
        </Section>

        {/* Seuil 26°C */}
        <Section icon={Thermometer} title="Seuil d'inconfort thermique - 26 °C">
          <p>
            Ifecho n'affiche aucun créneau d'aération si votre température
            intérieure est inférieure ou égale à 26 °C. En dessous, vous êtes
            dans la plage de confort thermique reconnue par les standards
            suivants :
          </p>
          <ul className="ml-4 list-disc space-y-1 text-xs">
            <li>
              <strong>RE2020</strong> (arrêté du 4 août 2021) - la
              réglementation environnementale française calcule les
              Degrés-Heures d'inconfort (DH) à partir de 26 °C en été. C'est le
              seuil officiel de surchauffe pour les bâtiments neufs.{" "}
              <Source href="https://www.ecologie.gouv.fr/politiques-publiques/reglementation-environnementale-re2020">
                ecologie.gouv.fr
              </Source>
            </li>
            <li>
              <strong>EN ISO 7730:2005</strong> (confort thermique des
              environnements modérés) - catégorie B été : 23–26 °C.{" "}
              <Source>ISO 7730:2005, §A.2</Source>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground">
            En hiver ou par temps frais, personne ne chauffe son logement à 27
            °C - le seuil élimine naturellement les conseils hors-saison sans
            nécessiter de détection de saison. Pour les rares cas où l'intérieur
            serait chaud mais l'extérieur très froid (&lt; 16 °C), un plancher
            empirique sur le ressenti extérieur bloque le conseil d'aération.
          </p>
        </Section>

        {/* Delta 2°C */}
        <Section icon={TrendingDown} title="Écart favorable - Δ &gt; 2 °C">
          <p>
            Un écart de seulement 0,5 ou 1 °C entre intérieur et extérieur ne
            justifie pas d'ouvrir les fenêtres : les perturbations (bruit,
            insectes, courants d'air) ne valent pas un gain thermique aussi
            faible.
          </p>
          <p>
            Le seuil de <strong>2 °C</strong> est un paramètre empirique
            interne, calibré pour filtrer les faux positifs tout en restant
            réactif dès que l'air extérieur est réellement bénéfique. Il n'est
            pas issu d'une norme : nous le mentionnons explicitement pour être
            transparents.
          </p>
        </Section>

        {/* Malus UV */}
        <Section icon={Sun} title="Rayonnement solaire - malus UV">
          <p>
            Aérer en plein soleil fait entrer le rayonnement solaire par les
            vitres. Un double vitrage standard a un facteur solaire g ≈ 0,6 :
            par fort ensoleillement (600 W/m²), chaque m² de fenêtre ajoute ~360
            W de chaleur, soit l'équivalent d'un radiateur électrique.
          </p>
          <p>
            Le malus est déduit du score selon l'indice UV d'Open-Meteo (échelle
            WHO) :
          </p>
          <div className="overflow-hidden rounded-xl border border-border text-xs">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">
                    Indice UV
                  </th>
                  <th className="px-3 py-2 text-left font-semibold">Niveau</th>
                  <th className="px-3 py-2 text-right font-semibold">Malus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-3 py-2">0</td>
                  <td className="px-3 py-2 text-muted-foreground">Nul</td>
                  <td className="px-3 py-2 text-right">0 °C</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">1 – 2</td>
                  <td className="px-3 py-2 text-muted-foreground">Faible</td>
                  <td className="px-3 py-2 text-right">−0,5 °C</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">3 – 5</td>
                  <td className="px-3 py-2 text-muted-foreground">Modéré</td>
                  <td className="px-3 py-2 text-right">−1 °C</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">≥ 6</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    Élevé à extrême
                  </td>
                  <td className="px-3 py-2 text-right">−1,5 °C</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground">
            Source échelle UV :{" "}
            <Source href="https://www.who.int/news-room/questions-and-answers/item/radiation-the-ultraviolet-(uv)-index">
              OMS - Indice UV mondial (WHO/SDE/OEH/02.2)
            </Source>
          </p>
        </Section>

        {/* Température ressentie */}
        <Section icon={Wind} title="Température ressentie (Open-Meteo)">
          <p>
            Ifecho compare les températures <em>ressenties</em>, pas les
            températures sèches. 
            Open-Meteo combine :
          </p>
          <ul className="ml-4 list-disc space-y-1 text-xs text-muted-foreground">
            <li>Température de l'air (°C)</li>
            <li>Humidité relative (%) - effet moiteur</li>
            <li>Vitesse du vent (km/h) - effet windchill</li>
          </ul>
          <p>
            Le calcul suit l'équation de Steadman adaptée par les modèles ERA5
            et ECMWF, qui est la référence météorologique internationale pour la
            chaleur ressentie.
          </p>
          <p className="text-xs text-muted-foreground">
            Sources :{" "}
            <Source href="https://open-meteo.com/en/docs">
              Open-Meteo documentation
            </Source>
            {" - "}
            <Source>
              Steadman R.G. (1994), "Norms of apparent temperature in
              Australia", Australian Meteorological Magazine, 43, 1–16
            </Source>
          </p>
        </Section>
      </div>
    </main>

    <AppFooter showAlgorithmLink={false} />
  </div>
);

export default AlgorithmPage;
