const content = document.getElementById("shoppingCart");
let shoppingCart = [];
let shoppingCartAmmount = [];

loadPage();

async function loadPage() {
  document.getElementById("shoppingCart").innerHTML = "";

  let cart = false;
  let products_response = await fetch("/api/products");
  let products = await products_response.json();
  let userCartResponse = await fetch("/api/shoppingcart");
  let userCart;
  try {
    userCart = await userCartResponse.json();
    if (userCart != undefined) {
      cart = true;
    }
    if (userCart.length == 0) {
      cart = false;
    }
  } catch {}
  if (cart) {
    let table =
      '<table id="cartTable" class="table"><tbody id="cart_table_body"><tr><th>Produkt</th><th>Einzelpreis</th><th>Anzahl</th><th>Total</th></tr></tbody></table>';
    document.getElementById("shoppingCart").innerHTML += table;

    shoppingCart = [];
    shoppingCartAmmount = [];
    for (let i = 0; i < userCart.length; i++) {
      let rightElement = false;
      for (let y = 0; y < shoppingCart.length; y++) {
        if (userCart[i] == shoppingCart[y]) {
          shoppingCartAmmount[y]++;
          rightElement = true;
        }
      }
      if (!rightElement) {
        shoppingCart.push(userCart[i]);
        shoppingCartAmmount.push(1);
      }
    }

    let html = "";
    let totalPrice = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
      let item;
      products.forEach((element) => {
        if (element.id == shoppingCart[i]) {
          item = element;
        }
      });

      let title = item.productName;
      let price = item.specialOffer.toFixed(2);
      let amount = shoppingCartAmmount[i];
      let total = (price * amount).toFixed(2);
      totalPrice = totalPrice + price * amount;

      html +=
        "<tr><td>" +
        title +
        "</td><td>CHF " +
        price +
        '</td><td><button onclick="subtractItem(' +
        i +
        ')">-</button><a> ' +
        amount +
        ' </a><button onclick="addItem(' +
        i +
        ')">+</button></td><td>CHF ' +
        total +
        "</td></tr>";
    }
    html +=
      "<tr><td></td><td></td><td></td><td>CHF " +
      totalPrice.toFixed(2) +
      "</td></tr>";
    html += `<tr><td></td><td></td><td></td><td><a href="/payment"><button class="buy">Einkaufen</button></a></td></tr>`;

    document.getElementById("cart_table_body").innerHTML += html;
  } else {
    let html = `<p class="emptyCart">Sie haben bisher noch nichts dem Einkaufswagen hinzugefügt</p>`;
    content.innerHTML = html;
  }
}

async function addItem(id) {
  shoppingCartAmmount[id]++;
  let newarr = [];

  for (let i = 0; i < shoppingCart.length; i++) {
    for (let y = 0; y < shoppingCartAmmount[i]; y++) {
      newarr.push(shoppingCart[i]);
    }
  }

  await fetch("/api/shoppingcart", {
    body: JSON.stringify(newarr),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  loadPage();
  header();
}

async function subtractItem(id) {
  shoppingCartAmmount[id]--;
  let newarr = [];

  for (let i = 0; i < shoppingCart.length; i++) {
    for (let y = 0; y < shoppingCartAmmount[i]; y++) {
      newarr.push(shoppingCart[i]);
    }
  }

  await fetch("/api/shoppingcart", {
    body: JSON.stringify(newarr),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  loadPage();
  header();
}
