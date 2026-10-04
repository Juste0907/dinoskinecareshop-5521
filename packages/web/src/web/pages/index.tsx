import { useState } from "react";
import { Droplets, Sparkles, ShieldCheck, Feather, Check, ChevronDown, Leaf, FlaskConical, Citrus } from "lucide-react";
import { AnnouncementBar, CartDrawer, Footer, Header } from "../components/layout";
import { ReviewStamp, Seal } from "../components/brand";
import { useCart } from "../lib/cart";
import { SIZES, formatEuro, type SizeId } from "../../api/catalog";
import { cn } from "../lib/utils";

const CLAIMS = [
  "Hydratation 72h",
  "98 % d'origine naturelle",
  "Vegan & cruelty-free",
  "Sans parfum ajouté",
  "Toutes peaux, même sensibles",
  "Fabriqué en France",
];

const BENEFITS = [
  {
    icon: Droplets,
    title: "Hydratation 72h",
    text: "Trois poids d'acide hyaluronique gorgent la peau d'eau, en surface comme en profondeur.",
    stat: "+81 %",
    statLabel: "d'hydratation*",
  },
  {
    icon: Sparkles,
    title: "Éclat immédiat",
    text: "La niacinamide 5 % unifie le teint et floute les pores. Effet glow dès la 1re application.",
    stat: "93 %",
    statLabel: "teint plus lumineux*",
  },
  {
    icon: ShieldCheck,
    title: "Barrière blindée",
    text: "Céramides + panthénol réparent la barrière cutanée. Une armure de dino, version douce.",
    stat: "-47 %",
    statLabel: "de tiraillements*",
  },
  {
    icon: Feather,
    title: "Texture gelée",
    text: "Fondante, fraîche, zéro film gras. Pénètre en 10 secondes, parfaite sous le maquillage.",
    stat: "10 s",
    statLabel: "pour pénétrer",
  },
];

const INGREDIENTS = [
  { icon: FlaskConical, name: "Niacinamide 5 %", text: "Resserre les pores, unifie, matifie la zone T." },
  { icon: Droplets, name: "Acide hyaluronique ×3", text: "Bas, moyen et haut poids moléculaire." },
  { icon: Citrus, name: "Extrait de fruit du dragon", text: "Antioxydant, booste l'éclat naturel." },
  { icon: Leaf, name: "Aloe vera bio", text: "Apaise, rafraîchit, calme les rougeurs." },
];

const REVIEWS = [
  { name: "Inès, 27 ans", text: "J'ai la peau mixte et ultra réactive. Elle boit la gelée en 2 secondes, aucun bouton, et mon fond de teint tient enfin.", size: "Dino 100 ml" },
  { name: "Thomas, 34 ans", text: "Premier soin que je finis en entier. Texture fraîche, aucun effet gras. Le T-Rex est rentabilisé en un mois avec ma copine.", size: "T-Rex 200 ml" },
  { name: "Maëlle, 22 ans", text: "Le flacon est trop mignon mais surtout ça marche : peau rebondie le matin, même en hiver. J'ai pris le Bébé pour le sac.", size: "Bébé Dino 30 ml" },
];

const FAQ = [
  { q: "Pour quel type de peau ?", a: "Toutes ! Peaux sèches, mixtes, grasses et sensibles. Formule non comédogène, testée sous contrôle dermatologique." },
  { q: "Comment l'utiliser ?", a: "Matin et/ou soir, 2 pressions sur peau propre, avant ta crème ou seule si ta peau est mixte à grasse." },
  { q: "Combien de temps dure un flacon ?", a: "Environ 1 mois pour le Bébé Dino (30 ml), 3 mois pour le Dino (100 ml) et 6 mois pour le T-Rex (200 ml) en usage quotidien." },
  { q: "Livraison et retours ?", a: "Expédition sous 24h, livraison offerte dès 35 €. Satisfaite ou remboursée pendant 30 jours, même flacon entamé." },
];

