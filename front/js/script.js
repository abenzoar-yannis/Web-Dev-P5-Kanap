let products = [];
const articleList = document.getElementById("items");

/* La fontion d'appel de l'API 
Elle me permet de récupérer la liste des produits disponnibles 
dans un tableau*/
async function getAllProducts() {
  await fetch("http://localhost:3000/api/products/")
    .then((res) => res.json())
    .then((data) => {
      products = data;
    })
    .catch((error) => console.log("error", error));
}

/* Fonction permetant d'afficher un article sur la page */
function displayAProduct(article) {
  articleList.innerHTML += `
  <a href="./product.html?id=${article._id}">
    <article>
      <img src="${article.imageUrl}" alt="${article.altTxt}">
      <h3 class="productName">${article.name}</h3>
      <p class="productDescription">${article.description}</p>
    </article>
  </a>
  `;
}

/* Fonction pour boucler une liste de produit, et les afficher 
lès un après les autres selon la liste don ils proviennent */
function productDisplay(list) {
  for (i = 0; i < list.length; i++) {
    let element = list[i];
    displayAProduct(element);
  }
}

/* La fonction final, permetent d'affichager la totalitée des 
produits sur la page */
async function displayAllProducts() {
  await getAllProducts();
  productDisplay(products);
}

/* l'appel de la fonction final */
displayAllProducts();
