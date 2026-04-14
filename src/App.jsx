import { useState, useEffect, useRef, createContext, useContext } from "react";
import { products, reviews, categories } from "./data/products";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Palette : noir profond + vert forêt + blanc cassé
// Style : éditorial, épuré, COS / Aritzia / Jacquemus
const C = {
  bg:        "#0e1210",
  surface:   "#161c17",
  surface2:  "#1e2720",
  border:    "rgba(255,255,255,0.06)",
  borderMd:  "rgba(255,255,255,0.10)",
  forest:    "#3a6b4a",
  forestHov: "#4a8a5e",
  forestPale:"rgba(58,107,74,0.12)",
  white:     "#f4f6f4",
  muted:     "#8a9e8d",
  dim:       "#4a5c4c",
};

const AppContext = createContext();
const useApp = () => useContext(AppContext);
const fmt = (p) => `${p} €`;
const off = (o, p) => Math.round(((o - p) / o) * 100);

// ─── STARS ───────────────────────────────────────────────────────────────────
function Stars({ rating, size = 10 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 1.5, lineHeight: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.floor(rating) ? C.forestHov : C.surface2 }}>★</span>
      ))}
    </span>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ label }) {
  const map = {
    Limited: { bg: C.forest,    color: "#fff" },
    New:     { bg: C.forestHov, color: "#fff" },
  };
  const s = map[label] || { bg: C.surface2, color: C.muted };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", padding: "3px 8px", textTransform: "uppercase" }}>
      {label}
    </span>
  );
}

// ─── BUTTON PRIMARY ───────────────────────────────────────────────────────────
function Btn({ onClick, children, disabled, block, outline }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: block ? "100%" : "auto",
        padding: "13px 28px",
        background: outline ? "transparent" : (hov && !disabled ? C.forestHov : C.forest),
        color: outline ? (hov ? C.white : C.muted) : "#fff",
        border: outline ? `1px solid ${hov ? C.borderMd : C.border}` : "none",
        fontSize: 11, fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
        transition: "all .18s",
      }}>
      {children}
    </button>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ onNavigate, cartCount, wishlistCount }) {
  const [solid, setSolid]     = useState(false);
  const [search, setSearch]   = useState(false);
  const [q, setQ]             = useState("");
  const { user } = useApp();

  useEffect(() => {
    const h = () => setSolid(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      background: solid ? "rgba(14,18,16,0.96)" : "rgba(14,18,16,0.75)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${solid ? C.border : "transparent"}`,
      transition: "all .3s",
    }}>
      {/* Livraison strip */}
      <div style={{ background: C.forest, textAlign: "center", padding: "6px 0", fontSize: 10, letterSpacing: "0.18em", color: "rgba(255,255,255,0.9)", fontWeight: 500, textTransform: "uppercase" }}>
        Livraison internationale gratuite dès 150 €
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>

        {/* Logo */}
        <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: C.white, letterSpacing: "0.25em", textTransform: "uppercase" }}>
            FRESH<span style={{ color: C.forestHov }}>WARE</span>
          </span>
        </button>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 32, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {[["Accueil","home"],["Catalogue","catalogue"],["Nouveautés","catalogue","new"],["Best Sellers","catalogue","bestseller"]].map(([l,p,f]) => (
            <NLink key={l} onClick={() => onNavigate(p,f)}>{l}</NLink>
          ))}
        </nav>

        {/* Icons */}
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {search && (
            <input autoFocus value={q} onChange={e => setQ(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && q.trim()) { onNavigate("catalogue",null,q); setSearch(false); setQ(""); } if (e.key === "Escape") setSearch(false); }}
              placeholder="Rechercher..."
              style={{ width: 190, padding: "7px 14px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 12, color: C.white, outline: "none", letterSpacing: "0.02em" }}
            />
          )}
          <NIcon onClick={() => setSearch(!search)}>
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </NIcon>
          <NIcon onClick={() => onNavigate("wishlist")} badge={wishlistCount}>
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </NIcon>
          <NIcon onClick={() => onNavigate("cart")} badge={cartCount}>
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </NIcon>
          <button onClick={() => onNavigate(user ? "account" : "login")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", color: C.muted, textTransform: "uppercase", transition: "color .15s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.white}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}>
            {user ? user.name.split(" ")[0] : "Connexion"}
          </button>
        </div>
      </div>
    </header>
  );
}

function NLink({ onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: h ? C.white : C.muted, transition: "color .15s" }}>
      {children}
    </button>
  );
}

