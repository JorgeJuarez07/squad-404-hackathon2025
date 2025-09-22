import React, { useState } from 'react';
import ShoppingCartItem from '../../components/ShoppingCartItem/ShoppingCartItem';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import fetchWithAuth from '../../api';
import './ShoppingCartPage.css';

const initialCartItems = [
  { 
    id: 1, 
    name: 'Tomates Frescos', 
    price: 200.50, 
    quantity: 2, 
    sellerWallet: "https://ilp.interledger-test.dev/vsdsd", // Vendedor A
    image: 'https://imag.bonviveur.com/racimos-de-tomates-frescos-vendidos-como-verdura.webp',
    currency: "MXN" 
  },
  { 
    id: 2, 
    name: 'Lechuga Romana', 
    price: 100.20, 
    quantity: 1, 
    sellerWallet: "https://ilp.interledger-test.dev/vsdsd", // Vendedor A (misma wallet)
    image: 'https://www.totenu.com/wp-content/uploads/lechuga-romana-TotEnU-1080x675.jpg',
    currency: "MXN" 
  },
  { 
    id: 3, 
    name: 'Tractor', 
    price: 342355.00, 
    quantity: 3, 
    sellerWallet: "https://ilp.interledger-test.dev/sdcdscsd", // Vendedor B
    image: 'https://www.tractorpool.com.mx/media/4554/8384554/59118154/1757328616.jpg?width=240&height=180&crop=1',
    currency: "EUR" 
  },
];

// Helper para formatear los precios con su divisa
const formatCurrency = (amount, currency) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
};

const ShoppingCartPage = ({ user, logout, onProfileClick }) => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [buyerWallet, setBuyerWallet] = useState("");
  const [redirects, setRedirects] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);

  const handleIncrease = (id) =>
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));

  const handleDecrease = (id) =>
    setCartItems(cartItems
      .map(item => item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
      )
      .filter(item => item.quantity > 0)
    );

  const handleRemove = (id) =>
    setCartItems(cartItems.filter(item => item.id !== id));

  const calculateTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  const calculateSubtotalsByCurrency = () => {
    const subtotals = {};
    cartItems.forEach(item => {
      const amount = item.price * item.quantity;
      if (!subtotals[item.currency]) {
        subtotals[item.currency] = 0;
      }
      subtotals[item.currency] += amount;
    });
    return subtotals;
  };

  const calculateAmountsPerSeller = (assetScale = 2) => {
    const walletTotals = {};
    cartItems.forEach(item => {
      const amount = item.price * item.quantity;
      const scaledAmount = Math.round(amount * Math.pow(10, assetScale));
      walletTotals[item.sellerWallet] = (walletTotals[item.sellerWallet] || 0) + scaledAmount;
    });
    return Object.fromEntries(
      Object.entries(walletTotals).map(([k, v]) => [k, v.toString()])
    );
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    let walletInput = buyerWallet;

    if (!walletInput) {
      walletInput = prompt("Ingresa tu wallet de comprador en formato $ilp.interledger-test.dev/...");
      if (!walletInput) {
        alert("No ingresaste tu wallet. Cancelando pago.");
        return;
      }
      walletInput = walletInput.replace(/^\$/, "https://");
      setBuyerWallet(walletInput);
    }

    const amountsPerSeller = calculateAmountsPerSeller(2);

    try {
      const response = await fetchWithAuth("/api/pay", {
        method: "POST",
        body: JSON.stringify({ cartItems, amountsPerSeller, buyerWallet: walletInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la petición de pago');
      }

      const data = await response.json();
      console.log("Pago iniciado:", data);

      if (data.redirects) {
        setRedirects(data.redirects);
      } else {
        alert("No se generaron redirecciones.");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert(`Ocurrió un error al procesar el pago: ${error.message}`);
    }
  };

  const finalizePayment = async (transaction) => {
    try {
      const response = await fetchWithAuth("/api/pay/finalize", {
        method: "POST",
        body: JSON.stringify({
          senderWallet: transaction.senderWallet,
          outgoingGrant: transaction.outgoingGrant,
          quote: transaction.quote,
          buyerWallet: buyerWallet
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al finalizar el pago');
      }

      const result = await response.json();
      if (result.success) {
        alert(`Pago completado para ${transaction.sellerWallet}`);
        setCartItems(prev => prev.filter(item => item.sellerWallet !== transaction.sellerWallet));
        setRedirects(prev => prev.filter(r => r.sellerWallet !== transaction.sellerWallet));
        setCompletedPayments(prev => [...prev, transaction.sellerWallet]);
      } else {
        alert(`Pago fallido para ${transaction.sellerWallet}, reembolsando...`);
      }
    } catch (err) {
      console.error("Error finalizando pago:", err);
      alert(`Error al finalizar el pago: ${err.message}`);
    }
  };

  const subtotals = calculateSubtotalsByCurrency();

  return (
    <>
            <NavigationBar logout={logout} onProfileClick={onProfileClick} />
      <div className="shopping-cart-container">
        <h1>Carrito de Compras</h1>

        {cartItems.length === 0 && redirects.length === 0 && completedPayments.length === 0 ? (
          <p>Tu carrito está vacío.</p>
        ) : (
          <div className="cart-content">
            <div className="cart-items-list">
              {cartItems.map(item => (
                <ShoppingCartItem
                  key={item.id}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>

            <div className="cart-summary">
              <h3>Resumen del Pedido</h3>
              <div className="summary-row">
                <span>Cantidad de artículos:</span>
                <span>{calculateTotalItems()}</span>
              </div>
              <hr/>
              <h4>Desglose de Totales</h4>
              {Object.entries(subtotals).map(([currency, amount]) => (
                <div className="summary-row" key={currency}>
                  <span>Subtotal ({currency}):</span>
                  <span>{formatCurrency(amount, currency)}</span>
                </div>
              ))}
              <hr />
              <p className="total-disclaimer">
                Los totales se pagarán en sus respectivas divisas.
              </p>

              {redirects.length === 0 && cartItems.length > 0 && (
                <button className="checkout-button" onClick={handleCheckout}>
                  Proceder al Pago
                </button>
              )}

              {redirects.length > 0 && (
                <div className="pending-payments">
                  <h4>Pagos pendientes</h4>
                  {redirects.map((r, idx) => (
                    <div key={idx} className="payment-action-card">
                      <p>Pago pendiente a: <br/> <code>{r.sellerWallet}</code></p>
                      <a href={r.outgoingGrant.interact.redirect} target="_blank" rel="noopener noreferrer" className="auth-link">
                        Abrir autorización
                      </a>
                      <button
                        onClick={() => finalizePayment(r)}
                        className="finalize-button"
                      >
                        Finalizar Pago
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {completedPayments.length > 0 && (
                <div className="completed-payments">
                  <h4>Pagos completados</h4>
                  <ul>
                    {completedPayments.map((s, idx) => (
                      <li key={idx}>✅ {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ShoppingCartPage;