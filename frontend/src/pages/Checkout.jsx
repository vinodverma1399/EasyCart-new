import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import API_BASE from '../config';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', state: '', postalCode: '', country: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePayment = async () => {
    try {
      const orderRes = await fetch(`${API_BASE}/api/payments/process-payment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        // Razorpay unconfigured exception handler
        const fallback = window.confirm("Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?");
        if (fallback) {
          return bypassPayment();
        } else {
          return alert("Payment failed to initialize");
        }
      }

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'EasyCart',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            console.log("Razorpay response received:", response);
            const verifyRes = await fetch(`${API_BASE}/api/payments/verify-payment`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify(response)
            });
            const verifyData = await verifyRes.json();
            console.log("Verify payment response:", verifyData);

            if (verifyRes.ok) {
              dispatch(clearCart());
              localStorage.removeItem('cartItems');

              try {
                await fetch(`${API_BASE}/api/orders`, {
                  method: 'POST',
                  headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                  },
                  body: JSON.stringify({
                    items: cartItems.map(i => ({ productID: i.productId, qty: i.qty, price: i.price })),
                    totalAmount: totalPrice,
                    address,
                    paymentId: response.razorpay_payment_id
                  })
                });
              } catch (saveErr) {
                console.error("Order save error:", saveErr);
              }

              alert(verifyData.message || 'Payment verified successfully');
              window.location.href = '/';
            } else {
              alert('Payment verification failed: ' + (verifyData.message || 'Signature mismatch'));
            }
          } catch (err) {
            console.error("Error in payment handler:", err);
            alert('Error processing payment: ' + err.message);
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: {
          color: '#f97316'
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
    }
  };

  const bypassPayment = async () => {
    const saveOrderRes = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems.map(i => ({ productID: i.productId, qty: i.qty, price: i.price })),
        totalAmount: totalPrice,
        address,
        paymentId: 'bypass_txn_' + Date.now()
      })
    });
    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert("Your cart is empty! Please add products from the shop first.");
      navigate('/shop');
      return;
    }
    handlePayment();
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: '#a1a1aa', margin: '20px 0' }}>Please add products to your cart before proceeding to checkout.</p>
        <button onClick={() => navigate('/shop')} className="btn">Go to Shop</button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="State" required value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;