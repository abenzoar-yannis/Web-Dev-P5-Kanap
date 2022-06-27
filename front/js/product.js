let product;
const productName = document.getElementById("title");
const productPrice = document.getElementById("price");
const productDescription = document.getElementById("description");
const productColors = document.getElementById("colors");
const productImage = document.getElementById("image");

const addButton = document.getElementById("addToCart");
let selectColor = "";
let selectQuantity = 0;

/* ----- ----- GESTION DE L AFFICHAGE DE LA PAGE ----- ----- */

/* method pour récupérer l'URL de la page affiché */
const page = window.location.href;
const url = new URL(page);
const productId = url.searchParams.get("id");

/* La fontion d'appel de l'API, mais pour un produit ciblé */
async function getProducts() {
  await fetch(`http://localhost:3000/api/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
      product = data;
    });
}

/* Fonction permetant d'afficher un article sur la page */
function onDisplay(article) {
  productName.textContent = `${article.name}`;
  productPrice.textContent = `${article.price}`;
  productDescription.textContent = `${article.description}`;
  productImage.src = `${article.imageUrl}`;
  productImage.alt = `${article.altTxt}`;
  article.colors.map(
    (color) =>
      (productColors.innerHTML += `<option value="${color}">${color}</option>`)
  );
}

/* La fonction final permetent d'avoir notre affichage final de la page */
async function productDisplay() {
  await getProducts();
  onDisplay(product);
}

/* l'appel de la fonction final d'affichage */
productDisplay();
