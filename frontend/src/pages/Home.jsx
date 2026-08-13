import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/product');
        const data = await res.json();
        setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div style={{ background: '#09090b', minHeight: '100vh' }}>

      {/* HERO */}
      <div style={{ position: 'relative', minHeight: '88vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(249,115,22,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '-10%', width: '400px', height: '400px', background: 'rgba(249,115,22,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '300px', height: '300px', background: 'rgba(234,88,12,0.08)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '50px', padding: '6px 18px', marginBottom: '28px', color: '#f97316', fontSize: '0.9rem', fontWeight: '600' }}>
            India's Fastest Growing E-Commerce Store
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-2px', background: 'linear-gradient(135deg, #ffffff 0%, #f97316 50%, #ea580c 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Shop Smarter.<br />Live Better.
          </h1>
          <p style={{ color: '#a1a1aa', fontSize: '1.2rem', lineHeight: '1.7', maxWidth: '560px', margin: '0 auto 40px' }}>
            Discover thousands of premium products at unbeatable prices. Fast delivery, easy returns, and 24/7 support.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn" style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '12px' }}>Shop Now</Link>
            <Link to="/register" style={{ padding: '16px 36px', fontSize: '1.05rem', borderRadius: '12px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', display: 'inline-block', background: 'rgba(255,255,255,0.05)' }}>Create Account</Link>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: '28px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px', textAlign: 'center' }}>
          {[{ number: '10,000+', label: 'Happy Customers' }, { number: '500+', label: 'Products Available' }, { number: '99.8%', label: 'Satisfaction Rate' }, { number: '24/7', label: 'Customer Support' }].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#f97316' }}>{stat.number}</div>
              <div style={{ color: '#71717a', fontSize: '0.9rem', marginTop: '4px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED PRODUCTS */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '70px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: '#f97316', fontWeight: '600', fontSize: '0.9rem', marginBottom: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>? Handpicked For You</p>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '10px' }}>Featured Products</h2>
          <p style={{ color: '#71717a', fontSize: '1rem' }}>Top picks from our curated collection</p>
        </div>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid #27272a', borderTopColor: '#f97316', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : products.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#71717a', padding: '40px' }}>No products found.</p>
        ) : (
          <div className="product-grid">
            {products.map((product) => (<ProductCard key={product._id} product={product} />))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link to="/shop" className="btn" style={{ padding: '14px 40px', fontSize: '1rem', borderRadius: '10px' }}>View All Products ?</Link>
        </div>
      </div>

      {/* WHY EASYCART */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '70px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '10px' }}>Why Choose EasyCart?</h2>
            <p style={{ color: '#71717a' }}>We put your shopping experience first</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
            {[
              { icon: '⚡', title: 'Fast Delivery', desc: 'Lightning-fast shipping to your doorstep within 2-5 business days.' },
              { icon: '🔐', title: 'Secure Payments', desc: 'Your transactions are protected by industry-leading encryption.' },
              { icon: '↩', title: 'Easy Returns', desc: '30-day hassle-free return policy. No questions asked.' },
              { icon: '☎', title: '24/7 Support', desc: 'Our team is always available to help you anytime, anywhere.' },
            ].map((f, i) => (
              <div key={i}
                style={{ background: '#18181b', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', padding: '28px 24px', transition: 'transform 0.3s ease, border-color 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>{f.icon}</div>
                <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '8px' }}>{f.title}</h4>
                <p style={{ color: '#71717a', fontSize: '0.9rem', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
