export interface Tip {
  id: string;
  title: string;
  body: string;
}

export const TIPS: Tip[] = [
  {
    id: "rule-500w",
    title: "Une fenêtre = un radiateur 500 W",
    body: "En plein été, chaque m² de vitrage reçoit jusqu'à 500 W/m² d'énergie solaire. Fermer ses volets et stores avant 10h, c'est éteindre ce radiateur avant qu'il chauffe.",
  },
  {
    id: "volets-avant-10h",
    title: "Volets fermés avant 10h, pas après",
    body: "Fermez vos volets tôt le matin, quand l'air est encore frais et avant que le soleil tape. Les fermer à 14h ne sert à rien : la chaleur est déjà entrée.",
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
  {
    id: "ventilateur-eau",
    title: "Ventilateur + eau froide = mini-clim",
    body: "Poser un bol d'eau glacée devant un ventilateur crée un effet rafraîchissant par évaporation. L'air soufflé peut descendre de 2 à 4°C. Brumisateur ou linge humide produisent le même effet.",
  },
  {
    id: "appareils-electriques",
    title: "Four, lave-linge : attendre le soir",
    body: "Four, lave-vaisselle, sèche-linge et même les ampoules halogènes dégagent de la chaleur. En canicule, décalez leur usage après 21h pour ne pas réchauffer le logement en journée.",
  },
  {
    id: "pieces-fraiches",
    title: "Côté nord et sous-sol : les alliés",
    body: "Les pièces orientées nord ou en sous-sol restent 3 à 5°C plus fraîches en journée. Concentration activités et sommeil dans ces zones permet de limiter la perception de chaleur.",
  },
  {
    id: "sol-frais",
    title: "Le sol : meilleur ami de vos pieds",
    body: "Les sols carrelés, en béton ou en pierre accumulent moins la chaleur que l'air ambiant. Marcher pieds nus sur du carrelage ou s'allonger sur le sol peut faire descendre la sensation de chaud.",
  },
  {
    id: "draps-humides",
    title: "Draps humides pour s'endormir",
    body: "Avant de dormir, léger humidifié votre drap du dessus ou votre nuque avec un linge frais. L'évaporation nocturne dissipe la chaleur corporelle plus vite et accélère l'endormissement.",
  },
];