function NIcon({ onClick, badge, children }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: h ? C.white : C.muted, transition: "color .15s", display: "flex", padding: 3 }}>
      {children}
      {badge > 0 && (
        <span style={{ position: "absolute", top: -1, right: -1, width: 14, height: 14, background: C.forest, borderRadius: "50%", fontSize: 8, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{badge}</span>
      )}
    </button>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onNavigate, delay = 0 }) {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const [visible, setVisible] = useState(false);
  const [added, setAdded]     = useState(false);
  const [hov, setHov]         = useState(false);
  const ref = useRef();
  const wished = wishlist.includes(product.id);

  useEffect(() => {
    const t = setTimeout(() => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.05 });
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  const doCart = (e) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article ref={ref} onClick={() => onNavigate("product",null,null,product.id)}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ cursor: "pointer", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(16px)", transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms` }}>

      {/* Image wrapper — 3/4 portrait */}
      <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: C.surface, marginBottom: 12 }}>
        <img src={product.images[0]} alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .65s ease", transform: hov ? "scale(1.03)" : "scale(1)" }}
          loading="lazy"
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 4 }}>
          {product.badge && <Badge label={product.badge} />}
          {product.isNew && !product.badge && <Badge label="New" />}
        </div>

        {/* Wishlist icon */}
        <button onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, background: "rgba(14,18,16,.75)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: hov || wished ? 1 : 0, transition: "opacity .2s" }}>
          <svg width="14" height="14" fill={wished ? C.forestHov : "none"} stroke={wished ? C.forestHov : C.white} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>

        {/* Quick add */}
        <button onClick={doCart}
          style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "11px", background: added ? "#2d6b42" : C.forest, color: "#fff", border: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", cursor: "pointer", transform: hov ? "translateY(0)" : "translateY(100%)", transition: "transform .25s ease, background .2s" }}>
          {added ? "✓ Ajouté" : "Ajouter"}
        </button>

        {product.stock <= 5 && (
          <div style={{ position: "absolute", bottom: hov ? 44 : 10, left: 10, fontSize: 10, fontWeight: 500, color: "#f5a623", transition: "bottom .25s" }}>
            {product.stock} restant{product.stock > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Text */}
      <div>
        <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 2 }}>{product.brand}</div>
        <div style={{ fontSize: 13, fontWeight: 500, color: hov ? C.white : "#cdd6ce", marginBottom: 5, lineHeight: 1.3, transition: "color .15s" }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{fmt(product.price)}</span>
          <span style={{ fontSize: 11, color: C.dim, textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>
          <span style={{ fontSize: 10, fontWeight: 600, color: C.forestHov, marginLeft: "auto" }}>−{off(product.originalPrice, product.price)}%</span>
        </div>
      </div>
    </article>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ onNavigate }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 80); return () => clearTimeout(t); }, []);

  const bests   = products.filter(p => p.isBestSeller).slice(0, 4);
  const newOnes = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div>
      {/* ─── HERO ─── */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end" }}>
        {/* Background photo — tu peux changer cette URL par ta propre photo */}
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
          alt="FreshWare hero"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,18,16,1) 0%, rgba(14,18,16,0.5) 50%, rgba(14,18,16,0.15) 100%)" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1280, margin: "0 auto", padding: "0 28px 80px", width: "100%" }}>
          <div style={{ maxWidth: 580 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.3em", color: C.forestHov, textTransform: "uppercase", marginBottom: 16, opacity: vis ? 1 : 0, transition: "opacity .8s ease .1s" }}>
              Streetwear & Luxe — Prix accessibles
            </p>
            <h1 style={{ fontSize: "clamp(48px,6.5vw,84px)", fontWeight: 800, color: C.white, lineHeight: 1.02, letterSpacing: "-0.03em", margin: "0 0 18px",
              opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(20px)", transition: "all .9s ease .2s" }}>
              Stay Fresh.<br /><em style={{ fontStyle: "italic", fontWeight: 300, color: "#c5d9c9" }}>Stay Ahead.</em>
            </h1>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 32, maxWidth: 440,
              opacity: vis ? 1 : 0, transition: "opacity .9s ease .4s" }}>
              Les pièces que tu veux. Les prix que tu mérites. Livraison internationale, authenticité garantie sur chaque article.
            </p>
            <div style={{ display: "flex", gap: 10, opacity: vis ? 1 : 0, transition: "opacity .9s ease .55s" }}>
              <Btn onClick={() => onNavigate("catalogue")}>Découvrir la boutique</Btn>
              <Btn onClick={() => onNavigate("catalogue","new")} outline>Nouveautés</Btn>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)" }}>
          {[["1 247+","Avis 5 étoiles"],["15 000+","Clients"],["200+","Références"],["7–12j","Livraison"]].map(([v,l],i) => (
            <div key={l} style={{ textAlign: "center", padding: "22px 12px", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.white, marginBottom: 3 }}>{v}</div>
              <div style={{ fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: C.dim }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BEST SELLERS ─── */}
      <section style={{ padding: "80px 28px", maxWidth: 1280, margin: "0 auto" }}>
        <SHead eyebrow="Sélection" title="Best Sellers" cta="Tout voir" onCta={() => onNavigate("catalogue","bestseller")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {bests.map((p,i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*70} />)}
        </div>
      </section>

      {/* ─── SPLIT EDITORIAL ─── */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 480, margin: "0 0 80px" }}>
        <div style={{ position: "relative", overflow: "hidden" }}>
          {/* Photo éditoriale — remplace cette URL par ta photo */}
          <img src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=900&q=80" alt="Hoodie"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,18,16,.9) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: 32, left: 36, right: 36 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.2em", color: C.forestHov, textTransform: "uppercase", marginBottom: 8 }}>Exclusivité FreshWare</p>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 18, lineHeight: 1.2 }}>Hoodie Chrome Logo</h3>
            <Btn onClick={() => onNavigate("product",null,null,11)}>Voir le produit</Btn>
          </div>
        </div>
        <div style={{ background: C.surface, display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 52px" }}>
          <p style={{ fontSize: 10, letterSpacing: "0.25em", color: C.forestHov, textTransform: "uppercase", marginBottom: 18 }}>Notre promesse</p>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: C.white, margin: "0 0 18px", lineHeight: 1.12, letterSpacing: "-0.02em" }}>
            Des pièces rares.<br />Des prix qui font sens.
          </h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
            On chasse pour toi les meilleures pièces streetwear et luxe du marché. Chaque article est authentifié avant expédition. Pas de compromis.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 36 }}>
            {[
              "Authenticité garantie sur chaque pièce",
              "Livraison internationale sécurisée 7–12 jours",
              "Paiement CB, PayPal ou Revolut",
              "Support disponible sous 48h",
            ].map(t => (
              <div key={t} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.forest, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: C.muted }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{ width: "fit-content" }}>
            <Btn onClick={() => onNavigate("catalogue")} outline>Explorer le catalogue</Btn>
          </div>
        </div>
      </section>

      {/* ─── CATÉGORIES ─── */}
      <section style={{ padding: "0 28px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <SHead eyebrow="Collections" title="Catégories" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10 }}>
          {categories.filter(c => c.id !== "all").map(cat => {
            const n = products.filter(p => p.category === cat.id).length;
            return <CatBtn key={cat.id} cat={cat} count={n} onClick={() => onNavigate("catalogue",cat.id)} />;
          })}
        </div>
      </section>

      {/* ─── NOUVEAUTÉS ─── */}
      <section style={{ padding: "0 28px 80px", maxWidth: 1280, margin: "0 auto" }}>
        <SHead eyebrow="Vient d'arriver" title="Nouveautés" cta="Tout voir" onCta={() => onNavigate("catalogue","new")} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {newOnes.map((p,i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*70} />)}
        </div>
      </section>

      {/* ─── AVIS ─── */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "80px 28px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 10, letterSpacing: "0.25em", color: C.forestHov, textTransform: "uppercase", marginBottom: 12 }}>Ils nous font confiance</p>
            <h2 style={{ fontSize: 30, fontWeight: 800, color: C.white, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Avis clients</h2>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              <Stars rating={4.9} size={13} />
              <span style={{ fontSize: 13, fontWeight: 700, color: C.white }}>4.9</span>
              <span style={{ fontSize: 13, color: C.muted }}>· 1 247 avis vérifiés</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {reviews.map(r => (
              <div key={r.id} style={{ background: C.bg, padding: 28, border: `1px solid ${C.border}` }}>
                <Stars rating={r.rating} size={12} />
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.75, margin: "14px 0 20px", fontStyle: "italic" }}>"{r.comment}"</p>
                <div style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 18, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.white }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: C.dim }}>{r.date} · <span style={{ color: C.forestHov }}>✓ Achat vérifié</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIVRAISON ─── */}
      <section style={{ padding: "80px 28px", maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 10, letterSpacing: "0.25em", color: C.forestHov, textTransform: "uppercase", marginBottom: 16 }}>Livraison mondiale</p>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: C.white, margin: "0 0 18px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>On livre partout dans le monde</h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 32 }}>
            Livraison sécurisée en 7 à 12 jours ouvrés. Suivi en temps réel, emballage soigné.
          </p>
          <Btn onClick={() => onNavigate("catalogue")}>Commander maintenant</Btn>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[["🚚","7–12 jours","Livraison internationale"],["📦","Suivi inclus","Tracking temps réel"],["💳","CB · PayPal · Revolut","3 moyens de paiement"],["🔒","100% Sécurisé","Paiement protégé"]].map(([ic,t,s]) => (
            <div key={t} style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 22 }}>
              <div style={{ fontSize: 22, marginBottom: 12 }}>{ic}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 4 }}>{t}</div>
              <div style={{ fontSize: 11, color: C.dim }}>{s}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── SMALL HELPERS ────────────────────────────────────────────────────────────
function SHead({ eyebrow, title, cta, onCta }) {
  const [h, setH] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32 }}>
      <div>
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: C.forestHov, textTransform: "uppercase", margin: "0 0 8px" }}>{eyebrow}</p>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-0.02em" }}>{title}</h2>
      </div>
      {cta && (
        <button onClick={onCta} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: h ? C.white : C.muted, transition: "color .15s", textDecoration: h ? "underline" : "none", textUnderlineOffset: 4 }}>
          {cta} →
        </button>
      )}
    </div>
  );
}

