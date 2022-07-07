const displayOrderId = document.getElementById("orderId");

/* method pour récupérer l'URL de la page affiché */
// const page = window.location.href;
// const url = new URL(page);
// const productId = url.searchParams.get("id");
const page = window.location.href;
const url = new URL(page);
const productId = url.searchParams.get("orderid");

displayOrderId.innerHTML = productId;

localStorage.clear();
