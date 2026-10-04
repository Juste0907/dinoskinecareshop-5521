import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader2, Lock, Minus, Plus } from "lucide-react";
import { CartDrawer, Footer, Header } from "../components/layout";
import { useCart } from "../lib/cart";
import { useCreateOrder } from "../queries/orders";
import { SHIPPING_METHODS, formatEuro, shippingCost, sizeById, type ShippingId } from "../../api/catalog";
import { cn } from "../lib/utils";

interface FormValues {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
}

const inputCls =
  "h-14 w-full rounded-[28px] border-2 border-concord/25 bg-white px-5 text-[16px] font-medium text-concord outline-none transition-colors placeholder:text-concord/45 focus:border-concord";

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block pl-2 text-[13px] font-bold uppercase tracking-[0.04em]">{label}</span>
      {children}
      {error && <span className="mt-1 block pl-2 text-[13px] font-semibold text-bubblegum">{error}</span>}
    </label>
  );
}

export default function Checkout() {
  const { lines, subtotalCents, setQty, clear } = useCart();
  const [shipping, setShipping] = useState<ShippingId>("standard");
  const [, navigate] = useLocation();
  const createOrder = useCreateOrder();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { country: "France" } });

  const shippingCents = shippingCost(shipping, subtotalCents);
  const total = subtotalCents + shippingCents;
  const req = "Champ requis";

  const onSubmit = handleSubmit((v) => {
    createOrder.mutate(
      {
        ...v,
        phone: v.phone || undefined,
        shippingMethod: shipping,
        items: lines.map((l) => ({ sizeId: l.sizeId, quantity: l.quantity })),
      },
      {
        onSuccess: (order) => {
          clear();
          navigate(`/merci/${order.number}`);
        },
      },
    );
  });

  return (
    <div className="min-h-screen bg-lilac">
      <Header variant="lilac" />
      <main className="mx-auto max-w-[1300px] px-5 pb-24 pt-6 md:px-10">
        <Link to="/" className="inline-flex items-center gap-2 text-[15px] font-bold uppercase">
          <ArrowLeft className="size-4" /> Continuer mes achats
        </Link>
        <h1 className="mt-6 text-[44px] font-bold uppercase leading-none md:text-[64px]">Commande</h1>

        {lines.length === 0 ? (
          <div className="mt-10 rounded-[25px] bg-white p-10 text-center">
            <p className="text-[24px] font-bold">Ton panier est vide.</p>
            <Link
              to="/#formats"
              className="mt-6 inline-flex rounded-[20px] bg-concord px-7 py-4 text-[18px] font-bold uppercase leading-[20px] text-white"
            >
              Choisir un format
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-10 grid items-start gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-10">
              <section>
                <h2 className="flex items-center gap-3 text-[26px] font-bold leading-none">
                  <span className="grid size-9 place-items-center rounded-full bg-concord text-[16px] text-white">1</span>
                  Contact
                </h2>
                <div className="mt-5 grid gap-4">
                  <Field label="E-mail" error={errors.email?.message}>
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="toi@exemple.fr"
                      className={inputCls}
                      {...register("email", { required: req, pattern: { value: /\S+@\S+\.\S+/, message: "E-mail invalide" } })}
                    />
                  </Field>
                </div>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-[26px] font-bold leading-none">
                  <span className="grid size-9 place-items-center rounded-full bg-concord text-[16px] text-white">2</span>
                  Livraison
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Prénom" error={errors.firstName?.message}>
                    <input className={inputCls} {...register("firstName", { required: req })} />
                  </Field>
                  <Field label="Nom" error={errors.lastName?.message}>
                    <input className={inputCls} {...register("lastName", { required: req })} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Adresse" error={errors.address?.message}>
                      <input
                        autoComplete="street-address"
                        placeholder="12 rue des Fougères"
                        className={inputCls}
                        {...register("address", { required: req, minLength: { value: 3, message: "Adresse trop courte" } })}
                      />
                    </Field>
                  </div>
                  <Field label="Code postal" error={errors.postalCode?.message}>
                    <input
                      autoComplete="postal-code"
                      className={inputCls}
                      {...register("postalCode", { required: req, minLength: { value: 3, message: "Code invalide" } })}
                    />
                  </Field>
                  <Field label="Ville" error={errors.city?.message}>
                    <input autoComplete="address-level2" className={inputCls} {...register("city", { required: req })} />
                  </Field>
                  <Field label="Pays" error={errors.country?.message}>
                    <select className={cn(inputCls, "appearance-none")} {...register("country", { required: req })}>
                      {["France", "Belgique", "Suisse", "Luxembourg", "Monaco"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Téléphone (optionnel)">
                    <input type="tel" autoComplete="tel" className={inputCls} {...register("phone")} />
                  </Field>
                </div>

                <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                  {SHIPPING_METHODS.map((m) => {
                    const active = shipping === m.id;
                    const cost = shippingCost(m.id, subtotalCents);
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setShipping(m.id)}
                        aria-pressed={active}
                        className={cn(
                          "flex items-center justify-between gap-3 rounded-[52px] border-2 border-concord px-6 py-3 text-left transition-colors",
                          active ? "bg-concord text-white" : "bg-white text-concord",
                        )}
                      >
                        <span>
                          <span className="block text-[17px] font-semibold leading-[1.4]">{m.label}</span>
                          <span className={cn("block text-[13px]", active ? "text-white/75" : "text-concord/70")}>{m.eta}</span>
                        </span>
                        <span className="text-[17px] font-bold">{cost === 0 ? "Offerte" : formatEuro(cost)}</span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h2 className="flex items-center gap-3 text-[26px] font-bold leading-none">
                  <span className="grid size-9 place-items-center rounded-full bg-concord text-[16px] text-white">3</span>
                  Paiement
                </h2>
                <div className="radius-cut mt-5 bg-white/60 p-5">
                  <p className="flex items-center gap-2 text-[16px] font-bold">
                    <Lock className="size-4" /> Mode démo — aucun paiement n'est débité
                  </p>
                  <p className="mt-1 text-[14px] leading-[1.5] text-concord/80">
                    La commande est enregistrée et confirmée. Le paiement par carte sera activé dès la connexion d'un prestataire de paiement.
                  </p>
                </div>
              </section>
            </div>

            <aside className="rounded-[25px] bg-white p-6 shadow-float md:p-[50px] lg:sticky lg:top-6">
              <h2 className="text-[26px] font-bold uppercase leading-none">Récap</h2>
              <ul className="mt-6 space-y-4">
                {lines.map((l) => {
                  const s = sizeById(l.sizeId)!;
                  return (
                    <li key={l.sizeId} className="flex items-center gap-4">
                      <img src={s.image} alt="" className="size-16 rounded-[14px] bg-lilac object-cover" />
                      <div className="flex-1">
                        <p className="text-[16px] font-bold uppercase leading-tight">{s.name}</p>
                        <p className="text-[13px] text-concord/70">{s.volume}</p>
                        <div className="mt-1 flex items-center gap-1">
                          <button type="button" onClick={() => setQty(l.sizeId, l.quantity - 1)} className="grid size-6 place-items-center rounded-full border border-concord" aria-label="Moins">
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-[14px] font-bold">{l.quantity}</span>
                          <button type="button" onClick={() => setQty(l.sizeId, l.quantity + 1)} className="grid size-6 place-items-center rounded-full border border-concord" aria-label="Plus">
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>
                      <span className="text-[16px] font-bold">{formatEuro(s.priceCents * l.quantity)}</span>
                    </li>
                  );
                })}
              </ul>
              <dl className="mt-6 space-y-2 border-t-2 border-dashed border-softgrape pt-5 text-[16px]">
                <div className="flex justify-between">
                  <dt>Sous-total</dt>
                  <dd className="font-semibold">{formatEuro(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Livraison</dt>
                  <dd className="font-semibold">{shippingCents === 0 ? "Offerte" : formatEuro(shippingCents)}</dd>
                </div>
                <div className="flex items-baseline justify-between pt-2 text-[24px] font-bold leading-[1.25]">
                  <dt>Total</dt>
                  <dd>{formatEuro(total)}</dd>
                </div>
                <p className="text-[12px] text-concord/60">TVA incluse</p>
              </dl>
              {createOrder.isError && (
                <p className="mt-4 rounded-[20px] bg-bubblegum/10 px-4 py-3 text-[14px] font-semibold text-bubblegum">
                  {createOrder.error.message || "Une erreur est survenue, réessaie."}
                </p>
              )}
              <button
                type="submit"
                disabled={createOrder.isPending}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[20px] bg-concord px-4 py-4 text-[22px] font-bold leading-[22px] text-white transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                {createOrder.isPending && <Loader2 className="size-5 animate-spin" />}
                Confirmer · {formatEuro(total)}
              </button>
            </aside>
          </form>
        )}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
