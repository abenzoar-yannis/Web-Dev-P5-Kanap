let productsInCart = [];
let product;
const cart = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");

/* ----- ----- GESTION DE L AFFICHAGE DU PANIER ----- ----- */

/* Une boucle pour récupérer 
- les key de produit dans le localStorage
- Puis les données des produits
- Convertir la chaîne de caractère en objet JS
- Implémenter les produits dans le tableau "cart" */
function getCart() {
  for (let i = 0; i < localStorage.length; i++) {
    let productKey = localStorage.key(i);
    let productLinea = localStorage.getItem(productKey);
    let productJson = JSON.parse(productLinea);
    productsInCart.push(productJson);
  }
}

/* La fontion d'appel de l'API, mais pour un produit ciblé */
async function getProduct(id) {
  await fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((data) => {
      product = data;
    });
}

/* Fonction pour récupérer les information supplémentaire d'un produit
avant de l'afficher sur la page */
async function addParamToProduct() {
  for (i = 0; i < productsInCart.length; i++) {
    await getProduct(productsInCart[i]._id);
    productsInCart[i].name = product.name;
    productsInCart[i].imageUrl = product.imageUrl;
    productsInCart[i].altTxt = product.altTxt;
    productsInCart[i].price = product.price;
  }
}

/* Fonction permetant d'afficher un produit du panier sur la page */
function displayACartProduct(article) {
  cart.innerHTML += `
      <article class="cart__item" data-id="${article._id}" data-color="${article.selectColor}">
          <div class="cart__item__img">
              <img src="${article.imageUrl}" alt="${article.altTxt}">
          </div>
          <div class="cart__item__content">
              <div class="cart__item__content__description">
                  <h2>${article.name}</h2>
                  <p>${article.selectColor}</p>
                  <p>${article.price} €</p>
              </div>
              <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.amount}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                  </div>
              </div>
          </div>
      </article>
      `;
}

/* Fonction pour boucler une liste de produit, et les afficher les un après 
les autre selon la liste don ils proviennent */
function productDisplay(list) {
  for (i = 0; i < list.length; i++) {
    let element = list[i];
    displayACartProduct(element);
  }
}

/* Fonction permetant d'afficher la quantitée de produit dans le panier sur la page */
function quantityTotal() {
  let quantity = 0;
  for (i = 0; i < productsInCart.length; i++) {
    quantity += parseInt(productsInCart[i].amount);
  }
  totalQuantity.innerHTML = quantity;
}

/* Fonction permetant d'afficher le prix total des produits dans le panier sur la page */
function priceTotal() {
  let price = 0;
  for (i = 0; i < productsInCart.length; i++) {
    price += parseInt(productsInCart[i].amount * productsInCart[i].price);
  }
  totalPrice.innerHTML = price;
}

/* La fonction final permetent d'avoir notre affichage final du panier */
async function productsDisplaying(list) {
  getCart();
  await addParamToProduct();
  productDisplay(list);
  quantityTotal();
  priceTotal();
}

/* l'appel de la fonction final */
productsDisplaying(productsInCart);
