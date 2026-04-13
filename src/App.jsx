import { useState, useEffect, useRef, createContext, useContext } from "react";
import { products, reviews, categories } from "./data/products";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  accent:      "#40916c",
  accentLight: "#52b788",
  accentDark:  "#2d6a4f",
  accentGlow:  "rgba(64,145,108,0.22)",
  bg0:         "#050a06",
  bg1:         "#0a110b",
  bg2:         "#111a12",
  bg3:         "#182119",
  border:      "rgba(64,145,108,0.14)",
  borderHover: "rgba(64,145,108,0.42)",
  text:        "#f0f4f1",
  textMuted:   "#7a9b82",
  textDim:     "#3d5c45",
};

// ─── CONTEXT ─────────────────────────────────────────────────────────────────
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ─── UTILS ───────────────────────────────────────────────────────────────────
const fmt    = (p) => `${p} €`;
const pct    = (o, p) => Math.round(((o - p) / o) * 100);
const saving = (o, p) => o - p;

// ─── STARS ───────────────────────────────────────────────────────────────────
function Stars({ rating, size = 11 }) {
  return (
    <span style={{ fontSize: size, letterSpacing: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.floor(rating) ? C.accentLight : C.textDim }}>★</span>
      ))}
    </span>
  );
}

// ─── BADGE ───────────────────────────────────────────────────────────────────
function Badge({ label }) {
  const map = {
    Limited: { bg: C.accent,       color: "#fff" },
    New:     { bg: C.accentLight,  color: C.bg0  },
  };
  const s = map[label] || { bg: C.bg3, color: C.textMuted };
  return (
    <span style={{
      background: s.bg, color: s.color,
      fontSize: 9, fontWeight: 900, letterSpacing: "0.12em",
      padding: "3px 8px", borderRadius: 99,
    }}>
      {label?.toUpperCase()}
    </span>
  );
}

