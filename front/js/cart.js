let productsInCart = [];
let product;
let articles;
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

/* Inputs du Formulaire */
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

/* Mes Regex */
const regexEmail = new RegExp("^[a-z0-9._-]+@[a-z0-9-]+\\.[a-z0-9]{2,3}$");
const regexName = new RegExp("^[\\sa-zA-Zéèêëîïòôöûüùàäâç'-]+$");
const regexAddress = new RegExp(
  "^[\\d]{1,5}\\s[a-zA-Z]+\\s[\\sa-zA-Zéèêëîïòôöûüùàäâç'-]+$"
);

function testEmail(input) {
  if (regexEmail.test(input)) {
    return true;
  } else return false;
}
function testName(input) {
  if (regexName.test(input)) {
    return true;
  } else return false;
}
function testAddress(input) {
  if (regexAddress.test(input)) {
    return true;
  } else return false;
}

function exportInput(functionTest, input) {
  let inputExport = input.value;
  if (functionTest(input.value)) {
    return inputExport;
  } else
    alert(
      inputExport + " : N'est pas pas valide. Veillez vérifier le formulaire !"
    );
}

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
// NON Terminé

function createContact() {
  objetSend.contact.firstName = exportInput(testName, inputFirstName);
  objetSend.contact.lastName = exportInput(testName, inputLastName);
  objetSend.contact.address = exportInput(testAddress, inputAddress);
  objetSend.contact.city = exportInput(testName, inputCity);
  objetSend.contact.email = exportInput(testEmail, inputEmail);
}

let objetSend = {
  contact: {
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    email: "",
  },
  products: ["415b7cacb65d43b2b5c1ff70f3393ad1"],
};

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  contact: {
    firstName: "Yannis",
    lastName: "Abenzoar",
    address: "09 rue Marius Chardon",
    city: "Pierre Benite",
    email: "abenzoar.yannis@hotmail.fr",
  },
  products: ["415b7cacb65d43b2b5c1ff70f3393ad1"],
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

const form = document.querySelector("form");

// fetch("http://localhost:3000/api/products/order", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));
function submitForm(e) {
  e.preventDefault();
  fetch("http://localhost:3000/api/products/order", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
}

form.addEventListener("submit", (e) => {
  const res = submitForm(e);
});

// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   fetch("http://localhost:3000/api/products/order", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(objet),
//   }).then((res) => {
//     console.log(res);
//     if (res.ok) {
//       return res.json();
//     }
//   });
// });

/* method pour récupérer l'URL de la page affiché */
// const page = window.location.href;
// const url = new URL(page);
// const productId = url.searchParams.get("id");

// contact: {
//     firstName: string,
//     lastName: string,
//     address: string,
//     city: string,
//     email: string
// }
// products: [string] <-- array of product _id
