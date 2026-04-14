import { useState, useEffect, useRef, useCallback } from "react";
import { products, reviews, categories } from "./data/products";

// ─── UTILS ────────────────────────────────────────────────────
const formatPrice = (p) => `${p}€`;
const discount = (orig, curr) =>
  orig ? `-${Math.round(((orig - curr) / orig) * 100)}%` : null;

// ─── TOAST ────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast bg-ash border border-zinc text-snow text-xs font-mono px-4 py-3 flex items-center gap-3"
          style={{ minWidth: 240 }}
        >
          <span className="text-acid">{t.icon}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────
function Navbar({ page, setPage, cartCount, wishCount, searchQuery, setSearchQuery }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Accueil" },
    { id: "catalogue", label: "Catalogue" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8,8,8,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(42,42,42,0.8)" : "none",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => setPage("home")}
          className="font-sans font-800 text-xl tracking-tight text-snow hover:text-acid transition-colors duration-200"
          style={{ fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          FRESH<span className="text-acid">WARE</span>
        </button>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <button
              key={l.id}
              onClick={() => setPage(l.id)}
              className={`hover-line font-mono text-xs tracking-widest uppercase transition-colors duration-200 ${
                page === l.id ? "text-acid" : "text-silver hover:text-snow"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Search + actions */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-carbon border border-zinc px-3 py-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-mist">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage("catalogue"); }}
              className="bg-transparent text-snow text-xs font-mono outline-none w-32 placeholder-mist"
            />
          </div>

          <button
            onClick={() => setPage("wishlist")}
            className="relative text-silver hover:text-plasma transition-colors p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishCount > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-plasma text-void text-[9px] font-mono w-4 h-4 flex items-center justify-center rounded-full">
                {wishCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setPage("cart")}
            className="relative text-silver hover:text-acid transition-colors p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-acid text-void text-[9px] font-mono w-4 h-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setPage("account")}
            className="text-silver hover:text-acid transition-colors p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

// ─── TICKER ───────────────────────────────────────────────────
function Ticker() {
  const items = [
    "⚡ LIVRAISON INTERNATIONALE", "★ PAIEMENT SÉCURISÉ", "🔥 DROP HEBDOMADAIRE",
    "⚡ LIVRAISON OFFERTE DÈS 100€", "★ RETOURS 30 JOURS", "🔥 STOCK LIMITÉ",
    "⚡ LIVRAISON INTERNATIONALE", "★ PAIEMENT SÉCURISÉ", "🔥 DROP HEBDOMADAIRE",
    "⚡ LIVRAISON OFFERTE DÈS 100€", "★ RETOURS 30 JOURS", "🔥 STOCK LIMITÉ",
  ];
  return (
    <div className="ticker-wrapper bg-acid py-2">
      <div className="ticker-content gap-12" style={{ gap: "3rem" }}>
        {items.map((item, i) => (
          <span key={i} className="text-void font-mono text-xs tracking-widest uppercase mx-8">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────
function Hero({ setPage }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1600&q=80)`,
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.0) 40%, rgba(8,8,8,0.9) 100%)",
        }}
      />

      {/* Decorative number */}
      <div
        className="absolute top-1/2 right-8 -translate-y-1/2 text-snow pointer-events-none select-none"
        style={{
          fontSize: "clamp(6rem, 20vw, 20rem)",
          fontWeight: 800,
          opacity: 0.04,
          lineHeight: 1,
          letterSpacing: "-0.05em",
        }}
      >
        26
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-xl mx-auto px-6 pb-20 w-full">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="tag tag-acid">SS26 Drop</span>
            <span className="font-mono text-xs text-mist">Nouveautés disponibles</span>
          </div>

          <h1
            className="text-snow mb-6"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: "-0.04em",
            }}
          >
            STAY<br/>
            <span className="text-acid">FRESH</span><br/>
            STAY<br/>
            AHEAD
          </h1>

          <p className="text-silver font-mono text-sm mb-10 max-w-md leading-relaxed">
            Luxe & Streetwear à prix accessibles. Drops exclusifs chaque semaine.<br/>
            Livraison mondiale en 7–12 jours.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <button className="btn-primary" onClick={() => setPage("catalogue")}>
              Explorer le catalogue
            </button>
            <button className="btn-ghost" onClick={() => setPage("catalogue")}>
              Nouveautés →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PRODUCT CARD ─────────────────────────────────────────────
