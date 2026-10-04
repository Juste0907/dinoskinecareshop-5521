import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { sizeById, type SizeId } from "../../api/catalog";

export interface CartLine {
  sizeId: SizeId;
  quantity: number;
}

interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (sizeId: SizeId, qty?: number) => void;
  setQty: (sizeId: SizeId, qty: number) => void;
  remove: (sizeId: SizeId) => void;
  clear: () => void;
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "dino-cart-v1";

function load(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return parsed.filter((l) => sizeById(l.sizeId) && l.quantity > 0);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines]);

  const add = useCallback((sizeId: SizeId, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.sizeId === sizeId);
      if (found)
        return prev.map((l) =>
          l.sizeId === sizeId ? { ...l, quantity: Math.min(20, l.quantity + qty) } : l,
        );
      return [...prev, { sizeId, quantity: qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback((sizeId: SizeId, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.sizeId !== sizeId)
        : prev.map((l) => (l.sizeId === sizeId ? { ...l, quantity: Math.min(20, qty) } : l)),
    );
  }, []);

  const remove = useCallback((sizeId: SizeId) => {
    setLines((prev) => prev.filter((l) => l.sizeId !== sizeId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((t, l) => t + l.quantity, 0);
    const subtotalCents = lines.reduce(
      (t, l) => t + (sizeById(l.sizeId)?.priceCents ?? 0) * l.quantity,
      0,
    );
    return { lines, count, subtotalCents, open, setOpen, add, setQty, remove, clear };
  }, [lines, open, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
