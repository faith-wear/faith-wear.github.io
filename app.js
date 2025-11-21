const { useState, useEffect } = React;

// --- Product data ---
const PRODUCTS = [
  {
    id: "ps91",
    name: "Faith Over Fear – Psalm 91:2",
    price: 3999,
    compareAt: 5999,
    image: "images/hoodie-faithoverfear-ps91-front.jpg",
    tag: "Best seller",
    verse: "Psalm 91:2",
  },
  {
    id: "crossblk",
    name: "Faith Over Fear Cross Hoodie",
    price: 3499,
    compareAt: 4999,
    image: "images/hoodie-faithoverfear-cross-front.jpg",
    tag: "Unisex",
    verse: "Faith Over Fear",
  },
  {
    id: "pinkps56",
    name: "Faith Over Fear – Psalm 56:3 (Pink)",
    price: 3799,
    compareAt: 5499,
    image: "images/hoodie-faithoverfear-ps56-pink-front.jpg",
    tag: "Limited",
    verse: "Psalm 56:3",
  },
  {
    id: "ps53",
    name: "Faith Over Fear – Psalm 5:3",
    price: 3599,
    compareAt: 5299,
    image: "images/hoodie-faithoverfear-ps53-front.jpg",
    tag: "Cozy fleece",
    verse: "Psalm 5:3",
  },
  {
    id: "polyblk",
    name: "Polyester Faith Hoodie",
    price: 2899,
    compareAt: 3999,
    image: "images/hoodie-faithoverfear-poly-front.jpg",
    tag: "Lightweight",
    verse: "Everyday faith",
  },
  {
    id: "3dcross",
    name: "3D Cross Faith Hoodie",
    price: 4299,
    compareAt: 6299,
    image: "images/hoodie-faithoverfear-3d-cross-front.jpg",
    tag: "Statement piece",
    verse: "Cross graphic",
  },
  {
    id: "flag",
    name: "Faith Over Fear – American Flag",
    price: 3799,
    compareAt: 5599,
    image: "images/hoodie-faithoverfear-flag-front.jpg",
    tag: "Flag + cross",
    verse: "Faith & Freedom",
  },
  {
    id: "holy",
    name: "God Is Holy Graffiti Hoodie",
    price: 3499,
    compareAt: 4999,
    image: "images/hoodie-godisholy-graffiti-front.jpg",
    tag: "Bible study fav",
    verse: "1 Peter 1:14–17",
  },
  {
    id: "funny",
    name: "Funny Jesus Prayer Hoodie",
    price: 3299,
    compareAt: 4599,
    image: "images/hoodie-jesus-prayer-funny-front.jpg",
    tag: "Icebreaker",
    verse: "Prayer",
  },
  {
    id: "bread",
    name: "BREAD Inspirational Hoodie",
    price: 3099,
    compareAt: 4399,
    image: "images/hoodie-bread-toast-front.jpg",
    tag: "Conversation starter",
    verse: "Daily bread",
  },
];

const CART_KEY = "faithwear_cart_v2";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(paisa) {
  // p is in INR rupees (e.g., 3999)
  return "₹" + paisa.toLocaleString();
}

function getViewFromPath() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "index.html";

  if (last === "collections.html") return "collections";
  if (last === "cart.html") return "cart";
  if (last === "checkout.html") return "checkout";
  return "home";
}

function App() {
  const [cart, setCart] = useState(loadCart);
  const [view] = useState(getViewFromPath());

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = cart.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return sum;
    return sum + product.price * item.qty;
  }, 0);

  const addToCart = (productId, size = "M") => {
    setCart((prev) => {
      const next = [...prev];
      const idx = next.findIndex((i) => i.id === productId && i.size === size);
      if (idx !== -1) {
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
      } else {
        next.push({ id: productId, size, qty: 1 });
      }
      return next;
    });
  };

  const updateQty = (productId, size, delta) => {
    setCart((prev) => {
      const next = prev.map((item) => ({ ...item }));
      const idx = next.findIndex((i) => i.id === productId && i.size === size);
      if (idx === -1) return prev;
      const newQty = next[idx].qty + delta;
      if (newQty <= 0) {
        next.splice(idx, 1);
      } else {
        next[idx].qty = newQty;
      }
      return next;
    });
  };

  const removeItem = (productId, size) => {
    setCart((prev) => prev.filter((i) => !(i.id === productId && i.size === size)));
  };

  const clearCart = () => setCart([]);

  let content;
  if (view === "collections") {
    content = (
      <CollectionsPage
        products={PRODUCTS}
        onAddToCart={addToCart}
      />
    );
  } else if (view === "cart") {
    content = (
      <CartPage
        cart={cart}
        products={PRODUCTS}
        onUpdateQty={updateQty}
        onRemove={removeItem}
        onClear={clearCart}
        total={totalPrice}
      />
    );
  } else if (view === "checkout") {
    content = (
      <CheckoutPage
        cart={cart}
        products={PRODUCTS}
        total={totalPrice}
      />
    );
  } else {
    content = (
      <HomePage
        featured={PRODUCTS[0]}
        onAddToCart={() => addToCart(PRODUCTS[0].id, "M")}
      />
    );
  }

  return (
    <div className="app-shell">
      <Header totalItems={totalItems} />
      <main className="app-main">{content}</main>
      <Footer />
    </div>
  );
}

