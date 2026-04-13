import { useState, useEffect, useRef, createContext, useContext } from "react";
import { products, reviews, categories } from "./data/products";

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  black:       "#0c0f0c",
  white:       "#f8faf8",
  forest:      "#2d5a3d",
  forestLight: "#3d7a54",
  forestPale:  "#e8f0ea",
  gray100:     "#f2f4f2",
  gray200:     "#e4e8e4",
  gray400:     "#9aab9c",
  gray600:     "#5a6b5c",
  text:        "#1a201a",
  textMuted:   "#6b7c6d",
  textLight:   "#9aab9c",
  bg:          "#0c0f0c",
  surface:     "#131713",
  surface2:    "#1a1f1a",
  border:      "rgba(255,255,255,0.07)",
  borderLight: "rgba(255,255,255,0.12)",
};

const AppContext = createContext();
const useApp = () => useContext(AppContext);
const fmt  = (p) => `${p} €`;
const pct  = (o, p) => Math.round(((o - p) / o) * 100);

// ─── STARS ───────────────────────────────────────────────────────────────────
function Stars({ rating, size = 11 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 2 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.floor(rating) ? C.forestLight : C.surface2 }}>★</span>
      ))}
    </span>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ label }) {
  const styles = {
    Limited: { bg: C.forest,      color: "#fff" },
    New:     { bg: C.forestLight, color: "#fff" },
  };
  const s = styles[label] || { bg: C.surface2, color: C.textMuted };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", padding: "3px 9px", borderRadius: 4 }}>
      {label?.toUpperCase()}
    </span>
  );
}

// ─── BUTTONS ─────────────────────────────────────────────────────────────────
function BtnPrimary({ onClick, children, disabled, full }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: full ? "100%" : "auto", padding: "14px 32px",
        background: hov ? C.forestLight : C.forest,
        color: "#fff", border: "none", borderRadius: 0,
        fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
        transition: "background .2s",
      }}>
      {children}
    </button>
  );
}

function BtnGhost({ onClick, children, full }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: full ? "100%" : "auto", padding: "13px 32px",
        background: "transparent",
        color: hov ? C.white : C.gray400,
        border: `1px solid ${hov ? C.borderLight : C.border}`,
        borderRadius: 0,
        fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase",
        cursor: "pointer", transition: "all .2s",
      }}>
      {children}
    </button>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ onNavigate, cartCount, wishlistCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOn, setSearchOn] = useState(false);
  const [query, setQuery]       = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useApp();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(12,15,12,0.97)" : "rgba(12,15,12,0.6)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
        transition: "all .35s ease",
      }}>
        {/* Top strip */}
        <div style={{ background: C.forest, textAlign: "center", padding: "7px 0", fontSize: 10, letterSpacing: "0.15em", color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
          LIVRAISON INTERNATIONALE — 7 À 12 JOURS — PAIEMENT SÉCURISÉ
        </div>

        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.white, letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1 }}>
              Fresh<span style={{ color: C.forestLight }}>Ware</span>
            </div>
          </button>

          {/* Center links */}
          <div style={{ display: "flex", gap: 36, alignItems: "center", position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            {[["Accueil","home"],["Catalogue","catalogue"],["Nouveautés","catalogue","new"],["Best Sellers","catalogue","bestseller"]].map(([label, page, filter]) => (
              <NavLink key={label} onClick={() => onNavigate(page, filter)}>{label}</NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {searchOn && (
              <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && query.trim()) { onNavigate("catalogue", null, query); setSearchOn(false); setQuery(""); } if (e.key === "Escape") setSearchOn(false); }}
                placeholder="Rechercher..."
                style={{ width: 180, padding: "8px 14px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 12, color: C.white, outline: "none", letterSpacing: "0.03em" }}
              />
            )}
            <NavIcon onClick={() => setSearchOn(!searchOn)} title="Recherche">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </NavIcon>
            <NavIcon onClick={() => onNavigate("wishlist")} badge={wishlistCount}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </NavIcon>
            <NavIcon onClick={() => onNavigate("cart")} badge={cartCount}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            </NavIcon>
            <button onClick={() => onNavigate(user ? "account" : "login")}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: C.gray400, textTransform: "uppercase", transition: "color .2s" }}
              onMouseEnter={e => e.currentTarget.style.color = C.white}
              onMouseLeave={e => e.currentTarget.style.color = C.gray400}>
              {user ? user.name.split(" ")[0] : "Connexion"}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

function NavLink({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: hov ? C.white : C.gray400, transition: "color .2s" }}>
      {children}
    </button>
  );
}