// ─── BUTTONS ──────────────────────────────────────────────────────────────────
function BtnPrimary({ onClick, children, disabled, full }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:"inline-block", width: full ? "100%" : "auto", padding:"12px 28px", background:C.accent, color:"#fff", border:"none", borderRadius:99, fontSize:12, fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", cursor:disabled?"not-allowed":"pointer", opacity:disabled?.5:1, transition:"all .2s", boxShadow:`0 0 24px ${C.accentGlow}` }}
      onMouseEnter={e=>!disabled&&(e.currentTarget.style.background=C.accentLight)}
      onMouseLeave={e=>!disabled&&(e.currentTarget.style.background=C.accent)}>
      {children}
    </button>
  );
}
function BtnSecondary({ onClick, children }) {
  return (
    <button onClick={onClick}
      style={{ display:"inline-block", padding:"12px 28px", background:"none", color:C.textMuted, border:`1px solid ${C.border}`, borderRadius:99, fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer", transition:"all .2s" }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.accentLight; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}>
      {children}
    </button>
  );
}

// ─── ICON BUTTON ──────────────────────────────────────────────────────────────
function IconBtn({ onClick, badge, title, children }) {
  return (
    <button onClick={onClick} title={title}
      style={{ position:"relative", width:38, height:38, border:`1px solid ${C.border}`, borderRadius:"50%", background:"none", cursor:"pointer", color:C.textMuted, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s", flexShrink:0 }}
      onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.accentLight; }}
      onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}>
      {children}
      {badge > 0 && (
        <span style={{ position:"absolute", top:-3, right:-3, width:16, height:16, background:C.accent, borderRadius:"50%", fontSize:9, fontWeight:900, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center" }}>{badge}</span>
      )}
    </button>
  );
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHead({ label, title, cta, onCta }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:28 }}>
      <div>
        <div style={{ fontSize:10, letterSpacing:"0.3em", color:C.accent, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
        <h2 style={{ fontSize:28, fontWeight:900, color:C.text, margin:0 }}>{title}</h2>
      </div>
      {cta && (
        <button onClick={onCta}
          style={{ background:"none", border:`1px solid ${C.border}`, padding:"8px 18px", borderRadius:99, fontSize:11, fontWeight:700, color:C.textMuted, cursor:"pointer", letterSpacing:"0.08em", transition:"all .2s" }}
          onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.accentLight; }}
          onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}>
          {cta} →
        </button>
      )}
    </div>
  );
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────
function Navbar({ onNavigate, cartCount, wishlistCount }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOn, setSearchOn] = useState(false);
  const [query, setQuery]       = useState("");
  const { user } = useApp();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:100, transition:"all .4s ease",
      background:    scrolled ? "rgba(5,10,6,.96)" : "transparent",
      backdropFilter: scrolled ? "blur(24px)" : "none",
      borderBottom:  scrolled ? `1px solid ${C.border}` : "none",
    }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Logo */}
        <button onClick={() => onNavigate("home")} style={{ background:"none", border:"none", cursor:"pointer", padding:0 }}>
          <div style={{ fontSize:22, fontWeight:900, color:C.text, letterSpacing:"0.06em", fontFamily:"'Bebas Neue', Impact, sans-serif", lineHeight:1 }}>
            FRESH<span style={{ color:C.accent }}>WARE</span>
          </div>
          <div style={{ fontSize:7, letterSpacing:"0.25em", color:C.textDim, marginTop:1 }}>STAY FRESH. STAY AHEAD.</div>
        </button>

        {/* Links */}
        <div style={{ display:"flex", gap:32, alignItems:"center" }}>
          {[["Accueil","home"],["Catalogue","catalogue"],["Nouveautés","catalogue","new"],["Best Sellers","catalogue","bestseller"]].map(([label,page,filter])=>(
            <button key={label} onClick={()=>onNavigate(page,filter)}
              style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, fontWeight:600, letterSpacing:"0.1em", color:C.textMuted, textTransform:"uppercase", transition:"color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.color=C.accentLight}
              onMouseLeave={e=>e.currentTarget.style.color=C.textMuted}>
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {searchOn && (
            <input autoFocus value={query} onChange={e=>setQuery(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter"&&query.trim()){ onNavigate("catalogue",null,query); setSearchOn(false); setQuery(""); } if(e.key==="Escape") setSearchOn(false); }}
              placeholder="Rechercher..."
              style={{ width:200, padding:"8px 16px", background:C.bg2, border:`1px solid ${C.border}`, borderRadius:99, fontSize:12, color:C.text, outline:"none" }}
            />
          )}
          <IconBtn onClick={()=>setSearchOn(!searchOn)} title="Recherche">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </IconBtn>
          <IconBtn onClick={()=>onNavigate("wishlist")} badge={wishlistCount} title="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </IconBtn>
          <IconBtn onClick={()=>onNavigate("cart")} badge={cartCount} title="Panier">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </IconBtn>
          <button onClick={()=>onNavigate(user?"account":"login")}
            style={{ padding:"8px 18px", border:`1px solid ${C.border}`, borderRadius:99, fontSize:11, fontWeight:700, color:C.textMuted, background:"none", cursor:"pointer", letterSpacing:"0.05em", transition:"all .2s" }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.color=C.accentLight; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted; }}>
            {user ? user.name.split(" ")[0] : "Connexion"}
          </button>
        </div>
      </div>
    </nav>
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
      const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting){ setVisible(true); obs.disconnect(); } }, { threshold: 0.08 });
      if(ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);

  const handleCart = (e) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div ref={ref} onClick={() => onNavigate("product",null,null,product.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor:"pointer", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(28px)", transition:`opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms` }}>
      <div style={{ position:"relative", borderRadius:14, overflow:"hidden", aspectRatio:"1/1", background:C.bg2, marginBottom:12, border:`1px solid ${hovered?C.borderHover:C.border}`, transition:"border-color .3s" }}>
        <img src={product.images[0]} alt={product.name}
          style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform .6s ease", transform:hovered?"scale(1.06)":"scale(1)" }} loading="lazy" />
        <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,.15)", transition:"opacity .3s", opacity:hovered?1:0 }} />
        <div style={{ position:"absolute", top:10, left:10, display:"flex", gap:5 }}>
          {product.badge && <Badge label={product.badge} />}
          {product.isNew && !product.badge && <Badge label="New" />}
        </div>
        <button onClick={e=>{ e.stopPropagation(); toggleWishlist(product.id); }}
          style={{ position:"absolute", top:10, right:10, width:32, height:32, borderRadius:"50%", background:"rgba(5,10,6,.75)", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", backdropFilter:"blur(8px)", transition:"all .2s", transform:hovered||isWished?"scale(1)":"scale(0.85)", opacity:hovered||isWished?1:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={isWished?C.accentLight:"none"} stroke={isWished?C.accentLight:C.text} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
        <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"0 10px 10px", transform:hovered?"translateY(0)":"translateY(100%)", transition:"transform .3s ease" }}>
          <button onClick={handleCart}
            style={{ width:"100%", padding:"10px", borderRadius:10, border:"none", cursor:"pointer", fontSize:10, fontWeight:900, letterSpacing:"0.12em", transition:"background .3s", background:added?"#22c55e":C.accent, color:"#fff" }}>
            {added ? "✓ AJOUTÉ" : "AJOUTER AU PANIER"}
          </button>
        </div>
        {product.stock <= 5 && (
          <div style={{ position:"absolute", bottom:hovered?52:10, left:10, fontSize:10, fontWeight:700, color:"#fbbf24", background:"rgba(5,10,6,.82)", padding:"3px 8px", borderRadius:99, transition:"bottom .3s" }}>
            🔥 Plus que {product.stock} !
          </div>
        )}
      </div>
      <div style={{ padding:"0 2px" }}>
        <div style={{ fontSize:9, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:3 }}>{product.brand}</div>
        <div style={{ fontSize:13, fontWeight:700, color:hovered?C.accentLight:C.text, transition:"color .2s", marginBottom:4 }}>{product.name}</div>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:4 }}>
          <Stars rating={product.rating} /><span style={{ fontSize:10, color:C.textDim }}>({product.reviews})</span>
        </div>
        <div style={{ display:"flex", alignItems:"baseline", gap:8 }}>
          <span style={{ fontSize:16, fontWeight:900, color:C.text }}>{fmt(product.price)}</span>
          <span style={{ fontSize:11, color:C.textDim, textDecoration:"line-through" }}>{fmt(product.originalPrice)}</span>
          <span style={{ fontSize:10, fontWeight:700, color:C.accentLight, marginLeft:"auto" }}>-{pct(product.originalPrice,product.price)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ onNavigate }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);

  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", overflow:"hidden",
        background:`radial-gradient(ellipse at 55% 45%, rgba(45,106,79,.2) 0%, transparent 55%), radial-gradient(ellipse at 15% 85%, rgba(64,145,108,.08) 0%, transparent 40%), ${C.bg0}` }}>
        <div style={{ position:"absolute", inset:0, opacity:.07,
          backgroundImage:`linear-gradient(${C.accent} 1px, transparent 1px), linear-gradient(90deg, ${C.accent} 1px, transparent 1px)`,
          backgroundSize:"70px 70px" }}/>
        <div style={{ position:"absolute", top:"30%", right:"20%", width:500, height:500, borderRadius:"50%", background:`radial-gradient(circle, ${C.accentGlow}, transparent 70%)`, pointerEvents:"none" }}/>

        <div style={{ position:"relative", zIndex:1, maxWidth:1280, margin:"0 auto", padding:"0 24px", width:"100%" }}>
          <div style={{ maxWidth:680 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:C.bg2, border:`1px solid ${C.border}`, borderRadius:99, padding:"6px 16px", marginBottom:28,
              opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(20px)", transition:"all .8s ease .1s" }}>
              <div style={{ width:6, height:6, borderRadius:"50%", background:C.accentLight, animation:"pulse 2s infinite" }}/>
              <span style={{ fontSize:11, color:C.textMuted, letterSpacing:"0.15em", textTransform:"uppercase" }}>Luxe & Streetwear accessible</span>
            </div>

            <h1 style={{ fontFamily:"'Bebas Neue', Impact, sans-serif", fontSize:"clamp(72px,10vw,110px)", fontWeight:900, color:C.text, lineHeight:1, letterSpacing:"0.04em", margin:"0 0 12px",
              opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(30px)", transition:"all 1s ease .2s" }}>
              FRESH<span style={{ color:C.accent }}>WARE</span>
            </h1>

            <p style={{ fontSize:18, color:C.textMuted, marginBottom:36, lineHeight:1.5, fontWeight:300,
              opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(20px)", transition:"all .9s ease .4s" }}>
              Stay Fresh. <strong style={{ color:C.text, fontWeight:600 }}>Stay Ahead.</strong><br/>
              Les pièces que tu veux, aux prix que tu mérites.
            </p>

            <div style={{ display:"flex", gap:12, flexWrap:"wrap", opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(20px)", transition:"all .9s ease .6s" }}>
              <BtnPrimary onClick={()=>onNavigate("catalogue")}>Explorer le catalogue</BtnPrimary>
              <BtnSecondary onClick={()=>onNavigate("catalogue","new")}>Nouveautés →</BtnSecondary>
            </div>

            <div style={{ display:"flex", gap:24, marginTop:48, flexWrap:"wrap", opacity:vis?1:0, transition:"all .9s ease .9s" }}>
              {[["🚚","Livraison 7-12j"],["🔒","Paiement sécurisé"],["✅","100% Authentique"],["🌍","International"]].map(([icon,label])=>(
                <div key={label} style={{ display:"flex", alignItems:"center", gap:7, fontSize:12, color:C.textMuted }}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, opacity:vis?.6:0, transition:"opacity 1s ease 1.4s" }}>
          <span style={{ fontSize:9, letterSpacing:"0.3em", color:C.textDim, textTransform:"uppercase" }}>Défiler</span>
          <div style={{ width:1, height:32, background:`linear-gradient(${C.accent}, transparent)` }}/>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background:C.bg1, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"28px 24px", display:"grid", gridTemplateColumns:"repeat(4,1fr)" }}>
          {[["1 247+","Avis 5 étoiles"],["15k+","Clients satisfaits"],["200+","Pièces en stock"],["48h","Support réactif"]].map(([val,label],i)=>(
            <div key={label} style={{ textAlign:"center", padding:"12px 20px", borderRight:i<3?`1px solid ${C.border}`:"none" }}>
              <div style={{ fontSize:24, fontWeight:900, color:C.accentLight, marginBottom:4 }}>{val}</div>
              <div style={{ fontSize:11, color:C.textDim }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BEST SELLERS */}
      <section style={{ padding:"72px 24px", maxWidth:1280, margin:"0 auto" }}>
        <SectionHead label="Les plus demandés" title="Best Sellers" cta="Voir tout" onCta={()=>onNavigate("catalogue","bestseller")} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
          {bestSellers.map((p,i)=><ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*80}/>)}
        </div>
      </section>

      {/* WHY FRESHWARE */}
      <section style={{ margin:"0 24px 72px", borderRadius:20, overflow:"hidden", background:`linear-gradient(135deg, ${C.bg2}, ${C.bg1})`, border:`1px solid ${C.border}`, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 80% 50%, rgba(64,145,108,.1) 0%, transparent 60%)` }}/>
        <div style={{ position:"relative", maxWidth:1280, margin:"0 auto", padding:"60px 48px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <div style={{ fontSize:10, letterSpacing:"0.3em", color:C.accent, textTransform:"uppercase", marginBottom:12 }}>Pourquoi FreshWare ?</div>
            <h2 style={{ fontSize:34, fontWeight:900, color:C.text, margin:"0 0 16px", lineHeight:1.1 }}>Des pièces rares.<br/>Des prix imbattables.</h2>
            <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.7, marginBottom:28 }}>
              On sélectionne pour toi les meilleures pièces streetwear et luxe en circulation. Chaque produit est authentifié, chaque prix est optimisé.
            </p>
            <BtnPrimary onClick={()=>onNavigate("catalogue")}>Voir le catalogue</BtnPrimary>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            {[["🎯","Curation experte","Seulement les pièces qui valent le coup"],
              ["🔐","100% Authentique","Chaque article vérifié avant expédition"],
              ["✈️","Livraison mondiale","Partout en 7-12 jours, suivi inclus"],
              ["💬","Support 7j/7","Notre équipe répond sous 48h garantie"]
            ].map(([icon,title,desc])=>(
              <div key={title} style={{ background:C.bg0, border:`1px solid ${C.border}`, borderRadius:14, padding:20 }}>
                <div style={{ fontSize:22, marginBottom:8 }}>{icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:5 }}>{title}</div>
                <div style={{ fontSize:11, color:C.textDim, lineHeight:1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding:"0 24px 72px", maxWidth:1280, margin:"0 auto" }}>
        <SectionHead label="Parcourir" title="Toutes les catégories" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
          {categories.filter(c=>c.id!=="all").map(cat=>{
            const count = products.filter(p=>p.category===cat.id).length;
            return (
              <button key={cat.id} onClick={()=>onNavigate("catalogue",cat.id)}
                style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:16, padding:"24px 12px", textAlign:"center", cursor:"pointer", transition:"all .25s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.accent; e.currentTarget.style.background=C.bg2; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.bg1; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{cat.icon}</div>
                <div style={{ fontSize:12, fontWeight:700, color:C.text, marginBottom:3 }}>{cat.label}</div>
                <div style={{ fontSize:10, color:C.textDim }}>{count} articles</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* NOUVEAUTÉS */}
      <section style={{ padding:"0 24px 72px", maxWidth:1280, margin:"0 auto" }}>
        <SectionHead label="Vient d'arriver" title="Nouveautés" cta="Voir tout" onCta={()=>onNavigate("catalogue","new")} />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
          {newProducts.map((p,i)=><ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*80}/>)}
        </div>
      </section>

      {/* AVIS */}
      <section style={{ padding:"72px 24px", background:C.bg1, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:40 }}>
            <div style={{ fontSize:10, letterSpacing:"0.3em", color:C.accent, textTransform:"uppercase", marginBottom:8 }}>Ils nous font confiance</div>
            <h2 style={{ fontSize:28, fontWeight:900, color:C.text, margin:"0 0 10px" }}>Avis clients</h2>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontSize:13, color:C.textMuted }}>
              <Stars rating={4.9} size={14} />
              <strong style={{ color:C.text }}>4.9/5</strong>
              <span>— 1 247 avis vérifiés</span>
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14 }}>
            {reviews.map(r=>(
              <div key={r.id} style={{ background:C.bg0, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:`linear-gradient(135deg, ${C.accentDark}, ${C.accentLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"#fff", flexShrink:0 }}>{r.avatar}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:700, color:C.text }}>{r.name} <span style={{ fontSize:9, color:C.accent, fontWeight:700 }}>✓ VÉRIFIÉ</span></div>
                    <div style={{ fontSize:10, color:C.textDim }}>{r.date}</div>
                  </div>
                  <Stars rating={r.rating} size={11} />
                </div>
                <p style={{ fontSize:12, color:C.textMuted, lineHeight:1.6, margin:"0 0 8px" }}>"{r.comment}"</p>
                <p style={{ fontSize:10, color:C.textDim }}>Achat vérifié : {r.product}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVRAISON */}
      <section style={{ padding:"64px 24px", maxWidth:1280, margin:"0 auto", textAlign:"center" }}>
        <div style={{ fontSize:10, letterSpacing:"0.3em", color:C.accent, textTransform:"uppercase", marginBottom:12 }}>Livraison internationale</div>
        <h2 style={{ fontSize:34, fontWeight:900, color:C.text, margin:"0 0 16px" }}>On livre partout dans le monde</h2>
        <p style={{ fontSize:14, color:C.textMuted, maxWidth:480, margin:"0 auto 36px", lineHeight:1.6 }}>
          Livraison sécurisée en 7 à 12 jours ouvrés. Emballage premium, suivi en temps réel inclus.
        </p>
        <div style={{ display:"flex", justifyContent:"center", gap:14, flexWrap:"wrap", marginBottom:36 }}>
          {[["💳","Carte bancaire"],["🅿️","PayPal"],["🔄","Revolut"]].map(([icon,label])=>(
            <div key={label} style={{ display:"flex", alignItems:"center", gap:8, padding:"12px 20px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.textMuted }}>
              <span>{icon}</span><span style={{ fontWeight:600 }}>{label}</span>
            </div>
          ))}
        </div>
        <BtnPrimary onClick={()=>onNavigate("catalogue")}>Commander maintenant</BtnPrimary>
      </section>
    </div>
  );
}

// ─── CATALOGUE ────────────────────────────────────────────────────────────────
function CataloguePage({ onNavigate, initialFilter, initialSearch }) {
  const [cat, setCat]       = useState(initialFilter==="new"||initialFilter==="bestseller"?"all":(initialFilter||"all"));
  const [sort, setSort]     = useState("default");
  const [isNew, setIsNew]   = useState(initialFilter==="new");
  const [isBest, setIsBest] = useState(initialFilter==="bestseller");
  const [search, setSearch] = useState(initialSearch||"");

  let filtered = products;
  if(cat!=="all") filtered = filtered.filter(p=>p.category===cat);
  if(isNew)  filtered = filtered.filter(p=>p.isNew);
  if(isBest) filtered = filtered.filter(p=>p.isBestSeller);
  if(search) filtered = filtered.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())||p.brand.toLowerCase().includes(search.toLowerCase()));
  if(sort==="price-asc")  filtered = [...filtered].sort((a,b)=>a.price-b.price);
  if(sort==="price-desc") filtered = [...filtered].sort((a,b)=>b.price-a.price);
  if(sort==="rating")     filtered = [...filtered].sort((a,b)=>b.rating-a.rating);

  const fBtn = (active, onClick, label) => (
    <button onClick={onClick} style={{ padding:"8px 18px", borderRadius:99, fontSize:11, fontWeight:700, letterSpacing:"0.08em", cursor:"pointer", transition:"all .2s",
      background:active?C.accent:"none", color:active?"#fff":C.textMuted, border:`1px solid ${active?C.accent:C.border}` }}>{label}</button>
  );

  return (
    <div style={{ minHeight:"100vh", paddingTop:90, paddingBottom:80 }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ marginBottom:32, paddingBottom:24, borderBottom:`1px solid ${C.border}` }}>
          <h1 style={{ fontSize:36, fontWeight:900, color:C.text, margin:"0 0 4px" }}>Catalogue</h1>
          <p style={{ fontSize:13, color:C.textDim, margin:0 }}>{filtered.length} produits trouvés</p>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:32, alignItems:"center" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..."
            style={{ padding:"8px 18px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:99, fontSize:12, color:C.text, outline:"none", width:180 }} />
          {categories.map(c=>fBtn(cat===c.id, ()=>setCat(c.id), c.label))}
          {fBtn(isNew, ()=>setIsNew(!isNew), "Nouveautés")}
          {fBtn(isBest, ()=>setIsBest(!isBest), "Best Sellers")}
          <select value={sort} onChange={e=>setSort(e.target.value)}
            style={{ marginLeft:"auto", padding:"8px 18px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:99, fontSize:11, color:C.textMuted, outline:"none", cursor:"pointer" }}>
            <option value="default">Trier par</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="rating">Meilleures notes</option>
          </select>
        </div>
        {filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:C.textDim }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
            <p style={{ fontSize:16, fontWeight:700, color:C.textMuted }}>Aucun produit trouvé</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
            {filtered.map((p,i)=><ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*50}/>)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── PRODUCT PAGE ─────────────────────────────────────────────────────────────
function ProductPage({ productId, onNavigate }) {
  const { addToCart, wishlist, toggleWishlist } = useApp();
  const product = products.find(p=>p.id===productId);
  const [selSize, setSelSize] = useState(null);
  const [imgIdx, setImgIdx]   = useState(0);
  const [added, setAdded]     = useState(false);
  const [sizeErr, setSizeErr] = useState(false);
  if(!product) return null;
  const isWished = wishlist.includes(product.id);
  const related  = products.filter(p=>p.category===product.category&&p.id!==productId).slice(0,4);

  const handleAdd = () => {
    if(!selSize){ setSizeErr(true); setTimeout(()=>setSizeErr(false),2000); return; }
    addToCart(product, selSize);
    setAdded(true);
    setTimeout(()=>setAdded(false),2000);
  };

  return (
    <div style={{ minHeight:"100vh", paddingTop:90, paddingBottom:80 }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ display:"flex", gap:6, fontSize:12, color:C.textDim, marginBottom:32, alignItems:"center" }}>
          {[["Accueil","home"],["",product.category,"catalogue",product.category],["|",product.name]].map(([_,label,page,filter],i)=>(
            page ? <button key={i} onClick={()=>onNavigate(page,filter)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim, padding:0, textTransform:"capitalize" }}>{label}</button>
                 : <span key={i} style={{ color:i===0?C.textDim:C.textMuted }}>{label||_}</span>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, fontSize:12, color:C.textDim, marginBottom:32, alignItems:"center" }}>
          <button onClick={()=>onNavigate("home")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim }}>Accueil</button>
          <span>/</span>
          <button onClick={()=>onNavigate("catalogue",product.category)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim, textTransform:"capitalize" }}>{product.category}</button>
          <span>/</span>
          <span style={{ color:C.textMuted }}>{product.name}</span>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:60, marginBottom:80 }}>
          <div>
            <div style={{ borderRadius:20, overflow:"hidden", aspectRatio:"1/1", background:C.bg1, marginBottom:12, border:`1px solid ${C.border}` }}>
              <img src={product.images[imgIdx]||product.images[0]} alt={product.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            {product.images.length>1 && (
              <div style={{ display:"flex", gap:10 }}>
                {product.images.map((img,i)=>(
                  <button key={i} onClick={()=>setImgIdx(i)} style={{ width:72, height:72, borderRadius:12, overflow:"hidden", border:`2px solid ${imgIdx===i?C.accent:C.border}`, cursor:"pointer", background:"none", padding:0 }}>
                    <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:6 }}>
              <div>
                <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:6 }}>{product.brand}</div>
                <h1 style={{ fontSize:32, fontWeight:900, color:C.text, margin:0 }}>{product.name}</h1>
              </div>
              <button onClick={()=>toggleWishlist(product.id)} style={{ width:44, height:44, borderRadius:12, background:C.bg1, border:`1px solid ${C.border}`, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isWished?C.accentLight:"none"} stroke={isWished?C.accentLight:C.textMuted} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:20 }}>
              <Stars rating={product.rating} size={13} />
              <span style={{ fontSize:12, color:C.textDim }}>{product.rating}/5 ({product.reviews} avis)</span>
            </div>

            <div style={{ display:"flex", alignItems:"baseline", gap:12, marginBottom:16 }}>
              <span style={{ fontSize:40, fontWeight:900, color:C.text }}>{fmt(product.price)}</span>
              <span style={{ fontSize:18, color:C.textDim, textDecoration:"line-through" }}>{fmt(product.originalPrice)}</span>
            </div>
            <div style={{ display:"inline-flex", padding:"6px 14px", background:`rgba(64,145,108,.1)`, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12, fontWeight:700, color:C.accentLight, marginBottom:20 }}>
              Tu économises {saving(product.originalPrice,product.price)} € ({pct(product.originalPrice,product.price)}% de réduction)
            </div>

            {product.badge && (
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 14px", background:`rgba(64,145,108,.08)`, border:`1px solid ${C.border}`, borderRadius:99, marginBottom:20, marginLeft:8 }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:C.accentLight }}/>
                <span style={{ fontSize:10, fontWeight:700, color:C.accentLight, letterSpacing:"0.1em" }}>{product.badge.toUpperCase()}</span>
              </div>
            )}

            <p style={{ fontSize:14, color:C.textMuted, lineHeight:1.7, marginBottom:24 }}>{product.description}</p>

            <div style={{ marginBottom:20 }}>
              <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>Coloris</div>
              <div style={{ display:"flex", gap:8 }}>
                {product.colors.map(c=>(
                  <span key={c} style={{ padding:"6px 14px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:8, fontSize:12, color:C.textMuted }}>{c}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom:28 }}>
              <div style={{ fontSize:10, color:sizeErr?C.accentLight:C.textDim, textTransform:"uppercase", letterSpacing:"0.15em", marginBottom:8 }}>
                {sizeErr ? "⚠ Sélectionnez une taille" : "Choisir la taille"}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {product.sizes.map(size=>(
                  <button key={size} onClick={()=>setSelSize(size)}
                    style={{ padding:"10px 18px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all .15s",
                      background:selSize===size?C.accent:C.bg1, color:selSize===size?"#fff":C.textMuted,
                      border:`1px solid ${selSize===size?C.accent:sizeErr?"rgba(251,191,36,.4)":C.border}` }}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAdd}
              style={{ width:"100%", padding:"16px", borderRadius:14, border:"none", cursor:"pointer", fontSize:13, fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", color:"#fff", transition:"all .3s",
                background:added?"#22c55e":`linear-gradient(135deg, ${C.accentDark}, ${C.accent})`,
                boxShadow:`0 8px 32px ${C.accentGlow}` }}>
              {added ? "✓ Ajouté au panier !" : "Ajouter au panier"}
            </button>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginTop:20 }}>
              {[["🚚","Livraison 7-12j"],["🔒","Paiement sécurisé"],["✅","Authenticité garantie"]].map(([icon,label])=>(
                <div key={label} style={{ textAlign:"center", padding:"12px 8px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12 }}>
                  <div style={{ fontSize:18, marginBottom:4 }}>{icon}</div>
                  <div style={{ fontSize:10, color:C.textDim, lineHeight:1.3 }}>{label}</div>
                </div>
              ))}
            </div>

            {product.stock<=10 && (
              <div style={{ marginTop:16, padding:"10px 16px", background:"rgba(251,191,36,.08)", border:"1px solid rgba(251,191,36,.2)", borderRadius:10, fontSize:12, color:"#fbbf24", fontWeight:600 }}>
                🔥 Seulement {product.stock} exemplaire{product.stock>1?"s":""} restant{product.stock>1?"s":""}
              </div>
            )}
          </div>
        </div>

        {related.length>0 && (
          <div>
            <SectionHead label="Tu pourrais aimer" title="Produits similaires" />
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
              {related.map((p,i)=><ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*80}/>)}
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
  const total    = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const shipping = total>100 ? 0 : 9.99;

  if(cart.length===0) return (
    <div style={{ minHeight:"100vh", paddingTop:90, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:16 }}>🛍️</div>
      <h2 style={{ fontSize:24, fontWeight:900, color:C.text, marginBottom:8 }}>Votre panier est vide</h2>
      <p style={{ fontSize:14, color:C.textDim, marginBottom:28 }}>Découvrez nos dernières pièces</p>
      <BtnPrimary onClick={()=>onNavigate("catalogue")}>Explorer le catalogue</BtnPrimary>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", paddingTop:90, paddingBottom:80 }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 24px" }}>
        <h1 style={{ fontSize:32, fontWeight:900, color:C.text, marginBottom:32 }}>Mon Panier</h1>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 380px", gap:32 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {cart.map(item=>(
              <div key={`${item.id}-${item.size}`} style={{ display:"flex", gap:16, padding:20, background:C.bg1, border:`1px solid ${C.border}`, borderRadius:16 }}>
                <img src={item.images[0]} alt={item.name} style={{ width:96, height:96, objectFit:"cover", borderRadius:12, cursor:"pointer", flexShrink:0 }} onClick={()=>onNavigate("product",null,null,item.id)} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:10, color:C.textDim, textTransform:"uppercase", letterSpacing:"0.1em" }}>{item.brand}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:4 }}>{item.name}</div>
                  <div style={{ fontSize:12, color:C.textDim, marginBottom:12 }}>Taille : {item.size}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:0, background:C.bg0, border:`1px solid ${C.border}`, borderRadius:8, width:"fit-content" }}>
                    <button onClick={()=>updateCartQty(item.id,item.size,item.qty-1)} style={{ width:32, height:32, background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.textMuted }}>−</button>
                    <span style={{ width:28, textAlign:"center", fontSize:13, fontWeight:700, color:C.text }}>{item.qty}</span>
                    <button onClick={()=>updateCartQty(item.id,item.size,item.qty+1)} style={{ width:32, height:32, background:"none", border:"none", cursor:"pointer", fontSize:18, color:C.textMuted }}>+</button>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", justifyContent:"space-between" }}>
                  <button onClick={()=>removeFromCart(item.id,item.size)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:16, color:C.textDim }}>×</button>
                  <span style={{ fontSize:16, fontWeight:900, color:C.text }}>{fmt(item.price*item.qty)}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:20, padding:24, height:"fit-content", position:"sticky", top:90 }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:C.text, marginBottom:20, marginTop:0 }}>Récapitulatif</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              {[["Sous-total", fmt(total.toFixed(2))],["Livraison", shipping===0 ? "Gratuite 🎉" : fmt(shipping)]].map(([l,v])=>(
                <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:13 }}>
                  <span style={{ color:C.textMuted }}>{l}</span>
                  <span style={{ color:shipping===0&&l==="Livraison"?C.accentLight:C.text }}>{v}</span>
                </div>
              ))}
              {shipping>0 && <div style={{ fontSize:11, color:C.textDim }}>Livraison offerte dès 100 €</div>}
              <div style={{ height:1, background:C.border }}/>
              <div style={{ display:"flex", justifyContent:"space-between" }}>
                <strong style={{ color:C.text }}>Total</strong>
                <strong style={{ fontSize:18, color:C.text }}>{fmt((total+shipping).toFixed(2))}</strong>
              </div>
            </div>
            <BtnPrimary onClick={()=>onNavigate("checkout")} full>Passer la commande</BtnPrimary>
            <div style={{ marginTop:16, display:"flex", justifyContent:"center", gap:16 }}>
              {["💳 CB","🅿️ PayPal","🔄 Revolut"].map(m=><span key={m} style={{fontSize:10,color:C.textDim}}>{m}</span>)}
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
  const total = cart.reduce((s,i)=>s+i.price*i.qty, 0);

  const inp = (field, placeholder, type="text") => (
    <input type={type} placeholder={placeholder} value={form[field]} onChange={e=>setForm({...form,[field]:e.target.value})}
      style={{ width:"100%", padding:"12px 16px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.text, outline:"none", boxSizing:"border-box" }} />
  );

  if(done) return (
    <div style={{ minHeight:"100vh", paddingTop:90, display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
      <div>
        <div style={{ width:80, height:80, borderRadius:"50%", background:`rgba(64,145,108,.15)`, border:`2px solid ${C.accent}`, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:32 }}>✓</div>
        <h2 style={{ fontSize:30, fontWeight:900, color:C.text, marginBottom:10 }}>Commande confirmée !</h2>
        <p style={{ fontSize:14, color:C.textMuted, marginBottom:8 }}>Merci pour votre achat. Un email de confirmation vous a été envoyé.</p>
        <p style={{ fontSize:13, color:C.textDim, marginBottom:32 }}>Livraison prévue dans 7 à 12 jours ouvrés.</p>
        <BtnPrimary onClick={()=>onNavigate("home")}>Retour à l'accueil</BtnPrimary>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", paddingTop:90, paddingBottom:80 }}>
      <div style={{ maxWidth:900, margin:"0 auto", padding:"0 24px" }}>
        <h1 style={{ fontSize:28, fontWeight:900, color:C.text, marginBottom:32 }}>Finaliser la commande</h1>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:40 }}>
          {[1,2].map(s=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, transition:"all .3s",
                background:step>=s?C.accent:C.bg1, color:step>=s?"#fff":C.textDim, border:`1px solid ${step>=s?C.accent:C.border}` }}>{s}</div>
              <span style={{ fontSize:13, color:step>=s?C.text:C.textDim }}>{s===1?"Livraison":"Paiement"}</span>
              {s<2 && <div style={{ width:40, height:1, background:step>s?C.accent:C.border, margin:"0 4px" }}/>}
            </div>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:32 }}>
          <div>
            {step===1 && (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <h3 style={{ fontSize:16, fontWeight:700, color:C.text, margin:"0 0 4px" }}>Adresse de livraison</h3>
                {inp("name","Nom complet")}
                {inp("email","Email","email")}
                {inp("address","Adresse")}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  {inp("city","Ville")}
                  {inp("zip","Code postal")}
                </div>
                {inp("country","Pays")}
                <div style={{ marginTop:8 }}>
                  <BtnPrimary onClick={()=>setStep(2)} disabled={!form.name||!form.email||!form.address}>Continuer →</BtnPrimary>
                </div>
              </div>
            )}
            {step===2 && (
              <div>
                <h3 style={{ fontSize:16, fontWeight:700, color:C.text, margin:"0 0 16px" }}>Mode de paiement</h3>
                <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                  {[["card","💳","Carte bancaire"],["paypal","🅿️","PayPal"],["revolut","🔄","Revolut"]].map(([id,icon,label])=>(
                    <button key={id} onClick={()=>setForm({...form,payment:id})}
                      style={{ display:"flex", alignItems:"center", gap:12, padding:"16px", borderRadius:14, cursor:"pointer", transition:"all .2s",
                        background:form.payment===id?`rgba(64,145,108,.08)`:C.bg1, border:`1px solid ${form.payment===id?C.accent:C.border}` }}>
                      <span style={{fontSize:22}}>{icon}</span>
                      <span style={{fontSize:14,fontWeight:600,color:C.text}}>{label}</span>
                      {form.payment===id&&<span style={{marginLeft:"auto",color:C.accentLight,fontWeight:700}}>✓</span>}
                    </button>
                  ))}
                </div>
                {form.payment==="card"&&(
                  <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:24 }}>
                    <input placeholder="Numéro de carte" style={{ padding:"12px 16px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.text, outline:"none" }} />
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                      <input placeholder="MM/AA" style={{ padding:"12px 16px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.text, outline:"none" }} />
                      <input placeholder="CVV" style={{ padding:"12px 16px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:12, fontSize:13, color:C.text, outline:"none" }} />
                    </div>
                  </div>
                )}
                <div style={{ display:"flex", gap:12 }}>
                  <button onClick={()=>setStep(1)} style={{ padding:"12px 24px", background:"none", border:`1px solid ${C.border}`, borderRadius:99, fontSize:12, color:C.textMuted, cursor:"pointer" }}>← Retour</button>
                  <BtnPrimary onClick={()=>{ clearCart(); setDone(true); }}>Confirmer · {fmt((total+(total>100?0:9.99)).toFixed(2))}</BtnPrimary>
                </div>
              </div>
            )}
          </div>
          <div style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:20, padding:20, height:"fit-content" }}>
            <h3 style={{ fontSize:14, fontWeight:700, color:C.text, marginTop:0, marginBottom:16 }}>Votre commande</h3>
            {cart.map(item=>(
              <div key={`${item.id}-${item.size}`} style={{ display:"flex", gap:10, marginBottom:12, alignItems:"center" }}>
                <img src={item.images[0]} alt="" style={{ width:44, height:44, borderRadius:10, objectFit:"cover" }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                  <div style={{ fontSize:10, color:C.textDim }}>×{item.qty} — T.{item.size}</div>
                </div>
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>{fmt(item.price*item.qty)}</span>
              </div>
            ))}
            <div style={{ height:1, background:C.border, margin:"12px 0" }}/>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:15, fontWeight:900, color:C.text }}>
              <span>Total</span><span>{fmt((total+(total>100?0:9.99)).toFixed(2))}</span>
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
  const [form, setForm]       = useState({ name:"", email:"", password:"" });
  const [error, setError]     = useState("");
  const inp = (f, ph, type="text") => (
    <input type={type} placeholder={ph} value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}
      style={{ width:"100%", padding:"14px 18px", background:C.bg1, border:`1px solid ${C.border}`, borderRadius:14, fontSize:13, color:C.text, outline:"none", boxSizing:"border-box" }} />
  );
  const submit = () => {
    if(!form.email||!form.password){ setError("Remplissez tous les champs."); return; }
    if(!isLogin&&!form.name){ setError("Entrez votre nom."); return; }
    login({ name:form.name||form.email.split("@")[0], email:form.email });
    onNavigate("account");
  };
  return (
    <div style={{ minHeight:"100vh", paddingTop:90, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:440, padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:32 }}>
          <h1 style={{ fontSize:28, fontWeight:900, color:C.text, marginBottom:6 }}>{isLogin?"Bon retour 👋":"Rejoindre FreshWare"}</h1>
          <p style={{ fontSize:13, color:C.textDim }}>{isLogin?"Connectez-vous à votre compte":"Créez votre compte gratuit"}</p>
        </div>
        <div style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:24, padding:32 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {!isLogin&&inp("name","Nom complet")}
            {inp("email","Email","email")}
            {inp("password","Mot de passe","password")}
          </div>
          {error&&<p style={{ color:"#f87171", fontSize:12, marginTop:10 }}>{error}</p>}
          <div style={{ marginTop:20 }}><BtnPrimary onClick={submit} full>{isLogin?"Se connecter":"Créer mon compte"}</BtnPrimary></div>
          <button onClick={()=>{ setIsLogin(!isLogin); setError(""); }} style={{ marginTop:16, width:"100%", textAlign:"center", fontSize:12, color:C.textDim, background:"none", border:"none", cursor:"pointer" }}>
            {isLogin?"Pas encore de compte ? Inscrivez-vous →":"Déjà un compte ? Connectez-vous"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNT ──────────────────────────────────────────────────────────────────
function AccountPage({ onNavigate }) {
  const { user, logout } = useApp();
  if(!user){ onNavigate("login"); return null; }
  const orders = [
    { id:"#FW-2847", date:"05/04/2026", items:["Air Phantom X (T.42)","Cap Structured (Noir)"], total:"224 €", status:"Livré", ok:true },
    { id:"#FW-2391", date:"20/03/2026", items:["Hoodie Chrome Logo (L)"], total:"89 €", status:"En cours", ok:false },
  ];
  return (
    <div style={{ minHeight:"100vh", paddingTop:90, paddingBottom:80 }}>
      <div style={{ maxWidth:860, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:36 }}>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:`linear-gradient(135deg, ${C.accentDark}, ${C.accentLight})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, fontWeight:900, color:"#fff" }}>{user.name[0].toUpperCase()}</div>
            <div>
              <h1 style={{ fontSize:22, fontWeight:900, color:C.text, margin:0 }}>{user.name}</h1>
              <p style={{ fontSize:13, color:C.textDim, margin:0 }}>{user.email}</p>
            </div>
          </div>
          <button onClick={()=>{ logout(); onNavigate("home"); }} style={{ padding:"8px 18px", background:"none", border:`1px solid ${C.border}`, borderRadius:99, fontSize:11, color:C.textDim, cursor:"pointer" }}>Déconnexion</button>
        </div>
        <h2 style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:16 }}>Historique des commandes</h2>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {orders.map(o=>(
            <div key={o.id} style={{ background:C.bg1, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text }}>{o.id}</div>
                  <div style={{ fontSize:12, color:C.textDim }}>{o.date}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:16, fontWeight:900, color:C.text }}>{o.total}</span>
                  <span style={{ fontSize:10, fontWeight:700, padding:"4px 12px", borderRadius:99,
                    background:o.ok?"rgba(34,197,94,.12)":"rgba(64,145,108,.1)",
                    color:o.ok?"#22c55e":C.accentLight }}>{o.status}</span>
                </div>
              </div>
              {o.items.map(item=><div key={item} style={{ fontSize:12, color:C.textMuted }}>· {item}</div>)}
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
  const wished = products.filter(p=>wishlist.includes(p.id));
  if(wished.length===0) return (
    <div style={{ minHeight:"100vh", paddingTop:90, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
      <div style={{ fontSize:56, marginBottom:16 }}>🤍</div>
      <h2 style={{ fontSize:24, fontWeight:900, color:C.text, marginBottom:8 }}>Aucun favori</h2>
      <p style={{ fontSize:14, color:C.textDim, marginBottom:28 }}>Cliquez sur ♥ pour sauvegarder vos coups de cœur</p>
      <BtnPrimary onClick={()=>onNavigate("catalogue")}>Explorer le catalogue</BtnPrimary>
    </div>
  );
  return (
    <div style={{ minHeight:"100vh", paddingTop:90, paddingBottom:80 }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
        <h1 style={{ fontSize:32, fontWeight:900, color:C.text, marginBottom:32 }}>Ma Wishlist</h1>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 }}>
          {wished.map((p,i)=><ProductCard key={p.id} product={p} onNavigate={onNavigate} delay={i*80}/>)}
        </div>
      </div>
    </div>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ onNavigate }) {
  return (
    <footer style={{ background:C.bg0, borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"60px 24px 28px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>
          <div>
            <div style={{ fontSize:24, fontWeight:900, letterSpacing:"0.06em", fontFamily:"'Bebas Neue', Impact, sans-serif", marginBottom:4, color:C.text }}>
              FRESH<span style={{ color:C.accent }}>WARE</span>
            </div>
            <div style={{ fontSize:8, letterSpacing:"0.25em", color:C.textDim, marginBottom:16 }}>STAY FRESH. STAY AHEAD.</div>
            <p style={{ fontSize:12, color:C.textDim, lineHeight:1.6, maxWidth:240 }}>Votre destination streetwear & luxe à prix accessibles. Authenticité garantie sur chaque pièce.</p>
          </div>
          {[
            { title:"Boutique", links:[["Catalogue","catalogue"],["Nouveautés","catalogue","new"],["Best Sellers","catalogue","bestseller"],["Sneakers","catalogue","sneakers"]] },
            { title:"Compte", links:[["Se connecter","login"],["Mon compte","account"],["Ma wishlist","wishlist"],["Mon panier","cart"]] },
          ].map(col=>(
            <div key={col.title}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.2em", color:C.textMuted, textTransform:"uppercase", marginBottom:16 }}>{col.title}</div>
              {col.links.map(([label,page,filter])=>(
                <button key={label} onClick={()=>onNavigate(page,filter)}
                  style={{ display:"block", background:"none", border:"none", cursor:"pointer", fontSize:12, color:C.textDim, padding:"5px 0", transition:"color .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.color=C.accentLight}
                  onMouseLeave={e=>e.currentTarget.style.color=C.textDim}>
                  {label}
                </button>
              ))}
            </div>
          ))}
          <div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.2em", color:C.textMuted, textTransform:"uppercase", marginBottom:16 }}>Infos</div>
            {[["🚚","Livraison intl.","7-12 jours ouvrés"],["💳","Paiement sécurisé","CB · PayPal · Revolut"],["✅","Authenticité","Certifié & garanti"]].map(([icon,label,sub])=>(
              <div key={label} style={{ display:"flex", gap:10, marginBottom:14 }}>
                <span style={{ fontSize:14, marginTop:1 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:600, color:C.textMuted }}>{label}</div>
                  <div style={{ fontSize:10, color:C.textDim }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, color:C.textDim }}>© 2026 FreshWare. Tous droits réservés.</span>
          <div style={{ display:"flex", gap:20 }}>
            {["CGV","Confidentialité","Mentions légales"].map(l=>(
              <button key={l} style={{ background:"none", border:"none", cursor:"pointer", fontSize:11, color:C.textDim }}>{l}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return ()=>clearTimeout(t); }, []);
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", alignItems:"center", gap:10, padding:"12px 20px", background:C.bg2, border:`1px solid ${C.accent}`, borderRadius:14, backdropFilter:"blur(16px)", animation:"toastIn .3s ease" }}>
      <div style={{ width:20, height:20, borderRadius:"50%", background:C.accent, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700 }}>✓</div>
      <span style={{ fontSize:13, color:C.text, fontWeight:500 }}>{message}</span>
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

  const showToast = msg => { setToast(null); setTimeout(()=>setToast(msg),10); };
  const navigate  = (p, filter=null, search=null, productId=null) => {
    setPage(p); setPageFilter(filter); setPageSearch(search); setPageProduct(productId);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const addToCart = (product, size) => {
    setCart(prev=>{
      const ex = prev.find(i=>i.id===product.id&&i.size===size);
      return ex ? prev.map(i=>i.id===product.id&&i.size===size?{...i,qty:i.qty+1}:i) : [...prev,{...product,size,qty:1}];
    });
    showToast(`${product.name} ajouté au panier`);
  };

  const removeFromCart = (id,size) => setCart(p=>p.filter(i=>!(i.id===id&&i.size===size)));
  const updateCartQty  = (id,size,qty) => qty<=0 ? removeFromCart(id,size) : setCart(p=>p.map(i=>i.id===id&&i.size===size?{...i,qty}:i));
  const clearCart      = () => setCart([]);
  const toggleWishlist = (id) => {
    setWishlist(prev=>{
      const has = prev.includes(id);
      showToast(has?"Retiré des favoris":"Ajouté aux favoris ♥");
      return has ? prev.filter(i=>i!==id) : [...prev,id];
    });
  };

  const cartCount = cart.reduce((s,i)=>s+i.qty,0);

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, updateCartQty, clearCart, wishlist, toggleWishlist, user, login:setUser, logout:()=>setUser(null) }}>
      <div style={{ background:C.bg0, minHeight:"100vh", color:C.text }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
          *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
          body { background:${C.bg0}; color:${C.text}; font-family:'Inter', system-ui, sans-serif; -webkit-font-smoothing:antialiased; }
          @keyframes toastIn { from { transform:translateY(16px); opacity:0; } to { transform:translateY(0); opacity:1; } }
          @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.4; } }
          ::-webkit-scrollbar { width:4px; }
          ::-webkit-scrollbar-track { background:${C.bg0}; }
          ::-webkit-scrollbar-thumb { background:${C.accentDark}; border-radius:2px; }
          input::placeholder { color:${C.textDim}; }
          select option { background:${C.bg1}; color:${C.text}; }
        `}</style>

        <Navbar onNavigate={navigate} cartCount={cartCount} wishlistCount={wishlist.length} />

        {page==="home"      && <HomePage      onNavigate={navigate} />}
        {page==="catalogue" && <CataloguePage onNavigate={navigate} initialFilter={pageFilter} initialSearch={pageSearch} />}
        {page==="product"   && <ProductPage   productId={pageProduct} onNavigate={navigate} />}
        {page==="cart"      && <CartPage      onNavigate={navigate} />}
        {page==="checkout"  && <CheckoutPage  onNavigate={navigate} />}
        {page==="login"     && <AuthPage      onNavigate={navigate} />}
        {page==="account"   && <AccountPage   onNavigate={navigate} />}
        {page==="wishlist"  && <WishlistPage  onNavigate={navigate} />}

        <Footer onNavigate={navigate} />
        {toast && <Toast message={toast} onClose={()=>setToast(null)} />}
      </div>
    </AppContext.Provider>
  );
}
