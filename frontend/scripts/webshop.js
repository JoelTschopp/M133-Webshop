const getProducts = document.getElementById("products");

fetch("/api/products")
  .then((r) => r.json())
  .then((products) =>
    products.forEach((product) => {
      let price = Number(product.normalPrice).toFixed(2);
      let specialPrice = Number(product.specialOffer).toFixed(2);

      getProducts.innerHTML += `
        <div class="element">
            <a class="elementLink" href="/product/${product.id}">
                <img class="elementImg" src="/assets/images/${product.imageName}"}>
                <p class="elementTitle">${product.productName}</p>
                <div class="elementPrice">
                    <p class="elementPriceNormal">CHF ${price}</p>
                    <p class="elementPriceSpecial">CHF ${specialPrice}</p>
                </div>
            </a>
        </div>
        `;
    })
  );
