import React, { useState } from 'react';
import ShoppingCartItem from '../../components/ShoppingCartItem/ShoppingCartItem';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import fetchWithAuth from '../../api'; // 👈 usamos el wrapper
import './ShoppingCartPage.css';

const initialCartItems = [
  //{ id: 1, name: 'Tomates Frescos', price: 200.50, quantity: 2, sellerWallet: "https://ilp.interledger-test.dev/vsdsd", image: 'https://imag.bonviveur.com/racimos-de-tomates-frescos-vendidos-como-verdura.webp' },
  { id: 2, name: 'Lechuga Romana', price: 100.20, quantity: 1, sellerWallet: "https://ilp.interledger-test.dev/1212", image: 'https://www.totenu.com/wp-content/uploads/lechuga-romana-TotEnU-1080x675.jpg' },
  { id: 3, name: 'Tractor', price: 100000.00, quantity: 3, sellerWallet: "https://ilp.interledger-test.dev/2895de5", image: 'https://www.tractorpool.com.mx/media/4554/8384554/59118154/1757328616.jpg?width=240&height=180&crop=1' },
];

const ShoppingCartPage = () => {
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

  const calculateSubtotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

  const calculateTotalItems = () =>
    cartItems.reduce((sum, item) => sum + item.quantity, 0);

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

  return (
    <>
      <NavigationBar />
      <div className="shopping-cart-container">
        <h1>Carrito de Compras</h1>

        {cartItems.length === 0 && redirects.length === 0 ? (
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
                />
              ))}
            </div>

            <div className="cart-summary">
              <h3>Resumen del Pedido</h3>
              <div className="summary-row">
                <span>Cantidad de artículos:</span>
                <span>{calculateTotalItems()}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${calculateSubtotal()}</span>
              </div>
              <div className="summary-row">
                <span>Envío:</span>
                <span>$5.00</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total:</span>
                <span>${(parseFloat(calculateSubtotal()) + 5.00).toFixed(2)}</span>
              </div>

              {redirects.length === 0 && (
                <button className="checkout-button" onClick={handleCheckout}>
                  Proceder al Pago
                </button>
              )}

              {/* Pagos pendientes */}
              {redirects.length > 0 && (
                <div className="mt-4">
                  <h4>Pagos pendientes</h4>
                  {redirects.map((r, idx) => (
                    <div key={idx} className="p-2 border rounded mb-2">
                      <p>Pago pendiente a {r.sellerWallet}</p>
                      <a href={r.outgoingGrant.interact.redirect} target="_blank" rel="noopener noreferrer">
                        Abrir autorización
                      </a>
                      <button
                        onClick={() => finalizePayment(r)}
                        className="ml-2 bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Finalizar Pago
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagos completados */}
              {completedPayments.length > 0 && (
                <div className="mt-4">
                  <h4>Pagos completados</h4>
                  <ul>
                    {completedPayments.map((s, idx) => (
                      <li key={idx}>{s}</li>
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
