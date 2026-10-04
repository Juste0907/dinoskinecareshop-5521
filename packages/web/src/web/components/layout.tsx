import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Minus, Plus, ShoppingBag, Trash2, X, Truck } from "lucide-react";
import { useCart } from "../lib/cart";
import { FREE_SHIPPING_FROM, formatEuro, sizeById } from "../../api/catalog";
import { cn } from "../lib/utils";

export function AnnouncementBar() {
  return (
    <div className="bg-concord text-white">
      <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-2 px-5 py-2.5 text-center text-[13px] font-semibold uppercase tracking-[0.04em]">
        <Truck className="size-4 shrink-0" />
        Livraison offerte dès {formatEuro(FREE_SHIPPING_FROM)} · Fabriqué en France
      </div>
    </div>
  );
}

export function Header({ variant = "grape" }: { variant?: "grape" | "lilac" }) {
  const { count, setOpen } = useCart();
  const onGrape = variant === "grape";
  const [location] = useLocation();
  const anchor = (id: string) => (location === "/" ? `#${id}` : `/#${id}`);

  return (
    <header
      className={cn(
        "relative z-30",
        onGrape ? "absolute inset-x-0 top-0 bg-transparent" : "bg-lilac",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <Link to="/" className="shrink-0" aria-label="Dino Skincare — accueil">
          <img
            src={onGrape ? "/images/logo-white.png" : "/images/logo-concord.png"}
            alt="Dino Skincare"
            className="h-11 w-auto md:h-14"
          />
        </Link>
        <nav
          className={cn(
            "hidden items-center gap-8 text-[16px] font-bold uppercase leading-none lg:flex",
            onGrape ? "text-white" : "text-concord",
          )}
        >
          <a href={anchor("bienfaits")} className="py-2.5 hover:opacity-75">
            Bienfaits
          </a>
          <a href={anchor("formule")} className="py-2.5 hover:opacity-75">
            La formule
          </a>
          <a href={anchor("formats")} className="py-2.5 hover:opacity-75">
            Formats
          </a>
          <a href={anchor("avis")} className="py-2.5 hover:opacity-75">
            Avis
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={anchor("formats")}
            className="hidden rounded-[52px] border-2 border-concord bg-white px-6 py-2.5 text-[16px] font-semibold leading-[1.5] text-concord shadow-ring transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            Acheter
          </a>
          <button
            onClick={() => setOpen(true)}
            aria-label={`Panier, ${count} article(s)`}
            className={cn(
              "relative grid size-12 place-items-center rounded-full border-2 transition-transform hover:-translate-y-0.5",
              onGrape ? "border-white text-white" : "border-concord text-concord",
            )}
          >
            <ShoppingBag className="size-5" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid min-w-6 place-items-center rounded-full bg-bubblegum px-1.5 text-[12px] font-bold leading-6 text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export function CartDrawer() {
  const { open, setOpen, lines, setQty, remove, subtotalCents } = useCart();
  const [, navigate] = useLocation();
  if (!open) return null;
  const remaining = FREE_SHIPPING_FROM - subtotalCents;
  const pct = Math.min(100, (subtotalCents / FREE_SHIPPING_FROM) * 100);

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Fermer le panier" className="fade-in absolute inset-0 cursor-default bg-concord/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
      <aside aria-label="Panier" className="drawer-in absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-lilac">
        <div className="flex items-center justify-between px-6 pb-4 pt-6">
          <h2 className="text-[28px] font-bold uppercase leading-none">Ton panier</h2>
          <button
            onClick={() => setOpen(false)}
            className="grid size-10 place-items-center rounded-full border-2 border-concord bg-white"
            aria-label="Fermer"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mx-6 rounded-[25px] bg-white p-4">
          <p className="text-[14px] font-semibold leading-[1.4]">
            {remaining > 0
              ? `Plus que ${formatEuro(remaining)} pour la livraison offerte`
              : "Bravo, la livraison est offerte !"}
          </p>
          <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-softgrape">
            <div className="bg-electric h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-y-auto px-6 py-5">
          {lines.length === 0 && (
            <div className="grid h-full place-items-center text-center">
              <div>
                <img src="/images/size-30.png" alt="" className="mx-auto w-40 rounded-[25px] opacity-90" />
                <p className="mt-4 text-[18px] font-bold">Ton panier est vide… comme un nid sans œuf.</p>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/#formats");
                    setTimeout(() => document.getElementById("formats")?.scrollIntoView({ behavior: "smooth" }), 50);
                  }}
                  className="mt-5 rounded-[20px] bg-concord px-6 py-3 text-[16px] font-bold uppercase text-white"
                >
                  Voir les formats
                </button>
              </div>
            </div>
          )}
          {lines.map((l) => {
            const s = sizeById(l.sizeId)!;
            return (
              <div key={l.sizeId} className="flex gap-4 rounded-[25px] bg-white p-3">
                <img src={s.image} alt={s.name} className="size-24 rounded-[18px] object-cover" />
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[18px] font-bold uppercase leading-tight">{s.name}</p>
                      <p className="text-[13px] font-medium leading-[1.4] opacity-80">La Gelée Dino · {s.volume}</p>
                    </div>
                    <button onClick={() => remove(l.sizeId)} aria-label="Retirer" className="p-1 opacity-60 hover:opacity-100">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="flex items-center rounded-full border-2 border-concord">
                      <button className="grid size-8 place-items-center" onClick={() => setQty(l.sizeId, l.quantity - 1)} aria-label="Moins">
                        <Minus className="size-4" />
                      </button>
                      <span className="w-6 text-center text-[15px] font-bold">{l.quantity}</span>
                      <button className="grid size-8 place-items-center" onClick={() => setQty(l.sizeId, l.quantity + 1)} aria-label="Plus">
                        <Plus className="size-4" />
                      </button>
                    </div>
                    <span className="text-[18px] font-bold">{formatEuro(s.priceCents * l.quantity)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {lines.length > 0 && (
          <div className="border-t-2 border-concord/10 bg-white px-6 pb-6 pt-5">
            <div className="flex items-center justify-between text-[20px] font-bold">
              <span>Sous-total</span>
              <span>{formatEuro(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-[13px] leading-[1.4] opacity-75">Taxes incluses. Livraison calculée à l'étape suivante.</p>
            <button
              onClick={() => {
                setOpen(false);
                navigate("/checkout");
              }}
              className="mt-4 w-full rounded-[20px] bg-concord px-4 py-4 text-[22px] font-bold leading-none text-white transition-transform hover:-translate-y-0.5"
            >
              Passer commande
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <footer className="bg-midnight text-white">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-16 md:grid-cols-[1.3fr_1fr_1fr] md:px-10">
        <div>
          <img src="/images/logo-white.png" alt="Dino Skincare" className="h-16 w-auto" />
          <p className="mt-6 max-w-sm text-[16px] leading-[1.6] text-white/80">
            Des soins gourmands, efficaces et sans prise de tête. Formulés et fabriqués en France, testés sous contrôle dermatologique.
          </p>
          <form
            className="mt-8 flex max-w-md gap-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              if (email) setDone(true);
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ton e-mail pour -10 %"
              aria-label="Adresse e-mail"
              className="h-12 flex-1 rounded-[30px] border border-white bg-transparent px-5 text-[15px] text-white shadow-ring outline-none placeholder:text-white/60"
            />
            <button className="h-12 rounded-[30px] bg-white px-6 text-[15px] font-bold uppercase text-concord">
              {done ? "Merci !" : "OK"}
            </button>
          </form>
        </div>
        <div>
          <p className="text-[14px] font-bold uppercase tracking-[0.07em] text-white/60">Boutique</p>
          <ul className="mt-5 space-y-3 text-[16px] font-medium">
            <li><a href="/#formats">La Gelée Dino</a></li>
            <li><a href="/#formule">Ingrédients</a></li>
            <li><a href="/#avis">Avis clients</a></li>
            <li><a href="/#faq">FAQ</a></li>
          </ul>
        </div>
        <div>
          <p className="text-[14px] font-bold uppercase tracking-[0.07em] text-white/60">Aide</p>
          <ul className="mt-5 space-y-3 text-[16px] font-medium">
            <li>Livraison & retours</li>
            <li>Suivre ma commande</li>
            <li>bonjour@dinoskincare.fr</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-[1400px] flex-wrap justify-between gap-3 px-5 py-6 text-[13px] text-white/60 md:px-10">
          <span>© 2026 Dino Skincare. Tous droits réservés.</span>
          <span>CGV · Mentions légales · Confidentialité</span>
        </div>
      </div>
    </footer>
  );
}