function Header({ totalItems }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="logo-block">
          <div className="logo-badge">F</div>
          <div className="brand-text">FaithWear Co.</div>
        </div>
        <nav className="nav-links">
          <a href="/index.html">Home</a>
          <a href="/collections.html">Collections</a>
          <a href="/cart.html">Cart</a>
          <a href="/checkout.html">Checkout</a>
        </nav>
        <button
          className="nav-cart"
          type="button"
          onClick={() => (window.location.href = "/cart.html")}
        >
          Cart
          <span className="nav-cart-count">{totalItems}</span>
        </button>
      </div>
    </header>
  );
}

// --- Views ---

function HomePage({ featured, onAddToCart }) {
  return (
    <section className="hero">
      <div>
        <div className="hero-eyebrow">Limited online drop</div>
        <h1 className="hero-title">
          Wear your <span>Faith</span> louder than your fear.
        </h1>
        <p className="hero-sub">
          FaithWear hoodies are designed to feel like your coziest sweatshirt and
          look like your favorite streetwear, with scripture and faith messages
          woven into every print.
        </p>

        <div className="hero-badges">
          <span className="pill pill-strong">🔥 Over 1000+ shipped via suppliers</span>
          <span className="pill">Unisex fit</span>
          <span className="pill">Soft fleece interior</span>
          <span className="pill">Ships worldwide</span>
        </div>

        <div className="hero-cta-row">
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/collections.html")}
          >
            Shop hoodies
          </button>
          <button
            className="btn btn-ghost"
            onClick={() =>
              document
                .getElementById("featured-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            View featured
          </button>
        </div>

        <div className="hero-assurance">
          Free shipping on select orders · 14-day issue resolution promise
        </div>
      </div>

      <div className="hero-product-card" id="featured-section">
        <div className="hero-product-inner">
          <div className="hero-product-media">
            <span className="hero-tag">
              <span>Featured</span> · Online exclusive
            </span>
            <img
              src={featured.image}
              alt={featured.name}
            />
          </div>
          <div className="hero-product-body">
            <h3>{featured.name}</h3>
            <p>
              Unisex black pullover with bold “Faith Over Fear” back print and{" "}
              <strong>{featured.verse}</strong> reference. Meant for chilly
              evenings, campus walks, and Sunday mornings.
            </p>
            <div className="price-row">
              <div className="price-main">
                {formatPrice(featured.price)} <small>INR</small>
              </div>
              <div className="price-compare">
                {formatPrice(featured.compareAt)}
              </div>
              <div className="price-badge">Save up to 40%</div>
            </div>
            <button className="btn btn-primary btn-wide" onClick={onAddToCart}>
              Add featured to cart
            </button>
            <button
              className="btn btn-ghost btn-wide"
              onClick={() => (window.location.href = "/collections.html")}
            >
              Browse all hoodies
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function CollectionsPage({ products, onAddToCart }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [sizes, setSizes] = useState({}); // productId -> size

  const filtered = products
    .filter((p) => {
      const q = query.toLowerCase();
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.verse && p.verse.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return 0;
    });

  const handleSizeChange = (id, value) => {
    setSizes((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = (id) => {
    const size = sizes[id] || "M";
    onAddToCart(id, size);
  };

  return (
    <section>
      <h2 className="page-title">Hoodie collection</h2>
      <p className="page-subtitle">
        Pick your favorite design, choose your size, and add it to your cart. You
        can always edit quantities and sizes in the cart.
      </p>

      <div className="collections-toolbar">
        <input
          className="input-text"
          placeholder="Search by name or verse…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Sort: Price (low → high)</option>
          <option value="price-desc">Sort: Price (high → low)</option>
        </select>
      </div>

      <div className="products-grid">
        {filtered.map((p) => (
          <article key={p.id} className="product-card">
            <img src={p.image} alt={p.name} />
            <div className="product-name">{p.name}</div>
            <div className="product-meta">
              {p.tag} · {p.verse}
            </div>
            <div className="price-row" style={{ marginTop: "0.3rem" }}>
              <div className="price-main">
                {formatPrice(p.price)} <small>INR</small>
              </div>
              <div className="price-compare">{formatPrice(p.compareAt)}</div>
            </div>
            <div className="product-footer">
              <div className="size-row">
                <span>Size</span>
                <select
                  value={sizes[p.id] || "M"}
                  onChange={(e) => handleSizeChange(p.id, e.target.value)}
                >
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <button
                className="btn btn-primary btn-wide"
                onClick={() => handleAdd(p.id)}
              >
                Add to cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CartPage({ cart, products, onUpdateQty, onRemove, onClear, total }) {
  const hasItems = cart.length > 0;

  return (
    <section>
      <h2 className="page-title">Your cart</h2>
      <p className="page-subtitle">
        Review your items, adjust quantities, and then continue to secure
        checkout.
      </p>

      {!hasItems && (
        <p className="page-subtitle">
          Your cart is empty.{" "}
          <a href="/collections.html" style={{ textDecoration: "underline" }}>
            Browse the collection
          </a>
          .
        </p>
      )}

      {hasItems && (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;
              const lineTotal = product.price * item.qty;
              return (
                <div key={item.id + item.size} className="cart-item">
                  <img src={product.image} alt={product.name} />
                  <div>
                    <div className="cart-item-name">{product.name}</div>
                    <div className="cart-item-meta">
                      Size: {item.size} · {product.verse}
                    </div>
                    <div className="qty-controls">
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.id, item.size, -1)}
                      >
                        −
                      </button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        className="qty-btn"
                        onClick={() => onUpdateQty(item.id, item.size, 1)}
                      >
                        +
                      </button>
                      <button
                        className="qty-btn"
                        style={{ marginLeft: "0.5rem" }}
                        onClick={() => onRemove(item.id, item.size)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-price">{formatPrice(lineTotal)}</div>
                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <div className="cart-summary-row">
              <span>Items</span>
              <span>{cart.reduce((s, i) => s + i.qty, 0)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="cart-summary-total cart-summary-row">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              className="btn btn-primary btn-wide"
              style={{ marginTop: "0.6rem" }}
              onClick={() => (window.location.href = "/checkout.html")}
            >
              Continue to checkout
            </button>
            <button
              className="btn btn-ghost btn-wide"
              style={{ marginTop: "0.4rem" }}
              onClick={onClear}
            >
              Clear cart
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}

function CheckoutPage({ cart, products, total }) {
  const hasItems = cart.length > 0;

  const handlePay = () => {
    if (!hasItems) {
      alert("Your cart is empty.");
      return;
    }

    const options = {
      key: "rzp_test_xxxxxx", // TODO: your Razorpay key
      amount: total * 100, // paise
      currency: "INR",
      name: "FaithWear Co.",
      description: "Hoodie order",
      order_id: "order_xxxxx", // TODO: replace with backend-generated order ID
      handler: function (response) {
        window.location.href = "/success.html";
      },
      theme: {
        color: "#000000",
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };

  return (
    <section>
      <h2 className="page-title">Checkout</h2>
      <p className="page-subtitle">
        Enter your details and complete payment securely via Razorpay.
      </p>

      {!hasItems && (
        <p className="page-subtitle">
          Your cart is empty.{" "}
          <a href="/collections.html" style={{ textDecoration: "underline" }}>
            Add some hoodies first
          </a>
          .
        </p>
      )}

      <div className="checkout-box">
        <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Order summary</h3>
        {hasItems ? (
          <ul style={{ listStyle: "none", paddingLeft: 0, fontSize: "0.9rem" }}>
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.id);
              if (!product) return null;
              return (
                <li key={item.id + item.size}>
                  {item.qty} × {product.name} ({item.size}) —{" "}
                  {formatPrice(product.price * item.qty)}
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ fontSize: "0.85rem", color: "#c3c6d1" }}>
            No items in your order.
          </p>
        )}
        <p style={{ marginTop: "0.4rem" }}>
          <strong>Total: {formatPrice(total)}</strong>
        </p>

        <hr style={{ borderColor: "rgba(255,255,255,0.12)", margin: "0.8rem 0" }} />

        <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Shipping details</h3>
        <div className="form-group">
          <label className="form-label">Full name</label>
          <input
            className="form-input"
            placeholder="Your name"
            type="text"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            className="form-input"
            placeholder="you@example.com"
            type="email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Shipping address</label>
          <input
            className="form-input"
            placeholder="Street, city, country"
            type="text"
          />
        </div>

        <button
          className="btn btn-primary btn-wide"
          style={{ marginTop: "0.6rem" }}
          onClick={handlePay}
        >
          Pay with Razorpay
        </button>
        <p
          style={{
            fontSize: "0.78rem",
            color: "#c3c6d1",
            marginTop: "0.4rem",
          }}
        >
          You’ll be redirected to Razorpay’s secure payment page. By completing
          payment, you confirm your order details are correct.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer-inner">
        <div>
          © {new Date().getFullYear()} FaithWear Co. All rights reserved.
        </div>
        <div>Made for people who choose faith over fear.</div>
      </div>
    </footer>
  );
}

// Mount React app
const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App />);
}
