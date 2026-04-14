import { useState } from "react";
import { products } from "./data/products";
import { motion } from "framer-motion";

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

        <motion.div
          key={cart.length}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-sm"
        >
          🛒 {cart.length}
        </motion.div>
      </header>

      {/* HERO */}
      <section className="px-8 py-16 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-semibold mb-4"
        >
          Minimal. Élégant. Moderne.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-neutral-400 max-w-lg"
        >
          Une collection pensée pour un style propre, simple et efficace.
        </motion.p>
      </section>

      {/* PRODUCTS */}
      <section className="px-8 pb-20 max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {products.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className="border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-600 transition"
          >
            <div className="aspect-square bg-neutral-800" />

            <div className="p-4 space-y-2">
              <h3 className="text-sm font-medium">{p.name}</h3>
              <p className="text-neutral-400 text-xs">{p.category}</p>

              <div className="flex justify-between pt-2 items-center">
                <span>{p.price} €</span>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => addToCart(p)}
                  className="text-xs px-3 py-1.5 rounded-full bg-white text-black"
                >
                  Ajouter
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="px-8 py-10 border-t border-neutral-800 text-neutral-500 text-sm text-center">
        © {new Date().getFullYear()} Freshware
      </footer>
    </div>
  );
}
