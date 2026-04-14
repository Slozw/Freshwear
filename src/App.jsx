import { useState } from "react";
import { products } from "./data/products";

export default function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-neutral-800">
        <h1 className="text-xl font-semibold tracking-wide">FRESHWARE</h1>
        <div className="text-sm">🛒 {cart.length}</div>
      </header>

      {/* HERO */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-semibold mb-4">
          Minimal. Élégant. Moderne.
        </h2>
        <p className="text-neutral-400 max-w-lg">
          Une collection pensée pour un style propre, simple et efficace.
        </p>
      </section>

      {/* PRODUCTS */}
      <section className="px-8 pb-20 max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition"
          >
            <div className="aspect-square bg-neutral-800" />

            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium">{p.name}</h3>
              <p className="text-neutral-400 text-xs">{p.category}</p>

              <div className="flex justify-between pt-2">
                <span>{p.price} €</span>
                <button
                  onClick={() => addToCart(p)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white text-black hover:opacity-80"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-10 border-t border-neutral-800 text-neutral-500 text-sm text-center">
        © {new Date().getFullYear()} Freshware
      </footer>
    </div>
  );
}