function ProductCard({ product, onAddToCart, onToggleWish, isWished, onClick }) {
  const [hovered, setHovered] = useState(false);
  const disc = discount(product.originalPrice, product.price);

  return (
    <div
      className="product-card cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(product)}
    >
      {/* Image */}
      <div className="relative bg-carbon overflow-hidden" style={{ aspectRatio: "3/4" }}>
        <img
          src={hovered && product.images[1] ? product.images[1] : product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500"
          style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.tags.includes("limited") && (
            <span className="tag tag-plasma">Limited</span>
          )}
          {product.tags.includes("new") && (
            <span className="tag tag-acid">New</span>
          )}
          {disc && (
            <span className="font-mono text-[10px] bg-void text-snow px-2 py-1">{disc}</span>
          )}
        </div>

        {/* Wishlist btn */}
        <button
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-void border border-zinc"
          onClick={(e) => { e.stopPropagation(); onToggleWish(product); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isWished ? "#ff3c5a" : "none"} stroke={isWished ? "#ff3c5a" : "#c8c8c8"} strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Quick add */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-acid p-3 text-void font-mono text-xs tracking-widest uppercase text-center transition-transform duration-300"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
          onClick={(e) => { e.stopPropagation(); onAddToCart(product, product.sizes[Math.floor(product.sizes.length / 2)]); }}
        >
          + Ajouter au panier
        </div>
      </div>

      {/* Info */}
      <div className="pt-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[10px] text-mist uppercase tracking-widest mb-1">{product.brand}</p>
            <h3 className="text-snow text-sm font-semibold leading-tight">{product.name}</h3>
            <p className="font-mono text-[10px] text-mist mt-0.5">{product.colorway}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-acid font-semibold text-sm">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-mist font-mono text-[10px] line-through">{formatPrice(product.originalPrice)}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-acid text-xs">★</span>
          <span className="font-mono text-[10px] text-silver">{product.rating}</span>
          <span className="font-mono text-[10px] text-mist">({product.reviews})</span>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ setPage, addToCart, toggleWish, wishlist, setSelectedProduct }) {
  const bestsellers = products.filter((p) => p.tags.includes("limited")).slice(0, 4);
  const newArrivals = products.filter((p) => p.tags.includes("new")).slice(0, 4);

  const handleProductClick = (p) => { setSelectedProduct(p); setPage("product"); };

  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      <Hero setPage={setPage} />

      {/* Stats bar */}
      <div className="bg-ash border-t border-b border-zinc">
        <div className="max-w-screen-xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: "15K+", label: "Clients satisfaits" },
            { n: "500+", label: "Drops réalisés" },
            { n: "4.9★", label: "Note moyenne" },
            { n: "7–12j", label: "Livraison mondiale" },
          ].map((s) => (
            <div key={s.n}>
              <p className="text-acid text-2xl font-semibold mb-1" style={{ fontWeight: 800 }}>{s.n}</p>
              <p className="font-mono text-[11px] text-mist uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <section className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <p className="font-mono text-xs text-acid tracking-widest uppercase mb-2">// 01</p>
            <h2 className="text-snow text-3xl md:text-5xl font-semibold" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
              Best<br/><span className="font-serif italic" style={{ fontWeight: 400 }}>Sellers</span>
            </h2>
          </div>
          <button className="btn-ghost text-xs" onClick={() => setPage("catalogue")}>
            Voir tout →
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal">
          {bestsellers.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              onToggleWish={toggleWish}
              isWished={wishlist.includes(p.id)}
              onClick={handleProductClick}
            />
          ))}
        </div>
      </section>

      {/* Editorial split */}
      <section className="max-w-screen-xl mx-auto px-6 py-10 reveal">
        <div className="grid md:grid-cols-2 gap-0 border border-zinc overflow-hidden">
          <div
            className="min-h-96 bg-carbon"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1556821840-3a63f15232d0?w=900&q=80)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="bg-ash p-12 flex flex-col justify-center">
            <span className="tag tag-acid mb-6">Editorial SS26</span>
            <h2 className="text-snow text-4xl font-semibold mb-6" style={{ fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              Heavy.<br/>
              Dense.<br/>
              <span className="text-acid font-serif italic" style={{ fontWeight: 400 }}>Définitif.</span>
            </h2>
            <p className="text-silver font-mono text-sm leading-relaxed mb-8">
              Notre collection premium Hoodie redéfinit les standards. Coton 400g double fil, 
              finitions irréprochables. Pour ceux qui savent reconnaître la qualité.
            </p>
            <button className="btn-primary self-start" onClick={() => setPage("catalogue")}>
              Découvrir
            </button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-screen-xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10 reveal">
          <div>
            <p className="font-mono text-xs text-acid tracking-widest uppercase mb-2">// 02</p>
            <h2 className="text-snow text-3xl md:text-5xl font-semibold" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
              New<br/><span className="font-serif italic" style={{ fontWeight: 400 }}>Arrivals</span>
            </h2>
          </div>
          <button className="btn-ghost" onClick={() => setPage("catalogue")}>Voir tout →</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 reveal">
          {newArrivals.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              onToggleWish={toggleWish}
              isWished={wishlist.includes(p.id)}
              onClick={handleProductClick}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-screen-xl mx-auto px-6 py-10 reveal">
        <p className="font-mono text-xs text-acid tracking-widest uppercase mb-2">// 03</p>
        <h2 className="text-snow text-3xl md:text-5xl font-semibold mb-10" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
          Catégories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Sneakers", emoji: "👟", color: "#d4f500", bg: "rgba(212,245,0,0.06)" },
            { label: "Hauts", emoji: "👕", color: "#00ff88", bg: "rgba(0,255,136,0.06)" },
            { label: "Bas", emoji: "👖", color: "#ff3c5a", bg: "rgba(255,60,90,0.06)" },
            { label: "Maillots", emoji: "⚽", color: "#fff", bg: "rgba(255,255,255,0.04)" },
            { label: "Accessoires", emoji: "🧢", color: "#888", bg: "rgba(136,136,136,0.06)" },
          ].map((cat) => (
            <button
              key={cat.label}
              onClick={() => setPage("catalogue")}
              className="border border-zinc text-left p-6 transition-all duration-200 hover:border-acid group"
              style={{ background: cat.bg }}
            >
              <span className="text-3xl block mb-3">{cat.emoji}</span>
              <span className="font-mono text-xs tracking-widest uppercase" style={{ color: cat.color }}>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-screen-xl mx-auto px-6 py-20 reveal">
        <p className="font-mono text-xs text-acid tracking-widest uppercase mb-2">// 04</p>
        <h2 className="text-snow text-3xl md:text-5xl font-semibold mb-10" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
          Ce qu'ils<br/><span className="font-serif italic" style={{ fontWeight: 400 }}>disent</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((r) => (
            <div key={r.id} className="border border-zinc bg-ash p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(r.rating)].map((_, i) => (
                  <span key={i} className="text-acid text-sm">★</span>
                ))}
              </div>
              <p className="text-silver text-sm leading-relaxed mb-4">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc flex items-center justify-center text-acid font-mono text-xs font-bold">
                    {r.avatar}
                  </div>
                  <div>
                    <p className="text-snow text-xs font-semibold">{r.name}</p>
                    <p className="font-mono text-[10px] text-mist">{r.date}</p>
                  </div>
                </div>
                <span className="tag tag-acid">{r.product}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc bg-ash mt-20">
        <div className="max-w-screen-xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <p className="text-snow font-sans text-2xl font-semibold mb-3" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
                FRESH<span className="text-acid">WARE</span>
              </p>
              <p className="font-mono text-xs text-mist leading-relaxed max-w-xs">
                Luxe & Streetwear à prix accessibles. Drops exclusifs. Livraison mondiale. Stay Fresh. Stay Ahead.
              </p>
            </div>
            {[
              { title: "Navigation", links: ["Accueil", "Catalogue", "Nouveautés", "Best Sellers"] },
              { title: "Support", links: ["Contact", "Livraison", "Retours", "FAQ"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="font-mono text-[10px] text-acid tracking-widest uppercase mb-4">{col.title}</p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}>
                      <button className="font-mono text-xs text-mist hover:text-snow transition-colors hover-line">{l}</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="sep mt-12 mb-6" />
          <div className="flex items-center justify-between">
            <p className="font-mono text-[10px] text-mist">FreshWare © 2026 — Stay Fresh. Stay Ahead.</p>
            <p className="font-mono text-[10px] text-mist">Paris, France</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── CATALOGUE PAGE ───────────────────────────────────────────
function CataloguePage({ addToCart, toggleWish, wishlist, setSelectedProduct, setPage, searchQuery, setSearchQuery }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [filterTag, setFilterTag] = useState("");

  const filtered = products
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter((p) => !filterTag || p.tags.includes(filterTag))
    .filter((p) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const handleProductClick = (p) => { setSelectedProduct(p); setPage("product"); };

  const catLabels = {
    all: "Tout",
    sneakers: "Sneakers",
    hauts: "Hauts",
    bas: "Bas",
    maillots: "Maillots",
    accessoires: "Accessoires",
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-xs text-acid tracking-widest uppercase mb-2">Catalogue</p>
          <h1 className="text-snow text-4xl md:text-6xl font-semibold" style={{ fontWeight: 800, letterSpacing: "-0.04em" }}>
            {filtered.length} <span className="font-serif italic" style={{ fontWeight: 400 }}>produits</span>
          </h1>
        </div>

        {/* Filters */}
        <div className="border border-zinc p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {Object.entries(catLabels).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`font-mono text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-200 ${
                  activeCategory === id
                    ? "bg-acid text-void border-acid"
                    : "border-zinc text-mist hover:border-silver hover:text-snow"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            {["", "limited", "new"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTag(t)}
                className={`font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 border transition-colors ${
                  filterTag === t ? "border-acid text-acid" : "border-zinc text-mist hover:text-snow"
                }`}
              >
                {t === "" ? "Tous" : t === "limited" ? "Limited" : "New"}
              </button>
            ))}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-carbon border border-zinc text-mist font-mono text-[10px] px-3 py-1.5 outline-none tracking-widest uppercase cursor-pointer"
            >
              <option value="default">Tri par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
            </select>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mb-6">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-fw"
          />
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
                onToggleWish={toggleWish}
                isWished={wishlist.includes(p.id)}
                onClick={handleProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <p className="text-mist font-mono text-sm mb-2">Aucun produit trouvé</p>
            <button className="btn-ghost mt-4" onClick={() => { setActiveCategory("all"); setSearchQuery(""); setFilterTag(""); }}>
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────
function ProductPage({ product, addToCart, toggleWish, isWished, setPage }) {
  const [selectedSize, setSelectedSize] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const disc = discount(product.originalPrice, product.price);
  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 font-mono text-[11px] text-mist">
          <button onClick={() => setPage("home")} className="hover:text-acid transition-colors">Accueil</button>
          <span>/</span>
          <button onClick={() => setPage("catalogue")} className="hover:text-acid transition-colors">Catalogue</button>
          <span>/</span>
          <span className="text-snow">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-20">
          {/* Images */}
          <div>
            <div className="bg-carbon aspect-square overflow-hidden mb-3">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 bg-carbon overflow-hidden border transition-colors ${
                      activeImg === i ? "border-acid" : "border-zinc"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              {product.tags.includes("limited") && <span className="tag tag-plasma">Limited</span>}
              {product.tags.includes("new") && <span className="tag tag-acid">New</span>}
              {disc && <span className="font-mono text-xs text-mist">{disc}</span>}
            </div>

            <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">{product.brand}</p>
            <h1 className="text-snow text-3xl md:text-4xl font-semibold mb-1" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
              {product.name}
            </h1>
            <p className="font-mono text-xs text-mist mb-4">{product.colorway}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? "text-acid" : "text-zinc"}>★</span>
                ))}
              </div>
              <span className="font-mono text-xs text-silver">{product.rating}</span>
              <span className="font-mono text-xs text-mist">({product.reviews} avis)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-acid text-4xl font-semibold" style={{ fontWeight: 800 }}>{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-mist text-xl font-mono line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-silver font-mono text-sm leading-relaxed mb-8 border-l-2 border-acid pl-4">
              {product.desc}
            </p>

            {/* Sizes */}
            {product.sizes[0] !== "unique" && (
              <div className="mb-8">
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-3">Taille</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`w-12 h-12 font-mono text-xs border transition-all duration-200 ${
                        selectedSize === s
                          ? "bg-acid text-void border-acid"
                          : "border-zinc text-silver hover:border-silver"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                className="btn-primary flex-1"
                onClick={() => {
                  if (product.sizes[0] === "unique" || selectedSize) {
                    addToCart(product, selectedSize || "unique");
                  }
                }}
                style={{ opacity: (product.sizes[0] === "unique" || selectedSize) ? 1 : 0.4 }}
              >
                {product.sizes[0] !== "unique" && !selectedSize ? "Choisir une taille" : "Ajouter au panier"}
              </button>
              <button
                className="btn-ghost px-4"
                onClick={() => toggleWish(product)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isWished ? "#ff3c5a" : "none"} stroke={isWished ? "#ff3c5a" : "currentColor"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>

            {/* Info pills */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { icon: "🚚", label: "Livraison 7–12j" },
                { icon: "↩️", label: "Retours 30j" },
                { icon: "🔒", label: "Paiement sécurisé" },
              ].map((i) => (
                <div key={i.label} className="border border-zinc bg-ash p-3 text-center">
                  <span className="text-lg block mb-1">{i.icon}</span>
                  <span className="font-mono text-[10px] text-mist">{i.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar products */}
        {similar.length > 0 && (
          <div>
            <div className="sep mb-10" />
            <h2 className="text-snow text-2xl font-semibold mb-6" style={{ fontWeight: 800 }}>
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={addToCart}
                  onToggleWish={toggleWish}
                  isWished={false}
                  onClick={(pr) => { setPage("product"); }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CART PAGE ────────────────────────────────────────────────
function CartPage({ cart, updateQty, removeFromCart, setPage }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total >= 100 ? 0 : 9.9;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-mist font-mono text-sm mb-2">Votre panier est vide</p>
          <button className="btn-primary mt-6" onClick={() => setPage("catalogue")}>
            Explorer le catalogue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-6">
        <p className="font-mono text-xs text-acid tracking-widest uppercase mb-2">Panier</p>
        <h1 className="text-snow text-4xl font-semibold mb-10" style={{ fontWeight: 800, letterSpacing: "-0.04em" }}>
          {cart.length} article{cart.length > 1 ? "s" : ""}
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="border border-zinc bg-ash flex gap-4 p-4">
                <div className="w-20 h-20 bg-carbon overflow-hidden shrink-0">
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-[10px] text-mist uppercase">{item.brand}</p>
                  <p className="text-snow text-sm font-semibold truncate">{item.name}</p>
                  {item.size !== "unique" && (
                    <p className="font-mono text-[10px] text-mist mt-0.5">Taille: {item.size}</p>
                  )}
                  <p className="text-acid font-mono text-sm mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex flex-col items-end justify-between shrink-0">
                  <button onClick={() => removeFromCart(item.id, item.size)} className="text-mist hover:text-plasma transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/><path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                  <div className="flex items-center gap-2 border border-zinc">
                    <button className="px-3 py-1 text-mist hover:text-snow font-mono" onClick={() => updateQty(item.id, item.size, item.qty - 1)}>−</button>
                    <span className="font-mono text-xs text-snow w-6 text-center">{item.qty}</span>
                    <button className="px-3 py-1 text-mist hover:text-snow font-mono" onClick={() => updateQty(item.id, item.size, item.qty + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="border border-zinc bg-ash p-6 h-fit">
            <p className="font-mono text-xs text-acid tracking-widest uppercase mb-6">Récapitulatif</p>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-mono text-sm">
                <span className="text-mist">Sous-total</span>
                <span className="text-snow">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-mist">Livraison</span>
                <span className={shipping === 0 ? "text-neon" : "text-snow"}>{shipping === 0 ? "Gratuite" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p className="font-mono text-[10px] text-mist">
                  Plus que {formatPrice(100 - total)} pour la livraison gratuite
                </p>
              )}
              <div className="sep" />
              <div className="flex justify-between font-mono text-sm">
                <span className="text-snow font-semibold">Total</span>
                <span className="text-acid font-semibold text-lg">{formatPrice(total + shipping)}</span>
              </div>
            </div>
            <button className="btn-primary w-full text-center" onClick={() => setPage("checkout")}>
              Passer la commande
            </button>
            <button className="btn-ghost w-full text-center mt-3" onClick={() => setPage("catalogue")}>
              Continuer les achats
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CHECKOUT PAGE ────────────────────────────────────────────
function CheckoutPage({ cart, clearCart, setPage, addToast }) {
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("card");
  const [form, setForm] = useState({ name: "", email: "", address: "", city: "", zip: "", country: "" });
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = total >= 100 ? 0 : 9.9;

  const handleOrder = () => {
    addToast("✅ Commande confirmée ! Merci pour votre achat.", "neon");
    clearCart();
    setPage("home");
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-screen-lg mx-auto px-6">
        <p className="font-mono text-xs text-acid tracking-widest uppercase mb-2">Checkout</p>
        <h1 className="text-snow text-4xl font-semibold mb-10" style={{ fontWeight: 800, letterSpacing: "-0.04em" }}>
          {step === 1 ? "Livraison" : "Paiement"}
        </h1>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10 font-mono text-xs">
          {["Livraison", "Paiement"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <span className={`w-6 h-6 flex items-center justify-center border ${i + 1 <= step ? "bg-acid text-void border-acid" : "border-zinc text-mist"}`}>
                {i + 1}
              </span>
              <span className={i + 1 <= step ? "text-snow" : "text-mist"}>{s}</span>
              {i < 1 && <span className="text-zinc mx-2">→</span>}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {step === 1 ? (
              <div className="space-y-4">
                {[
                  { key: "name", label: "Nom complet", placeholder: "Jean Dupont" },
                  { key: "email", label: "Email", placeholder: "jean@example.com" },
                  { key: "address", label: "Adresse", placeholder: "12 rue de la Paix" },
                  { key: "city", label: "Ville", placeholder: "Paris" },
                  { key: "zip", label: "Code postal", placeholder: "75001" },
                  { key: "country", label: "Pays", placeholder: "France" },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="font-mono text-[10px] text-mist uppercase tracking-widest block mb-2">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                      className="input-fw"
                    />
                  </div>
                ))}
                <button className="btn-primary mt-4" onClick={() => setStep(2)}>
                  Continuer vers le paiement →
                </button>
              </div>
            ) : (
              <div>
                <p className="font-mono text-xs text-mist uppercase tracking-widest mb-4">Méthode de paiement</p>
                <div className="space-y-2 mb-8">
                  {[
                    { id: "card", label: "Carte bancaire", icon: "💳" },
                    { id: "paypal", label: "PayPal", icon: "🅿️" },
                    { id: "revolut", label: "Revolut", icon: "⚡" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setPayMethod(m.id)}
                      className={`w-full flex items-center gap-4 p-4 border transition-colors text-left ${
                        payMethod === m.id ? "border-acid bg-carbon" : "border-zinc hover:border-silver"
                      }`}
                    >
                      <span className="text-xl">{m.icon}</span>
                      <span className="font-mono text-sm text-snow">{m.label}</span>
                      {payMethod === m.id && <span className="ml-auto text-acid font-mono text-xs">✓ Sélectionné</span>}
                    </button>
                  ))}
                </div>
                {payMethod === "card" && (
                  <div className="space-y-3 mb-6">
                    <input placeholder="Numéro de carte" className="input-fw" />
                    <div className="grid grid-cols-2 gap-3">
                      <input placeholder="MM/AA" className="input-fw" />
                      <input placeholder="CVV" className="input-fw" />
                    </div>
                  </div>
                )}
                <div className="flex gap-3">
                  <button className="btn-ghost" onClick={() => setStep(1)}>← Retour</button>
                  <button className="btn-primary flex-1" onClick={handleOrder}>
                    Confirmer la commande — {formatPrice(total + shipping)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="border border-zinc bg-ash p-5 h-fit">
            <p className="font-mono text-[10px] text-acid tracking-widest uppercase mb-4">Commande</p>
            <div className="space-y-2 mb-4">
              {cart.map((i) => (
                <div key={`${i.id}-${i.size}`} className="flex justify-between font-mono text-xs">
                  <span className="text-mist truncate max-w-[120px]">{i.name} ×{i.qty}</span>
                  <span className="text-snow">{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="sep mb-4" />
            <div className="flex justify-between font-mono text-sm">
              <span className="text-snow">Total</span>
              <span className="text-acid font-semibold">{formatPrice(total + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WISHLIST PAGE ────────────────────────────────────────────
function WishlistPage({ wishlist, toggleWish, addToCart, setSelectedProduct, setPage }) {
  const wished = products.filter((p) => wishlist.includes(p.id));
  if (wished.length === 0) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-mist font-mono text-sm mb-2">Votre wishlist est vide</p>
          <button className="btn-primary mt-6" onClick={() => setPage("catalogue")}>Explorer le catalogue</button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-screen-xl mx-auto px-6">
        <p className="font-mono text-xs text-plasma tracking-widest uppercase mb-2">Wishlist</p>
        <h1 className="text-snow text-4xl font-semibold mb-10" style={{ fontWeight: 800, letterSpacing: "-0.04em" }}>
          {wished.length} favori{wished.length > 1 ? "s" : ""}
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {wished.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              onToggleWish={toggleWish}
              isWished={true}
              onClick={(pr) => { setSelectedProduct(pr); setPage("product"); }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNT PAGE ─────────────────────────────────────────────
function AccountPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  return (
    <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
      <div className="w-full max-w-sm border border-zinc bg-ash p-8">
        <p className="font-mono text-xs text-acid tracking-widest uppercase mb-1">
          {mode === "login" ? "Connexion" : "Inscription"}
        </p>
        <h1 className="text-snow text-2xl font-semibold mb-8" style={{ fontWeight: 800, letterSpacing: "-0.03em" }}>
          {mode === "login" ? "Bon retour." : "Rejoignez-nous."}
        </h1>

        <div className="space-y-4 mb-6">
          {mode === "register" && (
            <div>
              <label className="font-mono text-[10px] text-mist uppercase tracking-widest block mb-2">Prénom</label>
              <input placeholder="Jean" className="input-fw" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          )}
          <div>
            <label className="font-mono text-[10px] text-mist uppercase tracking-widest block mb-2">Email</label>
            <input type="email" placeholder="jean@example.com" className="input-fw" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="font-mono text-[10px] text-mist uppercase tracking-widest block mb-2">Mot de passe</label>
            <input type="password" placeholder="••••••••" className="input-fw" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
        </div>

        <button className="btn-primary w-full text-center mb-4">
          {mode === "login" ? "Se connecter" : "Créer mon compte"}
        </button>

        <button
          className="font-mono text-xs text-mist hover:text-snow transition-colors w-full text-center"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
        >
          {mode === "login" ? "Pas encore de compte ? S'inscrire →" : "Déjà inscrit ? Se connecter →"}
        </button>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "acid") => {
    const id = Date.now();
    const icon = type === "plasma" ? "♥" : type === "neon" ? "✓" : "★";
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const addToCart = useCallback((product, size) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.size === size);
      if (existing) return prev.map((i) => i.id === product.id && i.size === size ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, size, qty: 1 }];
    });
    addToast(`${product.name} ajouté au panier`);
  }, [addToast]);

  const updateQty = useCallback((id, size, qty) => {
    if (qty <= 0) return setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
    setCart((prev) => prev.map((i) => i.id === id && i.size === size ? { ...i, qty } : i));
  }, []);

  const removeFromCart = useCallback((id, size) => {
    setCart((prev) => prev.filter((i) => !(i.id === id && i.size === size)));
    addToast("Article retiré du panier", "plasma");
  }, [addToast]);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWish = useCallback((product) => {
    setWishlist((prev) => {
      const inList = prev.includes(product.id);
      addToast(inList ? "Retiré des favoris" : `${product.name} ajouté aux favoris`, inList ? "plasma" : "acid");
      return inList ? prev.filter((id) => id !== product.id) : [...prev, product.id];
    });
  }, [addToast]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="grain">
      <Ticker />
      <Navbar
        page={page}
        setPage={setPage}
        cartCount={cartCount}
        wishCount={wishlist.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {page === "home" && (
        <HomePage
          setPage={setPage}
          addToCart={addToCart}
          toggleWish={toggleWish}
          wishlist={wishlist}
          setSelectedProduct={setSelectedProduct}
        />
      )}

      {page === "catalogue" && (
        <CataloguePage
          addToCart={addToCart}
          toggleWish={toggleWish}
          wishlist={wishlist}
          setSelectedProduct={setSelectedProduct}
          setPage={setPage}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      {page === "product" && selectedProduct && (
        <ProductPage
          product={selectedProduct}
          addToCart={addToCart}
          toggleWish={toggleWish}
          isWished={wishlist.includes(selectedProduct.id)}
          setPage={setPage}
        />
      )}

      {page === "cart" && (
        <CartPage
          cart={cart}
          updateQty={updateQty}
          removeFromCart={removeFromCart}
          setPage={setPage}
        />
      )}

      {page === "checkout" && (
        <CheckoutPage
          cart={cart}
          clearCart={clearCart}
          setPage={setPage}
          addToast={addToast}
        />
      )}

      {page === "wishlist" && (
        <WishlistPage
          wishlist={wishlist}
          toggleWish={toggleWish}
          addToCart={addToCart}
          setSelectedProduct={setSelectedProduct}
          setPage={setPage}
        />
      )}

      {page === "account" && <AccountPage />}

      <Toast toasts={toasts} />
    </div>
  );
}
