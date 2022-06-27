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

/* ----- ----- GESTION DU PANIER DE LA PAGE ----- ----- */

/* Fonction pour récupérer la couleur choisi */
function whatColor() {
  selectColor = document.getElementById("colors").value;
}
/* Fonction pour récupérer la quantité choisi */
function howMany() {
  selectQuantity = document.getElementById("quantity").value;
  selectQuantity = parseInt(selectQuantity);
}
/* Fonction pour vérifier si un produit est déjà présent dans le panier */
function checkCart() {
  for (i = 0; i < localStorage.length; i++) {
    if (product.name + " " + selectColor == localStorage.key(i)) {
      return true;
    }
  }
}
/* Fonction basique pour ajouter un produit (attention - aucune condition d'ajout) */
function addProduct(e) {
  selectQuantity = selectQuantity + e;
  let kanapJson = {
    _id: product._id,
    selectColor: selectColor,
    amount: selectQuantity,
  };
  let kanapLinea = JSON.stringify(kanapJson);
  localStorage.setItem(`${product.name} ${selectColor}`, kanapLinea);
  alert(`${selectQuantity} ${product.name} ${selectColor} dans votre panier !`);
}

/* ----- EVENT ----- */
/* Event pour ajouer un produit dans le panier */
addButton.addEventListener("click", () => {
  whatColor();
  howMany();
  if (selectColor === "") {
    return alert("Vous n'avez pas sélectioné la couleur de votre produit !");
  } else if (selectQuantity == 0) {
    return alert("Vous n'avez pas sélectioné le nombre de produit désiré !");
  } else if (checkCart() == true) {
    let inCart = JSON.parse(
      localStorage[`${product.name} ${selectColor}`]
    ).amount;
    addProduct(inCart);
  } else {
    addProduct(0);
  }
});
