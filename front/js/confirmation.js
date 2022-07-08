const displayOrderId = document.getElementById("orderId");

/* method pour récupérer orderId dans l'URL de la page affiché */
const page = window.location.href;
const url = new URL(page);
const productId = url.searchParams.get("orderid");

/* Afficher l'orderId sur la page */
displayOrderId.innerHTML = productId;

/* supprimer le panier du localstorage */
localStorage.clear();