function SizePicker({ value, onChange, tone }: { value: SizeId; onChange: (s: SizeId) => void; tone: "grape" | "light" }) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {SIZES.map((s) => {
        const active = s.id === value;
        return (
          <button
            key={s.id}
            onClick={() => onChange(s.id)}
            aria-pressed={active}
            className={cn(
              "rounded-[52px] border-2 border-concord px-3 py-2.5 text-center transition-all sm:px-6",
              active
                ? "bg-concord text-white shadow-ring"
                : "bg-white text-concord hover:-translate-y-0.5",
              tone === "grape" && !active && "shadow-ring",
            )}
          >
            <span className="block text-[16px] font-semibold leading-[1.4] sm:text-[18px] sm:leading-[27px]">{s.volume}</span>
            <span className={cn("block text-[12px] font-medium leading-none", active ? "text-white/80" : "text-concord/70")}>
              {s.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Hero() {
  const [size, setSize] = useState<SizeId>("dino");
  const { add } = useCart();
  const s = SIZES.find((x) => x.id === size)!;

  return (
    <section className="relative isolate overflow-hidden bg-grape text-white">
      <Header variant="grape" />
      <img
        src="/images/hero.png"
        alt="Flacon de La Gelée Dino entouré de gouttes de gelée et d'un petit dinosaure"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-[72%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(91,0,237,.92)_0%,rgba(91,0,237,.75)_45%,rgba(91,0,237,0)_75%)] lg:bg-[linear-gradient(90deg,rgba(91,0,237,.95)_0%,rgba(91,0,237,.7)_38%,rgba(91,0,237,0)_60%)]" />

      <div className="mx-auto flex min-h-[920px] max-w-[1400px] flex-col px-5 pb-[380px] pt-32 md:px-10 lg:min-h-[100svh] lg:justify-center lg:pb-20 lg:pt-36">
        <div className="max-w-[560px]">
          <ReviewStamp tone="white" text="4,9/5 · 2 331 avis vérifiés" className="rise" />
          <h1
            className="rise mt-5 text-[44px] font-bold leading-[1.05] sm:text-[60px] sm:leading-[63px]"
            style={{ animationDelay: ".08s" }}
          >
            Une peau rebondie, préhistoriquement douce.
          </h1>
          <p
            className="rise mt-5 max-w-[480px] text-[18px] font-medium leading-[1.6] text-white/90"
            style={{ animationDelay: ".16s" }}
          >
            La Gelée Dino, le sérum-gelée qui hydrate 72h, réveille l'éclat et renforce la barrière cutanée. Une seule étape, zéro chichi.
          </p>

          <div className="rise mt-8" style={{ animationDelay: ".24s" }}>
            <p className="mb-2.5 text-[13px] font-bold uppercase tracking-[0.07em] text-white/80">Choisis ton format</p>
            <SizePicker value={size} onChange={setSize} tone="grape" />
          </div>

          <div className="rise mt-5 flex flex-wrap items-center gap-4" style={{ animationDelay: ".32s" }}>
            <button
              onClick={() => add(size)}
              className="rounded-[20px] bg-concord px-7 py-4 text-[22px] font-bold leading-[22px] text-white shadow-ring transition-transform hover:-translate-y-0.5"
            >
              Ajouter au panier · {formatEuro(s.priceCents)}
            </button>
            {s.compareAtCents && (
              <span className="text-[18px] font-semibold text-white/70 line-through">{formatEuro(s.compareAtCents)}</span>
            )}
          </div>

          <div className="rise mt-8 flex gap-4" style={{ animationDelay: ".4s" }}>
            <Seal tone="white" size={92} lines={["98%", "naturel"]} />
            <Seal tone="white" size={92} lines={["72h", "hydra"]} />
            <Seal tone="white" size={92} lines={["0%", "parfum"]} className="hidden sm:grid" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ClaimsMarquee() {
  const row = [...CLAIMS, ...CLAIMS];
  return (
    <div className="overflow-hidden border-y-2 border-concord bg-softgrape py-4">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((c, i) => (
          <span key={i} className="flex items-center gap-10 text-[18px] font-bold uppercase leading-none text-concord">
            {c}
            <span className="inline-block size-3 rotate-45 bg-bubblegum" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Benefits() {
  return (
    <section id="bienfaits" className="scroll-mt-6 bg-lilac py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-[760px] text-[44px] font-bold uppercase leading-none md:text-[64px]">
            Quatre super-pouvoirs, un seul flacon.
          </h2>
          <Seal lines={["Testé", "dermato"]} size={112} className="wobble shrink-0" />
        </div>
        <div className="mt-14 grid gap-[25px] sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b, i) => (
            <article
              key={b.title}
              className={cn(
                "flex flex-col rounded-[25px] bg-white p-[25px] transition-transform hover:-translate-y-1",
                i % 2 === 1 && "lg:translate-y-8 lg:hover:translate-y-7",
              )}
            >
              <div className="grid size-14 place-items-center rounded-full bg-concord text-white">
                <b.icon className="size-7" strokeWidth={2.4} />
              </div>
              <h3 className="mt-6 text-[26px] font-bold uppercase leading-none">{b.title}</h3>
              <p className="mt-3 text-[16px] leading-[1.6] text-concord/85">{b.text}</p>
              <div className="mt-auto flex items-baseline gap-2 border-t-2 border-dashed border-softgrape pt-5">
                <span className="font-stamp text-[30px] leading-none">{b.stat}</span>
                <span className="text-[13px] font-semibold leading-tight">{b.statLabel}</span>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-16 text-[12px] leading-[1.5] text-concord/70">
          *Étude d'usage sur 42 volontaires, 4 semaines, 2 applications par jour.
        </p>
      </div>
    </section>
  );
}

function Formula() {
  return (
    <section id="formule" className="bg-skyscoop scroll-mt-6 py-24">
      <div className="mx-auto grid max-w-[1400px] items-center gap-14 px-5 md:px-10 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <p className="font-stamp text-[16px] uppercase">La formule</p>
          <h2 className="mt-4 text-[44px] font-bold leading-none md:text-[64px] md:leading-[64px]">
            Une gelée fondante. Quatre actifs qui bossent vraiment.
          </h2>
          <p className="mt-6 max-w-[520px] text-[18px] leading-[1.6] text-concord/85">
            Pas de liste à rallonge : des concentrations efficaces, une base aqueuse légère et des actifs bien tolérés, même par les peaux qui tiraillent pour un rien.
          </p>
          <ul className="mt-10 grid gap-[25px] sm:grid-cols-2">
            {INGREDIENTS.map((ing) => (
              <li key={ing.name} className="flex gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-concord text-white">
                  <ing.icon className="size-6" strokeWidth={2.4} />
                </div>
                <div>
                  <p className="text-[18px] font-bold leading-tight">{ing.name}</p>
                  <p className="mt-1 text-[15px] leading-[1.5] text-concord/80">{ing.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <a
            href="#formats"
            className="mt-10 inline-flex rounded-[20px] bg-concord px-7 py-4 text-[18px] font-bold uppercase leading-[20px] text-white transition-transform hover:-translate-y-0.5"
          >
            Je craque
          </a>
        </div>
        <div className="relative">
          <img
            src="/images/texture.png"
            alt="Texture gelée translucide de La Gelée Dino avec fruit du dragon et aloe vera"
            className="radius-cut aspect-[4/5] w-full object-cover"
            loading="lazy"
          />
          <div className="radius-cut absolute bottom-6 left-6 max-w-[260px] bg-white/25 p-5 backdrop-blur-md">
            <p className="text-[32px] font-bold leading-none">pH 5,5</p>
            <p className="mt-1 text-[14px] font-semibold leading-[1.4]">Le même que ta peau. Zéro picotement.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sizes() {
  const { add } = useCart();
  return (
    <section id="formats" className="scroll-mt-6 bg-lilac py-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="text-center">
          <ReviewStamp text="Plus de 18 000 flacons vendus" className="justify-center" />
          <h2 className="mt-4 text-[44px] font-bold uppercase leading-none md:text-[64px]">Choisis ton dino</h2>
          <p className="mx-auto mt-4 max-w-[560px] text-[18px] leading-[1.6] text-concord/85">
            Même formule, trois tailles. Plus il est grand, plus le prix au millilitre fond.
          </p>
        </div>
        <div className="mt-14 grid gap-[25px] md:grid-cols-3">
          {SIZES.map((s) => {
            const featured = s.id === "dino";
            return (
              <article
                key={s.id}
                className={cn(
                  "relative flex flex-col rounded-[25px] bg-white p-5",
                  featured && "ring-[3px] ring-concord md:-translate-y-4",
                )}
              >
                {s.badge && (
                  <span
                    className={cn(
                      "absolute left-5 top-5 z-10 px-3 py-1.5 text-[13px] font-bold uppercase text-white",
                      featured ? "bg-rust" : "bg-bubblegum",
                    )}
                  >
                    {s.badge}
                  </span>
                )}
                <div className="overflow-hidden rounded-[20px] bg-white">
                  <img src={s.image} alt={`${s.name} ${s.volume}`} className="aspect-square w-full object-contain transition-transform duration-500 hover:scale-105" loading="lazy" />
                </div>
                <div className="flex flex-1 flex-col px-1 pt-4">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[24px] font-bold leading-[1.25]">{formatEuro(s.priceCents)}</span>
                    {s.compareAtCents && (
                      <span className="text-[16px] font-semibold text-concord/50 line-through">{formatEuro(s.compareAtCents)}</span>
                    )}
                    <span className="ml-auto text-[13px] font-semibold text-concord/70">
                      {formatEuro(Math.round((s.priceCents / s.ml) * 100))} / 100 ml
                    </span>
                  </div>
                  <h3 className="mt-1 text-[32px] font-bold uppercase leading-[40px]">
                    {s.name} <span className="text-[20px] text-concord/60">{s.volume}</span>
                  </h3>
                  <ReviewStamp text={`${s.reviews.toLocaleString("fr-FR")} avis`} className="mt-2" />
                  <p className="mt-3 text-[16px] leading-[1.5] text-concord/85">{s.tagline}</p>
                  <button
                    onClick={() => add(s.id)}
                    className={cn(
                      "mt-6 w-full rounded-[20px] px-4 py-4 text-[18px] font-bold uppercase leading-[20px] transition-transform hover:-translate-y-0.5",
                      featured ? "bg-concord text-white" : "border-2 border-concord bg-white text-concord hover:bg-concord hover:text-white",
                    )}
                  >
                    Ajouter au panier
                  </button>
                </div>
              </article>
            );
          })}
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-x-10 gap-y-3 text-[15px] font-semibold">
          {["Expédié sous 24h", "Satisfaite ou remboursée 30 jours", "Paiement sécurisé"].map((t) => (
            <span key={t} className="flex items-center gap-2">
              <Check className="size-5" strokeWidth={3} /> {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="avis" className="bg-electric scroll-mt-6 py-24 text-white">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <ReviewStamp tone="white" text="4,9/5 · 2 331 avis" />
            <h2 className="mt-4 text-[44px] font-bold leading-none md:text-[64px]">Elles et ils rugissent de plaisir.</h2>
          </div>
        </div>
        <div className="mt-12 grid gap-[25px] md:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="radius-cut flex flex-col bg-white/25 p-[25px] backdrop-blur-sm">
              <ReviewStamp tone="white" text="Achat vérifié" />
              <blockquote className="mt-4 text-[20px] font-medium leading-[1.5]">« {r.text} »</blockquote>
              <figcaption className="mt-auto pt-6 text-[15px] font-bold uppercase tracking-[0.04em]">
                {r.name} <span className="font-medium normal-case text-white/75">· {r.size}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-white py-24">
      <div className="mx-auto grid max-w-[1100px] gap-12 px-5 md:grid-cols-[1fr_1.4fr] md:px-10">
        <div>
          <h2 className="text-[44px] font-bold uppercase leading-none md:text-[56px]">Questions fréquentes</h2>
          <img src="/images/logo.png" alt="" className="mt-10 hidden w-56 md:block" />
        </div>
        <div className="space-y-2.5">
          {FAQ.map((f, i) => (
            <div key={f.q} className="rounded-[25px] bg-lilac">
              <button
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-[18px] font-bold"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {f.q}
                <ChevronDown className={cn("size-5 shrink-0 transition-transform", open === i && "rotate-180")} />
              </button>
              {open === i && <p className="px-6 pb-6 text-[16px] leading-[1.6] text-concord/85">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen">
      <AnnouncementBar />
      <Hero />
      <ClaimsMarquee />
      <Benefits />
      <Formula />
      <Sizes />
      <Reviews />
      <Faq />
      <Footer />
      <CartDrawer />
    </div>
  );
}
