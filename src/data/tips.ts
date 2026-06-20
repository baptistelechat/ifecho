export interface Tip {
  id: string;
  title: string;
  body: string;
  urgent?: boolean;
}

export const TIPS: Tip[] = [
  {
    id: "rule-500w",
    title: "Une fenêtre = un radiateur 500 W",
    body: "En plein été, chaque m² de vitrage reçoit jusqu'à 500 W/m² d'énergie solaire. Fermer ses volets et stores avant 10h, c'est éteindre ce radiateur avant qu'il chauffe.",
    urgent: true,
  },
  {
    id: "volets-avant-10h",
    title: "Volets fermés avant 10h, pas après",
    body: "Fermez vos volets tôt le matin, quand l'air est encore frais et avant que le soleil tape. Les fermer à 14h ne sert à rien : la chaleur est déjà entrée.",
    urgent: true,
  },
  {
    id: "store-interieur-inutile",
    title: "Store intérieur = presque inutile",
    body: "Un store ou rideau intérieur arrête à peine 20% de la chaleur solaire : le rayonnement a déjà traversé le verre et est dans la pièce. Seuls les volets extérieurs et stores bannes sont efficaces.",
  },
  {
    id: "ventilation-nocturne",
    title: "Ventiler la nuit, pas le jour",
    body: "La ventilation croisée nocturne (ouvrir fenêtres opposées) est la technique de rafraîchissement passif la plus efficace. L'air nocturne est souvent 5 à 10°C plus frais qu'en journée.",
  },
  {
    id: "bouteille-fraiche",
    title: "S'hydrater avant d'avoir soif",
    body: "La sensation de soif est un signe que la déshydratation a déjà commencé. En canicule, boire régulièrement (eau, jus) même sans soif, et éviter l'alcool et les boissons sucrées.",
  },
];