function NavIcon({ onClick, badge, children, title }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: hov ? C.white : C.gray400, transition: "color .2s", padding: 4, display: "flex" }}>
      {children}
      {badge > 0 && (
        <span style={{ position: "absolute", top: -2, right: -2, width: 15, height: 15, background: C.forest, borderRadius: "50%", fontSize: 8, fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>{badge}</span>
      )}
    </button>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────────────────────
function ProductCard({ product, onNavigate, delay = 0 }) {
  const { wishlist, toggleWishlist, addToCart } = useApp();
  const [visible, setVisible] = useState(false);
  const [added, setAdded]     = useState(false);
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const isWished = wishlist.includes(product.id);

  useEffect(() => {
    const t = setTimeout(() => {
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.06 });
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div ref={ref} onClick={() => onNavigate("product", null, null, product.id)}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: `opacity .5s ease ${delay}ms, transform .5s ease ${delay}ms` }}>

      {/* Image */}
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4", background: C.surface, marginBottom: 14 }}>
        <img src={product.images[0]} alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform .7s ease", transform: hovered ? "scale(1.04)" : "scale(1)" }}
          loading="lazy"
        />

        {/* Badges top-left */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 4 }}>
          {product.badge && <Badge label={product.badge} />}
          {product.isNew && !product.badge && <Badge label="New" />}
        </div>

        {/* Wishlist */}
        <button onClick={e => { e.stopPropagation(); toggleWishlist(product.id); }}
          style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, background: "rgba(12,15,12,0.7)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: hovered || isWished ? 1 : 0, transition: "opacity .2s" }}>
          <svg width="15" height="15" fill={isWished ? C.forestLight : "none"} stroke={isWished ? C.forestLight : "#fff"} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>

        {/* Add to cart on hover */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, transform: hovered ? "translateY(0)" : "translateY(100%)", transition: "transform .3s ease" }}>
          <button onClick={e => { e.stopPropagation(); addToCart(product, product.sizes[0]); setAdded(true); setTimeout(() => setAdded(false), 1800); }}
            style={{ width: "100%", padding: "13px", background: added ? "#2d7a4f" : C.forest, color: "#fff", border: "none", cursor: "pointer", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", transition: "background .2s" }}>
            {added ? "✓ AJOUTÉ" : "AJOUTER AU PANIER"}
          </button>
        </div>

        {/* Low stock */}
        {product.stock <= 5 && (
          <div style={{ position: "absolute", bottom: hovered ? 46 : 12, left: 12, fontSize: 10, fontWeight: 600, color: "#fbbf24", transition: "bottom .3s" }}>
            Plus que {product.stock} en stock
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 10, color: C.textLight, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{product.brand}</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.white, lineHeight: 1.3 }}>{product.name}</div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: 8 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>{fmt(product.price)}</div>
            <div style={{ fontSize: 11, color: C.textLight, textDecoration: "line-through" }}>{fmt(product.originalPrice)}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Stars rating={product.rating} size={10} />
          <span style={{ fontSize: 10, color: C.textLight }}>({product.reviews})</span>
          <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: C.forestLight }}>−{pct(product.originalPrice, product.price)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage({ onNavigate }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 4);

  const anim = (delay = 0) => ({
    opacity: vis ? 1 : 0,
    transform: vis ? "translateY(0)" : "translateY(18px)",
    transition: `all .8s ease ${delay}ms`,
  });

  return (
    <div>
      {/* ── HERO ── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: C.bg }}>
        {/* BG image overlay */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,15,12,0.95) 40%, rgba(12,15,12,0.5))" }} />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1320, margin: "0 auto", padding: "120px 32px 80px", width: "100%" }}>
          <div style={{ maxWidth: 560 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.3em", color: C.forestLight, textTransform: "uppercase", marginBottom: 20, ...anim(0) }}>
              Luxe & Streetwear — Prix accessibles
            </div>
            <h1 style={{ fontSize: "clamp(52px, 7vw, 88px)", fontWeight: 800, color: C.white, lineHeight: 1.02, letterSpacing: "-0.02em", margin: "0 0 20px", ...anim(100) }}>
              Stay Fresh.<br /><span style={{ color: C.forestLight }}>Stay Ahead.</span>
            </h1>
            <p style={{ fontSize: 16, color: C.gray400, lineHeight: 1.7, marginBottom: 36, fontWeight: 400, maxWidth: 440, ...anim(200) }}>
              Les pièces streetwear et luxe que tu veux, aux prix que tu mérites. Livraison internationale, authenticité garantie.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", ...anim(300) }}>
              <BtnPrimary onClick={() => onNavigate("catalogue")}>Explorer la boutique</BtnPrimary>
              <BtnGhost onClick={() => onNavigate("catalogue", "new")}>Nouveautés</BtnGhost>
            </div>
          </div>
        </div>

        {/* Scroll */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: vis ? 0.5 : 0, transition: "opacity 1s ease 1s" }}>
          <div style={{ width: 1, height: 40, background: `linear-gradient(${C.forestLight}, transparent)` }} />
          <span style={{ fontSize: 9, letterSpacing: "0.25em", color: C.gray400, textTransform: "uppercase" }}>Défiler</span>
        </div>
      </section>

      {/* ── STRIP ── */}
      <div style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {[["1 247+", "Avis 5 étoiles"], ["15 000+", "Clients"], ["200+", "Références"], ["7–12j", "Livraison"]].map(([val, label], i) => (
            <div key={label} style={{ flex: 1, textAlign: "center", padding: "20px 16px", borderRight: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.white, marginBottom: 2 }}>{val}</div>
              <div style={{ fontSize: 10, color: C.textLight, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── BEST SELLERS ── */}
      <section style={{ padding: "80px 32px", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 10, color: C.forestLight, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>Sélection</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-0.02em" }}>Best Sellers</h2>
          </div>
          <TextLink onClick={() => onNavigate("catalogue", "bestseller")}>Voir tout →</TextLink>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {bestSellers.map((p, i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i * 80} />)}
        </div>
      </section>

      {/* ── EDITORIAL BANNER ── */}
      <section style={{ margin: "0 32px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 440 }}>
        <div style={{ position: "relative", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80" alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(12,15,12,.85) 0%, transparent 50%)" }} />
          <div style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.25em", color: C.forestLight, textTransform: "uppercase", marginBottom: 8 }}>FreshWare Original</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.white, marginBottom: 16, lineHeight: 1.2 }}>Hoodie Chrome Logo</div>
            <BtnPrimary onClick={() => onNavigate("product", null, null, 11)}>Voir le produit</BtnPrimary>
          </div>
        </div>

        <div style={{ background: C.surface, padding: 48, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ fontSize: 10, color: C.forestLight, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16 }}>Notre engagement</div>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: "0 0 20px", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            Des pièces rares.<br />Des prix justes.
          </h2>
          <p style={{ fontSize: 14, color: C.gray400, lineHeight: 1.75, marginBottom: 32 }}>
            On sélectionne chaque article à la main. Sneakers, hoodies, maillots — uniquement des pièces qui valent le coup, à des prix que tu n'aurais pas trouvés ailleurs.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 36 }}>
            {[["✓","Authenticité garantie sur chaque article"],["✓","Livraison internationale sécurisée"],["✓","Remboursement si non conforme"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ color: C.forestLight, fontWeight: 700, fontSize: 13, marginTop: 1 }}>{icon}</span>
                <span style={{ fontSize: 13, color: C.gray400, lineHeight: 1.4 }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ width: "fit-content" }}>
            <BtnGhost onClick={() => onNavigate("catalogue")}>Voir le catalogue</BtnGhost>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <div style={{ fontSize: 10, color: C.forestLight, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>Collections</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-0.02em" }}>Catégories</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {categories.filter(c => c.id !== "all").map(cat => {
            const count = products.filter(p => p.category === cat.id).length;
            return (
              <CatCard key={cat.id} cat={cat} count={count} onClick={() => onNavigate("catalogue", cat.id)} />
            );
          })}
        </div>
      </section>

      {/* ── NOUVEAUTÉS ── */}
      <section style={{ padding: "0 32px 80px", maxWidth: 1320, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <div style={{ fontSize: 10, color: C.forestLight, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>Vient d'arriver</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-0.02em" }}>Nouveautés</h2>
          </div>
          <TextLink onClick={() => onNavigate("catalogue", "new")}>Voir tout →</TextLink>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {newArrivals.map((p, i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i * 80} />)}
        </div>
      </section>

      {/* ── AVIS ── */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "80px 32px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ fontSize: 10, color: C.forestLight, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>Ils parlent de nous</div>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, margin: "0 0 12px", letterSpacing: "-0.02em" }}>Ce que disent nos clients</h2>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
              <Stars rating={4.9} size={14} />
              <span style={{ fontSize: 13, color: C.white, fontWeight: 700 }}>4.9</span>
              <span style={{ fontSize: 13, color: C.textLight }}>sur 1 247 avis vérifiés</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {reviews.map(r => (
              <div key={r.id} style={{ background: C.bg, padding: 28, border: `1px solid ${C.border}` }}>
                <Stars rating={r.rating} size={12} />
                <p style={{ fontSize: 13, color: C.gray400, lineHeight: 1.7, margin: "14px 0 16px", fontStyle: "italic" }}>"{r.comment}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{r.avatar}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: C.white }}>{r.name}</div>
                    <div style={{ fontSize: 10, color: C.textLight }}>{r.date} · <span style={{ color: C.forestLight }}>✓ Vérifié</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVRAISON ── */}
      <section style={{ padding: "80px 32px", maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 10, color: C.forestLight, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 16 }}>Partout dans le monde</div>
          <h2 style={{ fontSize: 32, fontWeight: 800, color: C.white, margin: "0 0 20px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>On vous livre où que vous soyez</h2>
          <p style={{ fontSize: 14, color: C.gray400, lineHeight: 1.75, marginBottom: 32 }}>
            Livraison internationale sécurisée en 7 à 12 jours ouvrés. Chaque commande est suivie en temps réel et emballée avec soin.
          </p>
          <BtnPrimary onClick={() => onNavigate("catalogue")}>Commander maintenant</BtnPrimary>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {[
            ["🚚", "7–12 jours", "Livraison internationale"],
            ["📦", "Suivi inclus", "Tracking en temps réel"],
            ["💳", "3 moyens de paiement", "CB, PayPal, Revolut"],
            ["🔒", "Paiement sécurisé", "100% protégé"],
          ].map(([icon, title, sub]) => (
            <div key={title} style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 24 }}>
              <div style={{ fontSize: 22, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.white, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 11, color: C.textLight }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function CatCard({ cat, count, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: hov ? C.surface2 : C.surface, border: `1px solid ${hov ? C.borderLight : C.border}`, padding: "28px 16px", textAlign: "center", cursor: "pointer", transition: "all .2s" }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: C.white, marginBottom: 4, letterSpacing: "0.05em" }}>{cat.label}</div>
      <div style={{ fontSize: 10, color: C.textLight }}>{count} articles</div>
    </button>
  );
}

function TextLink({ onClick, children }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: hov ? C.white : C.textLight, transition: "color .2s", textDecoration: hov ? "underline" : "none", textUnderlineOffset: 4 }}>
      {children}
    </button>
  );
}

// ─── CATALOGUE ────────────────────────────────────────────────────────────────
function CataloguePage({ onNavigate, initialFilter, initialSearch }) {
  const [cat, setCat]       = useState(initialFilter === "new" || initialFilter === "bestseller" ? "all" : (initialFilter || "all"));
  const [sort, setSort]     = useState("default");
  const [isNew, setIsNew]   = useState(initialFilter === "new");
  const [isBest, setIsBest] = useState(initialFilter === "bestseller");
  const [search, setSearch] = useState(initialSearch || "");

  let filtered = products;
  if (cat !== "all") filtered = filtered.filter(p => p.category === cat);
  if (isNew)  filtered = filtered.filter(p => p.isNew);
  if (isBest) filtered = filtered.filter(p => p.isBestSeller);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
  if (sort === "price-asc")  filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "rating")     filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ minHeight: "100vh", paddingTop: 108 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px 80px" }}>
        {/* Header */}
        <div style={{ paddingBottom: 28, borderBottom: `1px solid ${C.border}`, marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: C.white, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Catalogue</h1>
          <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{filtered.length} produits</p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, alignItems: "center" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..."
            style={{ padding: "9px 16px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 12, color: C.white, outline: "none", width: 180, letterSpacing: "0.02em" }} />
          {categories.map(c => (
            <FilterPill key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</FilterPill>
          ))}
          <FilterPill active={isNew} onClick={() => setIsNew(!isNew)}>Nouveautés</FilterPill>
          <FilterPill active={isBest} onClick={() => setIsBest(!isBest)}>Best Sellers</FilterPill>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ marginLeft: "auto", padding: "9px 16px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 11, color: C.textLight, outline: "none", cursor: "pointer", letterSpacing: "0.05em" }}>
            <option value="default">Trier par défaut</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Meilleures notes</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: C.textLight }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>—</div>
            <p style={{ fontSize: 14, fontWeight: 600, color: C.gray400 }}>Aucun produit trouvé</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
            {filtered.map((p, i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i * 50} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterPill({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ padding: "9px 18px", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", cursor: "pointer", transition: "all .15s", textTransform: "uppercase",
        background: active ? C.forest : "transparent",
        color: active ? "#fff" : C.textLight,
        border: `1px solid ${active ? C.forest : C.border}` }}>
      {children}
    </button>
  );
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────────────────────
function ProductPage({ productId, onNavigate }) {
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const product = products.find(p => p.id === productId);
  const [selSize, setSelSize] = useState(null);
  const [imgIdx, setImgIdx]   = useState(0);
  const [added, setAdded]     = useState(false);
  const [sizeErr, setSizeErr] = useState(false);
  if (!product) return null;
  const isWished = wishlist.includes(product.id);
  const related  = products.filter(p => p.category === product.category && p.id !== productId).slice(0, 4);

  const handleAdd = () => {
    if (!selSize) { setSizeErr(true); setTimeout(() => setSizeErr(false), 2000); return; }
    addToCart(product, selSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", paddingTop: 108 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px 80px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 36, fontSize: 11, color: C.textLight, letterSpacing: "0.05em" }}>
          <button onClick={() => onNavigate("home")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.textLight }}>Accueil</button>
          <span>/</span>
          <button onClick={() => onNavigate("catalogue", product.category)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.textLight, textTransform: "capitalize" }}>{product.category}</button>
          <span>/</span>
          <span style={{ color: C.gray400 }}>{product.name}</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, marginBottom: 80 }}>
          {/* Images */}
          <div>
            <div style={{ overflow: "hidden", aspectRatio: "3/4", background: C.surface, marginBottom: 12 }}>
              <img src={product.images[imgIdx] || product.images[0]} alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: 8 }}>
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    style={{ width: 72, height: 96, overflow: "hidden", border: `2px solid ${imgIdx === i ? C.forest : "transparent"}`, cursor: "pointer", background: "none", padding: 0, flexShrink: 0 }}>
                    <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 10, color: C.textLight, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>{product.brand}</div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-0.01em", lineHeight: 1.1 }}>{product.name}</h1>
              </div>
              <button onClick={() => toggleWishlist(product.id)}
                style={{ background: "none", border: `1px solid ${C.border}`, padding: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" fill={isWished ? C.forestLight : "none"} stroke={isWished ? C.forestLight : C.gray400} strokeWidth="1.5" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <Stars rating={product.rating} size={12} />
              <span style={{ fontSize: 12, color: C.textLight }}>{product.rating}/5 — {product.reviews} avis</span>
            </div>

            <div style={{ paddingBottom: 20, borderBottom: `1px solid ${C.border}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: C.white }}>{fmt(product.price)}</span>
                <span style={{ fontSize: 16, color: C.textLight, textDecoration: "line-through" }}>{fmt(product.originalPrice)}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.forestLight, background: `rgba(45,90,61,.15)`, padding: "3px 10px", border: `1px solid rgba(61,122,84,.2)` }}>
                  −{pct(product.originalPrice, product.price)}%
                </span>
              </div>
              <div style={{ fontSize: 12, color: C.forestLight, marginTop: 6 }}>
                Tu économises {product.originalPrice - product.price} €
              </div>
            </div>

            <p style={{ fontSize: 14, color: C.gray400, lineHeight: 1.75, marginBottom: 24 }}>{product.description}</p>

            {/* Colors */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: C.textLight, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Coloris</div>
              <div style={{ display: "flex", gap: 8 }}>
                {product.colors.map(c => (
                  <span key={c} style={{ padding: "6px 12px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 12, color: C.gray400 }}>{c}</span>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 10, color: sizeErr ? "#ef4444" : C.textLight, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
                {sizeErr ? "Sélectionnez une taille" : "Taille"}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.sizes.map(size => (
                  <button key={size} onClick={() => setSelSize(size)}
                    style={{ padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all .15s",
                      background: selSize === size ? C.forest : "transparent",
                      color: selSize === size ? "#fff" : C.gray400,
                      border: `1px solid ${selSize === size ? C.forest : sizeErr ? "rgba(239,68,68,.5)" : C.border}` }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAdd}
              style={{ width: "100%", padding: "16px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff", transition: "background .2s",
                background: added ? "#2d7a4f" : C.forest }}>
              {added ? "✓ Ajouté au panier" : "Ajouter au panier"}
            </button>

            {/* Guarantees */}
            <div style={{ display: "flex", gap: 0, marginTop: 16, border: `1px solid ${C.border}` }}>
              {[["🚚","7–12j"],["🔒","Sécurisé"],["✅","Authentique"]].map(([icon, label], i) => (
                <div key={label} style={{ flex: 1, textAlign: "center", padding: "14px 8px", borderRight: i < 2 ? `1px solid ${C.border}` : "none" }}>
                  <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 10, color: C.textLight, letterSpacing: "0.08em" }}>{label}</div>
                </div>
              ))}
            </div>

            {product.stock <= 10 && (
              <div style={{ marginTop: 14, fontSize: 12, color: "#fbbf24", fontWeight: 600 }}>
                Il ne reste que {product.stock} exemplaire{product.stock > 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, paddingTop: 40, borderTop: `1px solid ${C.border}` }}>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: 0, letterSpacing: "-0.01em" }}>Vous pourriez aussi aimer</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
              {related.map((p, i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i * 80} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CART ─────────────────────────────────────────────────────────────────────
function CartPage({ onNavigate }) {
  const { cart, removeFromCart, updateCartQty } = useApp();
  const total    = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total > 100 ? 0 : 9.99;

  if (cart.length === 0) return (
    <div style={{ minHeight: "100vh", paddingTop: 108, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.25em", color: C.textLight, textTransform: "uppercase", marginBottom: 16 }}>Panier vide</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 12, letterSpacing: "-0.02em" }}>Rien ici pour l'instant</h2>
      <p style={{ fontSize: 14, color: C.textLight, marginBottom: 32 }}>Découvrez notre sélection de pièces exclusives</p>
      <BtnPrimary onClick={() => onNavigate("catalogue")}>Explorer la boutique</BtnPrimary>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingTop: 108, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: C.white, marginBottom: 40, letterSpacing: "-0.02em" }}>Mon Panier</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {cart.map((item, idx) => (
              <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 20, padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
                <img src={item.images[0]} alt={item.name} style={{ width: 100, height: 130, objectFit: "cover", cursor: "pointer", flexShrink: 0 }} onClick={() => onNavigate("product", null, null, item.id)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: C.textLight, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{item.brand}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.white, marginBottom: 6 }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: C.textLight, marginBottom: 16 }}>Taille : {item.size}</div>
                  <div style={{ display: "flex", alignItems: "center", border: `1px solid ${C.border}`, width: "fit-content" }}>
                    <button onClick={() => updateCartQty(item.id, item.size, item.qty - 1)} style={{ width: 34, height: 34, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.textLight }}>−</button>
                    <span style={{ width: 32, textAlign: "center", fontSize: 13, fontWeight: 700, color: C.white }}>{item.qty}</span>
                    <button onClick={() => updateCartQty(item.id, item.size, item.qty + 1)} style={{ width: 34, height: 34, background: "none", border: "none", cursor: "pointer", fontSize: 16, color: C.textLight }}>+</button>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <button onClick={() => removeFromCart(item.id, item.size)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: C.textLight, lineHeight: 1 }}>×</button>
                  <span style={{ fontSize: 16, fontWeight: 700, color: C.white }}>{fmt(item.price * item.qty)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 28, height: "fit-content", position: "sticky", top: 108 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 20, marginTop: 0, letterSpacing: "0.05em", textTransform: "uppercase" }}>Récapitulatif</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              {[["Sous-total", fmt(total.toFixed(2))], ["Livraison", shipping === 0 ? "Offerte" : fmt(shipping)]].map(([l, v]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: C.textLight }}>{l}</span>
                  <span style={{ color: shipping === 0 && l === "Livraison" ? C.forestLight : C.white }}>{v}</span>
                </div>
              ))}
              {shipping > 0 && <div style={{ fontSize: 11, color: C.textLight }}>Livraison offerte dès 100 €</div>}
              <div style={{ height: 1, background: C.border }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontWeight: 700, color: C.white, letterSpacing: "0.05em", textTransform: "uppercase", fontSize: 12 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 20, color: C.white }}>{fmt((total + shipping).toFixed(2))}</span>
              </div>
            </div>
            <BtnPrimary onClick={() => onNavigate("checkout")} full>Passer la commande</BtnPrimary>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 14 }}>
              {["💳 CB", "🅿️ PayPal", "🔄 Revolut"].map(m => <span key={m} style={{ fontSize: 10, color: C.textLight }}>{m}</span>)}
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
  const [form, setForm]     = useState({ name:"", email:"", address:"", city:"", country:"", zip:"", payment:"card" });
  const [done, setDone]     = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const feeShip = total > 100 ? 0 : 9.99;

  const inp = (field, placeholder, type = "text") => (
    <input type={type} placeholder={placeholder} value={form[field]} onChange={e => setForm({ ...form, [field]: e.target.value })}
      style={{ width: "100%", padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 13, color: C.white, outline: "none", boxSizing: "border-box", letterSpacing: "0.02em" }} />
  );

  if (done) return (
    <div style={{ minHeight: "100vh", paddingTop: 108, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div>
        <div style={{ width: 64, height: 64, border: `2px solid ${C.forest}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 24, color: C.forestLight }}>✓</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 10, letterSpacing: "-0.02em" }}>Commande confirmée</h2>
        <p style={{ fontSize: 14, color: C.textLight, marginBottom: 6 }}>Un email de confirmation vous a été envoyé.</p>
        <p style={{ fontSize: 13, color: C.textLight, marginBottom: 36 }}>Livraison estimée : 7 à 12 jours ouvrés.</p>
        <BtnPrimary onClick={() => onNavigate("home")}>Retour à l'accueil</BtnPrimary>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", paddingTop: 108, paddingBottom: 80 }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 36, letterSpacing: "-0.02em" }}>Finaliser la commande</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 40 }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, transition: "all .3s",
                background: step >= s ? C.forest : "transparent", color: step >= s ? "#fff" : C.textLight, border: `1px solid ${step >= s ? C.forest : C.border}` }}>{s}</div>
              <span style={{ fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: step >= s ? C.white : C.textLight }}>{s === 1 ? "Livraison" : "Paiement"}</span>
              {s < 2 && <span style={{ color: C.border, marginRight: 4 }}>—</span>}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32 }}>
          <div>
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.white, marginTop: 0, marginBottom: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}>Adresse de livraison</h3>
                {inp("name", "Nom complet")}
                {inp("email", "Email", "email")}
                {inp("address", "Adresse")}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {inp("city", "Ville")}
                  {inp("zip", "Code postal")}
                </div>
                {inp("country", "Pays")}
                <div style={{ marginTop: 8 }}>
                  <BtnPrimary onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.address}>Continuer</BtnPrimary>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: C.white, margin: "0 0 16px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Mode de paiement</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                  {[["card", "💳", "Carte bancaire"], ["paypal", "🅿️", "PayPal"], ["revolut", "🔄", "Revolut"]].map(([id, icon, label]) => (
                    <button key={id} onClick={() => setForm({ ...form, payment: id })}
                      style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px", cursor: "pointer", transition: "all .15s",
                        background: form.payment === id ? `rgba(45,90,61,.1)` : "transparent",
                        border: `1px solid ${form.payment === id ? C.forest : C.border}` }}>
                      <span style={{ fontSize: 20 }}>{icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{label}</span>
                      {form.payment === id && <span style={{ marginLeft: "auto", color: C.forestLight, fontWeight: 700 }}>✓</span>}
                    </button>
                  ))}
                </div>
                {form.payment === "card" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    <input placeholder="Numéro de carte" style={{ padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 13, color: C.white, outline: "none" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      <input placeholder="MM/AA" style={{ padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 13, color: C.white, outline: "none" }} />
                      <input placeholder="CVV" style={{ padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 13, color: C.white, outline: "none" }} />
                    </div>
                  </div>
                )}
                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(1)} style={{ padding: "14px 24px", background: "none", border: `1px solid ${C.border}`, fontSize: 11, color: C.textLight, cursor: "pointer", letterSpacing: "0.1em" }}>← Retour</button>
                  <BtnPrimary onClick={() => { clearCart(); setDone(true); }}>Confirmer · {fmt((total + feeShip).toFixed(2))}</BtnPrimary>
                </div>
              </div>
            )}
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 20, height: "fit-content" }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, color: C.white, marginTop: 0, marginBottom: 16, letterSpacing: "0.12em", textTransform: "uppercase" }}>Votre commande</h3>
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} style={{ display: "flex", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${C.border}` }}>
                <img src={item.images[0]} alt="" style={{ width: 44, height: 56, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.white, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: C.textLight }}>×{item.qty} — T.{item.size}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.white }}>{fmt(item.price * item.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 800, color: C.white, paddingTop: 4 }}>
              <span>Total</span><span>{fmt((total + feeShip).toFixed(2))}</span>
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
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState("");
  const inp = (f, ph, type = "text") => (
    <input type={type} placeholder={ph} value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })}
      style={{ width: "100%", padding: "14px 16px", background: C.surface, border: `1px solid ${C.border}`, fontSize: 13, color: C.white, outline: "none", boxSizing: "border-box", letterSpacing: "0.02em" }} />
  );
  return (
    <div style={{ minHeight: "100vh", paddingTop: 108, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 420, padding: "0 32px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 10, color: C.forestLight, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 12 }}>FreshWare</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: C.white, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{isLogin ? "Bon retour" : "Créer un compte"}</h1>
          <p style={{ fontSize: 13, color: C.textLight }}>{isLogin ? "Connectez-vous à votre compte" : "Rejoignez la communauté FreshWare"}</p>
        </div>
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {!isLogin && inp("name", "Nom complet")}
            {inp("email", "Email", "email")}
            {inp("password", "Mot de passe", "password")}
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 10 }}>{error}</p>}
          <div style={{ marginTop: 20 }}>
            <BtnPrimary full onClick={() => {
              if (!form.email || !form.password) { setError("Remplissez tous les champs."); return; }
              if (!isLogin && !form.name) { setError("Entrez votre nom."); return; }
              login({ name: form.name || form.email.split("@")[0], email: form.email });
              onNavigate("account");
            }}>{isLogin ? "Se connecter" : "Créer mon compte"}</BtnPrimary>
          </div>
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ marginTop: 16, width: "100%", textAlign: "center", fontSize: 12, color: C.textLight, background: "none", border: "none", cursor: "pointer", letterSpacing: "0.03em" }}>
            {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
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
    <div style={{ minHeight: "100vh", paddingTop: 108, paddingBottom: 80 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40, paddingBottom: 28, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 52, height: 52, background: C.forest, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" }}>{user.name[0].toUpperCase()}</div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: C.white, margin: 0 }}>{user.name}</h1>
              <p style={{ fontSize: 12, color: C.textLight, margin: 0 }}>{user.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); onNavigate("home"); }} style={{ background: "none", border: `1px solid ${C.border}`, padding: "8px 18px", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: C.textLight, cursor: "pointer" }}>Déconnexion</button>
        </div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 20, letterSpacing: "0.08em", textTransform: "uppercase" }}>Commandes</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {orders.map((o, i) => (
            <div key={o.id} style={{ padding: "20px 0", borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.white }}>{o.id}</div>
                  <div style={{ fontSize: 11, color: C.textLight }}>{o.date}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: C.white }}>{o.total}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", letterSpacing: "0.08em", textTransform: "uppercase",
                    background: o.ok ? "rgba(45,90,61,.15)" : "transparent",
                    color: o.ok ? C.forestLight : C.textLight,
                    border: `1px solid ${o.ok ? C.forest : C.border}` }}>{o.status}</span>
                </div>
              </div>
              {o.items.map(item => <div key={item} style={{ fontSize: 12, color: C.textLight, padding: "2px 0" }}>— {item}</div>)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
function WishlistPage({ onNavigate }) {
  const { wishlist } = useApp();
  const wished = products.filter(p => wishlist.includes(p.id));
  if (wished.length === 0) return (
    <div style={{ minHeight: "100vh", paddingTop: 108, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontSize: 11, letterSpacing: "0.25em", color: C.textLight, textTransform: "uppercase", marginBottom: 16 }}>Wishlist vide</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: C.white, marginBottom: 12, letterSpacing: "-0.02em" }}>Aucun favori</h2>
      <p style={{ fontSize: 14, color: C.textLight, marginBottom: 32 }}>Cliquez sur ♥ pour sauvegarder vos coups de cœur</p>
      <BtnPrimary onClick={() => onNavigate("catalogue")}>Explorer la boutique</BtnPrimary>
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", paddingTop: 108, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "0 32px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: C.white, marginBottom: 40, letterSpacing: "-0.02em" }}>Ma Wishlist</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 24 }}>
          {wished.map((p, i) => <ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i * 80} />)}
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ onNavigate }) {
  return (
    <footer style={{ background: C.surface, borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "60px 32px 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: C.white, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
              Fresh<span style={{ color: C.forestLight }}>Ware</span>
            </div>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", color: C.textLight, textTransform: "uppercase", marginBottom: 16 }}>Stay Fresh. Stay Ahead.</div>
            <p style={{ fontSize: 12, color: C.textLight, lineHeight: 1.7, maxWidth: 240 }}>Votre destination pour le streetwear et le luxe à prix accessibles. Authenticité garantie.</p>
          </div>
          {[
            { title: "Boutique", links: [["Catalogue","catalogue"],["Nouveautés","catalogue","new"],["Best Sellers","catalogue","bestseller"],["Sneakers","catalogue","sneakers"]] },
            { title: "Compte",   links: [["Connexion","login"],["Mon compte","account"],["Ma wishlist","wishlist"],["Mon panier","cart"]] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.white, marginBottom: 16 }}>{col.title}</div>
              {col.links.map(([label, page, filter]) => (
                <button key={label} onClick={() => onNavigate(page, filter)}
                  style={{ display: "block", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: C.textLight, padding: "5px 0", transition: "color .15s", textAlign: "left" }}
                  onMouseEnter={e => e.currentTarget.style.color = C.white}
                  onMouseLeave={e => e.currentTarget.style.color = C.textLight}>
                  {label}
                </button>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: C.white, marginBottom: 16 }}>Infos</div>
            {[["🚚","Livraison","7–12 jours ouvrés"],["💳","Paiement","CB · PayPal · Revolut"],["✅","Authenticité","Certifiée & garantie"]].map(([icon, label, sub]) => (
              <div key={label} style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.gray400 }}>{label}</div>
                  <div style={{ fontSize: 10, color: C.textLight }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: C.textLight }}>© 2026 FreshWare. Tous droits réservés.</span>
          <div style={{ display: "flex", gap: 24 }}>
            {["CGV", "Confidentialité", "Mentions légales"].map(l => (
              <button key={l} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11, color: C.textLight }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9999, display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", background: C.surface, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.forest}`, animation: "toastIn .3s ease" }}>
      <span style={{ fontSize: 13, color: C.white }}>{message}</span>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]             = useState("home");
  const [pageFilter, setPageFilter] = useState(null);
  const [pageSearch, setPageSearch] = useState(null);
  const [pageProduct, setPageProduct] = useState(null);
  const [cart, setCart]             = useState([]);
  const [wishlist, setWishlist]     = useState([]);
  const [user, setUser]             = useState(null);
  const [toast, setToast]           = useState(null);

  const showToast = msg => { setToast(null); setTimeout(() => setToast(msg), 10); };
  const navigate  = (p, filter = null, search = null, productId = null) => {
    setPage(p); setPageFilter(filter); setPageSearch(search); setPageProduct(productId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addToCart = (product, size) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id && i.size === size);
      return ex ? prev.map(i => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...product, size, qty: 1 }];
    });
    showToast(`${product.name} ajouté au panier`);
  };

  const removeFromCart = (id, size) => setCart(p => p.filter(i => !(i.id === id && i.size === size)));
  const updateCartQty  = (id, size, qty) => qty <= 0 ? removeFromCart(id, size) : setCart(p => p.map(i => i.id === id && i.size === size ? { ...i, qty } : i));
  const clearCart      = () => setCart([]);
  const toggleWishlist = (id) => {
    setWishlist(prev => {
      const has = prev.includes(id);
      showToast(has ? "Retiré des favoris" : "Ajouté aux favoris");
      return has ? prev.filter(i => i !== id) : [...prev, id];
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQty, clearCart, wishlist, toggleWishlist, user, login: setUser, logout: () => setUser(null) }}>
      <div style={{ background: C.bg, minHeight: "100vh", color: C.white }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${C.bg}; color: ${C.white}; font-family: 'Inter', system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
          @keyframes toastIn { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-track { background: ${C.bg}; }
          ::-webkit-scrollbar-thumb { background: ${C.forest}; }
          input::placeholder { color: ${C.textLight}; }
          select option { background: ${C.surface}; color: ${C.white}; }
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
