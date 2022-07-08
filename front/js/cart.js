let productsInCart = [];
let product;
let articles;
const cart = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");

/* Inputs du Formulaire */
const form = document.querySelector("form");

const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputEmail = document.getElementById("email");

const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

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
    })
    .catch((error) => console.log("error", error));
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
                      <input type="number" onchange="updateEvent(this.value, '${article._id}', '${article.selectColor}')" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.amount}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                      <p onclick="deleteEvent('${article._id}', '${article.selectColor}')" class="deleteItem">Supprimer</p>
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

/* ----- ----- GESTION DES MODIFICATION APPORTE AU PANIER ----- ----- */

/* Fonction permetant de rafraichir l'affichage du nombre de produit et du prix 
total du panier */
async function refreshProductInCart() {
  productsInCart = [];
  getCart();
  await addParamToProduct();
  quantityTotal();
  priceTotal();
}

/* Fonction permetant de supprimer un produit du panier et de l'affichage de la page */
function deleteAProduct(element, name, color) {
  localStorage.removeItem(`${name} ${color}`);
  element.remove();
}

/* Fonction permetant de modifier la quantité d'un produit dans le panier */
function updateCart(name, color, quantity) {
  let newSetLinea = localStorage.getItem(name + " " + color);
  let newSetJson = JSON.parse(newSetLinea);
  newSetJson.amount = quantity;
  newSetLinea = JSON.stringify(newSetJson);
  localStorage.setItem(`${name} ${color}`, newSetLinea);
}

/* ----- ----- MES EVENTLISTENERS ----- ----- */

/* EVENT pour mettre à jour un changement de quantité pour un produit */
function updateEvent(value, id, color) {
  productsInCart.find(
    (article) => article._id == id && article.selectColor == color
  ).amount = value;
  let productUpdate = productsInCart.find(
    (article) => article._id == id && article.selectColor == color
  );
  updateCart(
    productUpdate.name,
    productUpdate.selectColor,
    productUpdate.amount
  );
  refreshProductInCart();
}

/* EVENT permettent de supprimer un article du panier et de l'affichage de la page */
function deleteEvent(id, color) {
  let deletedProduct;

  deletedProduct = productsInCart.find(
    (element) => element._id == `${id}` && element.selectColor == color
  );

  articles.forEach((article) => {
    if (
      article.dataset.id + " " + article.dataset.color ==
      deletedProduct._id + " " + deletedProduct.selectColor
    )
      deleteAProduct(article, deletedProduct.name, deletedProduct.selectColor);
  });
  refreshProductInCart();
}

/* ----- ----- FONCTION DE FINALISATION D'AFFICHAGE DU PANIER ----- ----- */

/* La fonction final permetent d'avoir notre affichage final du panier */
async function productsDisplaying(list) {
  getCart();
  await addParamToProduct();
  productDisplay(list);
  quantityTotal();
  priceTotal();
  articles = document.querySelectorAll("article");
}

/* l'appel de la fonction final */
productsDisplaying(productsInCart);

// window.addEventListener("click", (e) => console.log(e.target.value));
// window.addEventListener("change", (e) => console.log(e.target.value));

/* ----- ----- VERIFICATION DES DONNEES DU FORMULAIRE ----- ----- */

/* Mes Regex */
const regexEmail = new RegExp("^[a-z0-9._-]+@[a-z0-9-]+\\.[a-z0-9]{2,3}$");
const regexNames = new RegExp("^[\\sa-zA-Zéèêëîïòôöûüùàäâç'-]+$");
const regexAddress = new RegExp(
  "^[\\d]{1,5}\\s[a-zA-Z]+\\s[\\sa-zA-Zéèêëîïòôöûüùàäâç'-]+$"
);

/* fonction de test des chaîne de caractère avec des regex */
function testEmail(input) {
  if (regexEmail.test(input)) {
    return true;
  } else return false;
}
function testName(input) {
  if (regexNames.test(input)) {
    return true;
  } else return false;
}
function testAddress(input) {
  if (regexAddress.test(input)) {
    return true;
  } else return false;
}

/*
Refaire les event en y créant une function principale, pour quelle 
soit réutilisé lors de l'envois du formulaire. Avoir une option qui 
diférencie une mauvais valeur et une valeur vide.
*/

// function testInput(functionTest, input) {
//   let inputExport = input.value;
//   if (functionTest(input.value)) {
//     return inputExport;
//   } else
//     alert(
//       inputExport + " : N'est pas pas valide. Veillez vérifier le formulaire !"
//     );
// }

// function createContact() {
//   testInput(testName, inputFirstName);
//   testInput(testName, inputLastName);
//   testInput(testAddress, inputAddress);
//   testInput(testName, inputCity);
//   testInput(testEmail, inputEmail);
// }

/* EVENTS -- test des valeur entré dans les emplacement de furmulaire */
inputFirstName.addEventListener("change", (e) => {
  let inputText = e.target.value;
  if (testName(inputText)) firstNameErrorMsg.innerHTML = "";
  else firstNameErrorMsg.innerHTML = "Prénom, non valid !";
});

inputLastName.addEventListener("change", (e) => {
  let inputText = e.target.value;
  if (testName(inputText)) lastNameErrorMsg.innerHTML = "";
  else lastNameErrorMsg.innerHTML = "Nom, non valid !";
});

inputAddress.addEventListener("change", (e) => {
  let inputText = e.target.value;
  if (testAddress(inputText)) addressErrorMsg.innerHTML = "";
  else
    addressErrorMsg.innerHTML =
      "adresse, non valid ! Respecter l'exemple : 'numéro' 'voie' 'nom de la voie'";
});

inputCity.addEventListener("change", (e) => {
  let inputText = e.target.value;
  if (testName(inputText)) cityErrorMsg.innerHTML = "";
  else cityErrorMsg.innerHTML = "Ville, non valid !";
});

inputEmail.addEventListener("change", (e) => {
  let inputText = e.target.value;
  if (testEmail(inputText)) {
    emailErrorMsg.innerHTML = "";
  } else
    emailErrorMsg.innerHTML =
      "email non valid ! Respecter l'exemple suivant : votremail@mail.com";
});

/* ----- ----- ENVOI DU FORMULAIRE ----- ----- */

/* La function d'envoi du formulaire et list de produit */
function submitForm(e) {
  e.preventDefault();

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let productsCommande = [];

  for (i = 0; i < productsInCart.length; i++) {
    productsCommande.push(productsInCart[i]._id);
  }

  let rawOrder = JSON.stringify({
    contact: {
      firstName: inputFirstName.value,
      lastName: inputLastName.value,
      address: inputAddress.value,
      city: inputCity.value,
      email: inputEmail.value,
    },
    products: productsCommande,
  });

  let requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: rawOrder,
    redirect: "follow",
  };

  fetch("http://localhost:3000/api/products/order", requestOptions)
    .then((response) => response.text())
    .then((result) => {
      let order = JSON.parse(result);
      return order;
    })
    .catch((error) => console.log("error", error))
    .then((value) => {
      let orderId = value.orderId;
      const url = new URL(window.location.href);
      let route = "/front/html/confirmation.html";
      let confirm = `${url.origin}${route}?orderid=${orderId}`;
      window.location.href = confirm;
    });
}

/* EVENT -- déclenchement de la soumission du formulaire */
form.addEventListener("submit", (e) => {
  submitForm(e);
});