function CatBtn({ cat, count, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ background: h ? C.surface2 : C.surface, border: `1px solid ${h ? C.borderMd : C.border}`, padding: "26px 10px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}>
      <div style={{ fontSize: 26, marginBottom: 10 }}>{cat.icon}</div>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.white, marginBottom: 3 }}>{cat.label}</div>
      <div style={{ fontSize: 10, color: C.dim }}>{count} articles</div>
    </button>
  );
}

// ─── CATALOGUE ────────────────────────────────────────────────────────────────
function CataloguePage({ onNavigate, initialFilter, initialSearch }) {
  const [cat, setCat]     = useState(initialFilter === "new" || initialFilter === "bestseller" ? "all" : (initialFilter || "all"));
  const [sort, setSort]   = useState("default");
  const [fNew, setFNew]   = useState(initialFilter === "new");
  const [fBest, setFBest] = useState(initialFilter === "bestseller");
  const [q, setQ]         = useState(initialSearch || "");

  let list = products;
  if (cat !== "all") list = list.filter(p => p.category === cat);
  if (fNew)  list = list.filter(p => p.isNew);
  if (fBest) list = list.filter(p => p.isBestSeller);
  if (q) list = list.filter(p => (p.name + p.brand).toLowerCase().includes(q.toLowerCase()));
  if (sort === "price-asc")  list = [...list].sort((a,b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a,b) => b.price - a.price);
  if (sort === "rating")     list = [...list].sort((a,b) => b.rating - a.rating);

  const Pill = ({ active, onClick, children }) => {
    const [h, setH] = useState(false);
    return (
      <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
        style={{ padding: "8px 16px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", transition: "all .15s",
          background: active ? C.forest : "transparent",
          color: active ? "#fff" : (h ? C.white : C.muted),
          border: `1px solid ${active ? C.forest : C.border}` }}>
        {children}
      </button>
    );
  };

  return (
    <div style={{ paddingTop: 102, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ paddingBottom: 24, borderBottom: `1px solid ${C.border}`, marginBottom: 28 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: C.white, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Catalogue</h1>
          <p style={{ fontSize: 12, color: C.dim, margin: 0 }}>{list.length} produits</p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36, alignItems: "center" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Rechercher..."
            style={{ padding: "8px 16px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 12, color: C.white, outline: "none", width: 190, letterSpacing: "0.02em" }} />
          {categories.map(c => <Pill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</Pill>)}
          <Pill active={fNew}  onClick={() => setFNew(!fNew)}>Nouveautés</Pill>
          <Pill active={fBest} onClick={() => setFBest(!fBest)}>Best Sellers</Pill>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ marginLeft: "auto", padding: "8px 16px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 11, color: C.muted, outline: "none", cursor: "pointer" }}>
            <option value="default">Trier par défaut</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Meilleures notes</option>
          </select>
        </div>

        {list.length === 0
          ? <div style={{ textAlign: "center", padding: "80px 0" }}><p style={{ fontSize: 14, color: C.muted }}>Aucun produit trouvé</p></div>
          : <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {list.map((p,i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*45} />)}
            </div>
        }
      </div>
    </div>
  );
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────────────────────
function ProductPage({ productId, onNavigate }) {
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const product = products.find(p => p.id === productId);
  const [size, setSize]   = useState(null);
  const [imgI, setImgI]   = useState(0);
  const [added, setAdded] = useState(false);
  const [err, setErr]     = useState(false);
  if (!product) return null;
  const wished  = wishlist.includes(product.id);
  const related = products.filter(p => p.category === product.category && p.id !== productId).slice(0,4);

  const doAdd = () => {
    if (!size) { setErr(true); setTimeout(() => setErr(false), 1800); return; }
    addToCart(product, size); setAdded(true); setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ paddingTop: 102, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, fontSize: 11, color: C.dim, marginBottom: 36, alignItems: "center" }}>
          {[["Accueil","home",null],["","catalogue",product.category,"capitalize"],[product.name,null]].map((item,i) => {
            const [label, page, filter, style] = Array.isArray(item) ? item : [item,null];
            return page
              ? <span key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <button onClick={() => onNavigate(page,filter)} style={{ background:"none",border:"none",cursor:"pointer",fontSize:11,color:C.dim,textTransform:style||"none" }}>
                    {label || product.category}
                  </button>
                  <span style={{color:C.border}}>/</span>
                </span>
              : <span key={i} style={{color:C.muted}}>{label}</span>;
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, marginBottom: 80 }}>
          {/* Gallery */}
          <div>
            <div style={{ aspectRatio: "3/4", overflow: "hidden", background: C.surface, marginBottom: 12 }}>
              <img src={product.images[imgI] || product.images[0]} alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {product.images.map((img,i) => (
                  <button key={i} onClick={() => setImgI(i)}
                    style={{ width: 64, height: 82, overflow: "hidden", border: `2px solid ${imgI === i ? C.forest : "transparent"}`, cursor: "pointer", background: "none", padding: 0, flexShrink: 0, transition: "border-color .15s" }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: C.dim, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 6 }}>{product.brand}</div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-0.01em" }}>{product.name}</h1>
              </div>
              <button onClick={() => toggleWishlist(product.id)}
                style={{ background: "none", border: `1px solid ${C.border}`, padding: "9px 10px", cursor: "pointer", display: "flex", flexShrink: 0, transition: "border-color .15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.borderMd}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <svg width="16" height="16" fill={wished ? C.forestHov : "none"} stroke={wished ? C.forestHov : C.muted} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 22 }}>
              <Stars rating={product.rating} size={12} />
              <span style={{ fontSize: 12, color: C.dim }}>{product.rating}/5 · {product.reviews} avis</span>
            </div>

            <div style={{ paddingBottom: 20, borderBottom: `1px solid ${C.border}`, marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 6 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: C.white }}>{fmt(product.price)}</span>
                <span style={{ fontSize: 16, color: C.dim, textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.forestHov }}>−{off(product.originalPrice, product.price)}%</span>
              </div>
              <div style={{ fontSize: 12, color: C.forestHov }}>Tu économises {product.originalPrice - product.price} €</div>
            </div>

            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>{product.description}</p>

            {/* Colors */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 10, color: C.dim, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Coloris</div>
              <div style={{ display: "flex", gap: 8 }}>
                {product.colors.map(c => (
                  <span key={c} style={{ padding: "6px 12px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: err ? "#ef4444" : C.dim, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                {err ? "↑ Choisissez une taille" : "Taille"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSize(s)}
                    style={{ padding: "9px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .15s",
                      background: size === s ? C.forest : "transparent",
                      color: size === s ? "#fff" : C.muted,
                      border: `1px solid ${size === s ? C.forest : err ? "rgba(239,68,68,.5)" : C.border}` }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <button onClick={doAdd}
              style={{ width: "100%", padding: "15px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "#fff", transition: "background .2s",
                background: added ? "#2d6b42" : C.forest }}>
              {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
            </button>

            {/* Guarantees */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", marginTop: 12, border: `1px solid ${C.border}`, borderBottom: "none" }}>
              {[["🚚","7–12j"],["🔒","Sécurisé"],["✅","Authentique"]].map(([ic,l],i) => (
                <div key={l} style={{ textAlign: "center", padding: "14px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none", borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ fontSize: 16, marginBottom: 3 }}>{ic}</div>
                  <div style={{ fontSize: 10, color: C.dim }}>{l}</div>
                </div>
              ))}
            </div>

            {product.stock <= 10 && (
              <p style={{ marginTop: 14, fontSize: 12, color: "#f5a623", fontWeight: 500 }}>
                Seulement {product.stock} exemplaire{product.stock > 1 ? "s" : ""} disponible{product.stock > 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <>
            <div style={{ paddingTop: 40, borderTop: `1px solid ${C.border}`, marginBottom: 32 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-0.01em" }}>Vous aimerez aussi</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
              {related.map((p,i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*70} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── CART ─────────────────────────────────────────────────────────────────────
function CartPage({ onNavigate }) {
  const { cart, removeFromCart, updateCartQty } = useApp();
  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const ship  = total > 150 ? 0 : 9.99;

  if (cart.length === 0) return (
    <div style={{ paddingTop: 102, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: C.white, marginBottom: 10, letterSpacing: "-0.02em" }}>Votre panier est vide</h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>Découvrez nos dernières pièces</p>
      <Btn onClick={() => onNavigate("catalogue")}>Explorer la boutique</Btn>
    </div>
  );

  return (
    <div style={{ paddingTop: 102, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: C.white, marginBottom: 36, letterSpacing: "-0.02em" }}>Panier</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>
          <div>
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 18, paddingBottom: 22, marginBottom: 22, borderBottom: `1px solid ${C.border}` }}>
                <img src={item.images[0]} alt={item.name}
                  style={{ width: 88, height: 116, objectFit: "cover", cursor: "pointer", flexShrink: 0 }}
                  onClick={() => onNavigate("product",null,null,item.id)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, color: C.dim, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>{item.brand}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.white, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginBottom: 16 }}>Taille : {item.size}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", border: `1px solid ${C.border}` }}>
                    <button onClick={() => updateCartQty(item.id,item.size,item.qty-1)} style={{ width: 32, height: 32, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.muted }}>−</button>
                    <span style={{ width: 30, textAlign: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id,item.size,item.qty+1)} style={{ width: 32, height: 32, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.muted }}>+</button>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <button onClick={() => removeFromCart(item.id,item.size)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.dim, lineHeight: 1 }}>×</button>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{fmt(item.price * item.qty)}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 24, height: "fit-content", position: "sticky", top: 102 }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: C.white, marginBottom: 20, marginTop: 0, letterSpacing: "0.12em", textTransform: "uppercase" }}>Récapitulatif</h3>
            {[["Sous-total", fmt(total.toFixed(2))], ["Livraison", ship === 0 ? "Offerte" : fmt(ship)]].map(([l,v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 12 }}>
                <span style={{ color: C.muted }}>{l}</span>
                <span style={{ color: ship === 0 && l === "Livraison" ? C.forestHov : C.white }}>{v}</span>
              </div>
            ))}
            {ship > 0 && <p style={{ fontSize: 11, color: C.dim, marginBottom: 12 }}>Livraison offerte dès 150 €</p>}
            <div style={{ height: 1, background: C.border, margin: "16px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontWeight: 700, color: C.white, fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: 20, color: C.white }}>{fmt((total + ship).toFixed(2))}</span>
            </div>
            <Btn onClick={() => onNavigate("checkout")} block>Commander</Btn>
            <div style={{ marginTop: 14, display: "flex", justifyContent: "center", gap: 14 }}>
              {["💳 CB","🅿️ PayPal","🔄 Revolut"].map(m => <span key={m} style={{ fontSize: 10, color: C.dim }}>{m}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
function CheckoutPage({ onNavigate }) {
  const { cart, clearCart } = useApp();
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState({ name:"",email:"",address:"",city:"",zip:"",country:"",payment:"card" });
  const [done, setDone]     = useState(false);
  const total = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const ship  = total > 150 ? 0 : 9.99;

  const Inp = ({ f, ph, type="text" }) => (
    <input type={type} placeholder={ph} value={form[f]} onChange={e => setForm({...form,[f]:e.target.value})}
      style={{ width:"100%", padding:"12px 14px", background:C.surface, border:`1px solid ${C.border}`, fontSize:13, color:C.white, outline:"none", boxSizing:"border-box" }} />
  );

  if (done) return (
    <div style={{ paddingTop: 102, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div>
        <div style={{ width: 60, height: 60, border: `2px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 22, color: C.forestHov }}>✓</div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: C.white, marginBottom: 10, letterSpacing: "-0.02em" }}>Commande confirmée</h2>
        <p style={{ fontSize: 14, color: C.muted, marginBottom: 8 }}>Un email de confirmation vous a été envoyé.</p>
        <p style={{ fontSize: 13, color: C.dim, marginBottom: 32 }}>Livraison prévue dans 7 à 12 jours ouvrés.</p>
        <Btn onClick={() => onNavigate("home")}>Retour à l'accueil</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 102, paddingBottom: 80 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.white, marginBottom: 32, letterSpacing: "-0.02em" }}>Finaliser la commande</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 36 }}>
          {["Livraison","Paiement"].map((label,i) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: step >= i+1 ? C.forest : "transparent", color: step >= i+1 ? "#fff" : C.dim, border: `1px solid ${step >= i+1 ? C.forest : C.border}`, transition: "all .2s" }}>{i+1}</div>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: step >= i+1 ? C.white : C.dim }}>{label}</span>
              {i < 1 && <span style={{ color: C.border, margin: "0 6px" }}>—</span>}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 28 }}>
          <div>
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Adresse de livraison</p>
                <Inp f="name" ph="Nom complet" />
                <Inp f="email" ph="Email" type="email" />
                <Inp f="address" ph="Adresse complète" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <Inp f="city" ph="Ville" />
                  <Inp f="zip" ph="Code postal" />
                </div>
                <Inp f="country" ph="Pays" />
                <div style={{ marginTop: 6 }}>
                  <Btn onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.address}>Continuer →</Btn>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.white, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Paiement</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {[["card","💳","Carte bancaire"],["paypal","🅿️","PayPal"],["revolut","🔄","Revolut"]].map(([id,ic,label]) => (
                    <button key={id} onClick={() => setForm({...form,payment:id})}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", cursor: "pointer", transition: "all .15s",
                        background: form.payment === id ? C.forestPale : "transparent",
                        border: `1px solid ${form.payment === id ? C.forest : C.border}` }}>
                      <span style={{ fontSize: 18 }}>{ic}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{label}</span>
                      {form.payment === id && <span style={{ marginLeft: "auto", color: C.forestHov }}>✓</span>}
                    </button>
                  ))}
                </div>
                {form.payment === "card" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                    <input placeholder="Numéro de carte" style={{ padding:"12px 14px", background:C.surface, border:`1px solid ${C.border}`, fontSize:13, color:C.white, outline:"none" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input placeholder="MM/AA" style={{ padding:"12px 14px", background:C.surface, border:`1px solid ${C.border}`, fontSize:13, color:C.white, outline:"none" }} />
                      <input placeholder="CVV" style={{ padding:"12px 14px", background:C.surface, border:`1px solid ${C.border}`, fontSize:13, color:C.white, outline:"none" }} />
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(1)} style={{ padding:"13px 22px", background:"none", border:`1px solid ${C.border}`, fontSize:11, color:C.muted, cursor:"pointer", letterSpacing:"0.1em" }}>← Retour</button>
                  <Btn onClick={() => { clearCart(); setDone(true); }}>Confirmer · {fmt((total + ship).toFixed(2))}</Btn>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 20, height: "fit-content" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: C.white, marginTop: 0, marginBottom: 16, letterSpacing: "0.12em", textTransform: "uppercase" }}>Commande</p>
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                <img src={item.images[0]} alt="" style={{ width: 40, height: 52, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: C.dim }}>×{item.qty} — {item.size}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.white, flexShrink: 0 }}>{fmt(item.price * item.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: C.white, paddingTop: 4 }}>
              <span>Total</span><span>{fmt((total + ship).toFixed(2))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ onNavigate }) {
  const { login } = useApp();
  const [isLog, setIsLog] = useState(true);
  const [form, setForm]   = useState({ name:"", email:"", password:"" });
  const [err, setErr]     = useState("");
  const Inp = ({ f, ph, type="text" }) => (
    <input type={type} placeholder={ph} value={form[f]} onChange={e => setForm({...form,[f]:e.target.value})}
      style={{ width:"100%", padding:"13px 16px", background:C.surface, border:`1px solid ${C.border}`, fontSize:13, color:C.white, outline:"none", boxSizing:"border-box" }} />
  );
  return (
    <div style={{ paddingTop: 102, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: "0 28px" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.25em", color: C.forestHov, textTransform: "uppercase", marginBottom: 14 }}>FreshWare</p>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.white, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{isLog ? "Bon retour" : "Créer un compte"}</h1>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 28 }}>{isLog ? "Connectez-vous à votre compte" : "Rejoignez la communauté"}</p>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 28 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {!isLog && <Inp f="name" ph="Nom complet" />}
            <Inp f="email" ph="Email" type="email" />
            <Inp f="password" ph="Mot de passe" type="password" />
          </div>
          {err && <p style={{ color:"#ef4444", fontSize:12, marginTop:10 }}>{err}</p>}
          <div style={{ marginTop: 16 }}>
            <Btn block onClick={() => {
              if (!form.email || !form.password) { setErr("Remplissez tous les champs."); return; }
              if (!isLog && !form.name) { setErr("Entrez votre nom."); return; }
              login({ name: form.name || form.email.split("@")[0], email: form.email });
              onNavigate("account");
            }}>{isLog ? "Se connecter" : "Créer le compte"}</Btn>
          </div>
          <button onClick={() => { setIsLog(!isLog); setErr(""); }}
            style={{ marginTop: 14, width: "100%", textAlign: "center", fontSize: 12, color: C.muted, background: "none", border: "none", cursor: "pointer" }}>
            {isLog ? "Pas de compte ? S'inscrire →" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNT ──────────────────────────────────────────────────────────────────
function AccountPage({ onNavigate }) {
  const { user, logout } = useApp();
  if (!user) { onNavigate("login"); return null; }
  const orders = [
    { id:"#FW-2847", date:"05/04/2026", items:["Air Phantom X (T.42)","Cap Structured (Noir)"], total:"224 €", status:"Livré", ok:true },
    { id:"#FW-2391", date:"20/03/2026", items:["Hoodie Chrome Logo (L)"], total:"89 €", status:"En cours", ok:false },
  ];
  return (
    <div style={{ paddingTop: 102, paddingBottom: 80 }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 48, height: 48, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff" }}>{user.name[0].toUpperCase()}</div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: C.white, margin: 0 }}>{user.name}</h1>
              <p style={{ fontSize: 12, color: C.dim, margin: 0 }}>{user.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); onNavigate("home"); }}
            style={{ background:"none", border:`1px solid ${C.border}`, padding:"8px 16px", fontSize:10, letterSpacing:"0.12em", textTransform:"uppercase", color:C.muted, cursor:"pointer" }}>
            Déconnexion
          </button>
        </div>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 20, letterSpacing: "0.1em", textTransform: "uppercase" }}>Commandes</h2>
        {orders.map(o => (
          <div key={o.id} style={{ padding: "18px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{o.id}</div>
                <div style={{ fontSize: 11, color: C.dim }}>{o.date}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: C.white }}>{o.total}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", letterSpacing: "0.08em", textTransform: "uppercase",
                  background: o.ok ? C.forestPale : "transparent",
                  color: o.ok ? C.forestHov : C.muted,
                  border: `1px solid ${o.ok ? C.forest : C.border}` }}>{o.status}</span>
              </div>
            </div>
            {o.items.map(i => <div key={i} style={{ fontSize: 12, color: C.muted }}>— {i}</div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
function WishlistPage({ onNavigate }) {
  const { wishlist } = useApp();
  const items = products.filter(p => wishlist.includes(p.id));
  if (items.length === 0) return (
    <div style={{ paddingTop: 102, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: C.white, marginBottom: 10, letterSpacing: "-0.02em" }}>Wishlist vide</h2>
      <p style={{ fontSize: 14, color: C.muted, marginBottom: 28 }}>Cliquez sur ♥ pour sauvegarder vos coups de cœur</p>
      <Btn onClick={() => onNavigate("catalogue")}>Explorer la boutique</Btn>
    </div>
  );
  return (
    <div style={{ paddingTop: 102, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 28px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: C.white, marginBottom: 36, letterSpacing: "-0.02em" }}>Ma Wishlist</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {items.map((p,i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*70} />)}
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ onNavigate }) {
  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "56px 28px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 44, marginBottom: 44 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: C.white, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>
              FRESH<span style={{ color: C.forestHov }}>WARE</span>
            </div>
            <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: C.dim, marginBottom: 14 }}>Stay Fresh. Stay Ahead.</div>
            <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.7, maxWidth: 220 }}>Streetwear & luxe à prix accessibles. Authenticité garantie.</p>
          </div>
          {[
            { title:"Boutique", links:[["Catalogue","catalogue"],["Nouveautés","catalogue","new"],["Best Sellers","catalogue","bestseller"],["Sneakers","catalogue","sneakers"]] },
            { title:"Compte",   links:[["Connexion","login"],["Mon compte","account"],["Wishlist","wishlist"],["Panier","cart"]] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.white, marginBottom: 14 }}>{col.title}</div>
              {col.links.map(([label, page, filter]) => (
                <button key={label} onClick={() => onNavigate(page, filter)}
                  style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: C.muted, padding: "5px 0", transition: "color .15s", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.color = C.white}
                  onMouseLeave={e => e.currentTarget.style.color = C.muted}>
                  {label}
                </button>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: C.white, marginBottom: 14 }}>Infos</div>
            {[["🚚","Livraison","7–12 jours ouvrés"],["💳","Paiement","CB · PayPal · Revolut"],["✅","Authenticité","Certifiée & garantie"]].map(([ic,l,s]) => (
              <div key={l} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 13 }}>{ic}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>{l}</div>
                  <div style={{ fontSize: 10, color: C.dim }}>{s}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.dim }}>© 2026 FreshWare. Tous droits réservés.</span>
          <div style={{ display: "flex", gap: 22 }}>
            {["CGV","Confidentialité","Mentions légales"].map(l => (
              <button key={l} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.dim, transition: "color .15s" }}
                onMouseEnter={e => e.currentTarget.style.color = C.muted}
                onMouseLeave={e => e.currentTarget.style.color = C.dim}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2400); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999,
      display: "flex", alignItems: "center", gap: 10, padding: "12px 22px",
      background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.forest}`,
      animation: "tin .25s ease", whiteSpace: "nowrap" }}>
      <span style={{ fontSize: 13, color: C.white }}>{message}</span>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]               = useState("home");
  const [pageFilter, setPageFilter]   = useState(null);
  const [pageSearch, setPageSearch]   = useState(null);
  const [pageProduct, setPageProduct] = useState(null);
  const [cart, setCart]               = useState([]);
  const [wishlist, setWishlist]       = useState([]);
  const [user, setUser]               = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = msg => { setToast(null); setTimeout(() => setToast(msg), 10); };
  const navigate  = (p, filter=null, search=null, productId=null) => {
    setPage(p); setPageFilter(filter); setPageSearch(search); setPageProduct(productId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, size) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id && i.size === size);
      return ex ? prev.map(i => i.id === product.id && i.size === size ? {...i, qty: i.qty+1} : i) : [...prev, {...product, size, qty: 1}];
    });
    showToast(`${product.name} ajouté au panier`);
  };

  const removeFromCart = (id, size) => setCart(p => p.filter(i => !(i.id===id && i.size===size)));
  const updateCartQty  = (id, size, qty) => qty <= 0 ? removeFromCart(id,size) : setCart(p => p.map(i => i.id===id && i.size===size ? {...i,qty} : i));
  const clearCart      = () => setCart([]);
  const toggleWishlist = id => {
    setWishlist(prev => {
      const has = prev.includes(id);
      showToast(has ? "Retiré des favoris" : "Ajouté aux favoris");
      return has ? prev.filter(i => i!==id) : [...prev, id];
    });
  };

  const cartCount = cart.reduce((s,i) => s+i.qty, 0);

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQty, clearCart, wishlist, toggleWishlist, user, login: setUser, logout: () => setUser(null) }}>
      <div style={{ background: C.bg, minHeight: "100vh", color: C.white }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${C.bg}; color: ${C.white}; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
          @keyframes tin { from { opacity:0; transform:translateX(-50%) translateY(8px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
          ::-webkit-scrollbar { width: 3px; }
          ::-webkit-scrollbar-track { background: ${C.bg}; }
          ::-webkit-scrollbar-thumb { background: ${C.forest}; }
          input::placeholder { color: ${C.dim}; }
          select option { background: ${C.surface}; }
        `}</style>

        <Navbar onNavigate={navigate} cartCount={cartCount} wishlistCount={wishlist.length} />

        {page === "home"      && <HomePage      onNavigate={navigate} />}
        {page === "catalogue" && <CataloguePage onNavigate={navigate} initialFilter={pageFilter} initialSearch={pageSearch} />}
        {page === "product"   && <ProductPage   productId={pageProduct} onNavigate={navigate} />}
        {page === "cart"      && <CartPage      onNavigate={navigate} />}
        {page === "checkout"  && <CheckoutPage  onNavigate={navigate} />}
        {page === "login"     && <AuthPage      onNavigate={navigate} />}
        {page === "account"   && <AccountPage   onNavigate={navigate} />}
        {page === "wishlist"  && <WishlistPage  onNavigate={navigate} />}

        <Footer onNavigate={navigate} />
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </div>
    </AppContext.Provider>
  );
}
