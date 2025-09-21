import React, { useState } from 'react';
import ShoppingCartItem from '../../components/ShoppingCartItem/ShoppingCartItem';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import './ShoppingCartPage.css';

const initialCartItems = [
  { id: 1, name: 'Tomates Frescos', price: 200.50, quantity: 2, sellerWallet: "https://ilp.interledger-test.dev/vsdsd", image: 'https://via.placeholder.com/150' },
  { id: 2, name: 'Lechuga Romana', price: 10000.20, quantity: 1, sellerWallet: "https://ilp.interledger-test.dev/csdds", image: 'https://via.placeholder.com/150' },
  { id: 3, name: 'Zanahorias Orgánicas', price: 342355.00, quantity: 3, sellerWallet: "https://ilp.interledger-test.dev/sdcdscsd", image: 'https://via.placeholder.com/150' },
];

const ShoppingCartPage = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [buyerWallet, setBuyerWallet] = useState("");
  const [redirects, setRedirects] = useState([]); // transacciones pendientes
  const [completedPayments, setCompletedPayments] = useState([]); // pagos completados

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

  // Checkout: genera redirecciones y guarda en el estado
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
      const response = await fetch("http://localhost:8673/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems, amountsPerSeller, buyerWallet: walletInput }),
      });

      const data = await response.json();
      console.log("Pago iniciado:", data);

      if (data.redirects) {
        setRedirects(data.redirects); // guarda todo el objeto de cada transacción
      } else {
        alert("No se generaron redirecciones.");
      }
    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Ocurrió un error al procesar el pago.");
    }
  };

  // Finalizar pago: solo envía redirect + nonce
  const finalizePayment = async (transaction) => {
    try {
      const response = await fetch("http://localhost:8673/api/pay/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  senderWallet: transaction.senderWallet,   // ahora trae solo lo necesario
  outgoingGrant: transaction.outgoingGrant,
  quote: transaction.quote,
  buyerWallet: buyerWallet
}),


      });

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
      alert("Error al finalizar el pago, revisa la consola.");
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
