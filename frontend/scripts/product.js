displayProduct();

function displayProduct() {
    const content = document.getElementById("product");
    let link = window.location.href;

    fetch("/api/products")
        .then(r => r.json())
        .then(products => products.forEach(product => {
            if (product.id == link.substr(link.length - 3, 3)) {
                let price = Number(product.normalPrice).toFixed(2);
                let specialPrice = Number(product.specialOffer).toFixed(2);

                let html = 
                `<div class="item">
                        <div class="elementContext">
                            <a class="ElementImg">
                                <img class="elementImg" src="/assets/images/${product.imageName}">
                            </a>
                            <div class="elementDescribtion">
                                <h1>${product.productName}</h1>
                                <p>${product.description}</p>
                                <div>
                                    <p class="elementPriceNormal">CHF ${price}</p>
                                    <p class="elementPriceSpecial">CHF ${specialPrice}</p>
                                </div>
                                <input class="elementAddToCart" type="button" onclick="addProductToCart()" value="In Warenkorb legen" />
                            </div>
                        </div>
                </div>`;
                content.innerHTML += html;
            }
        }));
}

async function addProductToCart() {
    let link = window.location.href;
    let id = link.substr(link.length - 3, 3);

    await fetch(
        "/api/shoppingcart/" + id,
        {
            body: "",
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST"
    });

    createhead();
}