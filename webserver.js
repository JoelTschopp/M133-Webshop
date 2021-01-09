import {
  Application,
  Router,
  send,
} from "https://deno.land/x/oak@v6.3.1/mod.ts";
import { Session } from "https://deno.land/x/session@1.1.0/mod.ts";

const app = new Application();
const router = new Router();

const session = new Session({ framework: "oak" });
await session.init();

router
  //HTML
  .get("/", (context) => {
    return send(context, "/frontend/html/webshop.html");
  })
  .get("/product/:id", (context) => {
    return send(context, "/frontend/html/product.html");
  })
  .get("/shoppingCart", (context) => {
    return send(context, "/frontend/html/shoppingCart.html");
  })
  .get("/formular", (context) => {
    return send(context, "frontend/html/formular.html");
  })
  .get("/payment", (context) => {
    return send(context, "frontend/html/payment.html");
  })
  //JS
  .get("/assets/scripts/:file", (context) => {
    return send(context, "/frontend/scripts/" + context.params.file);
  })
  //CSS
  .get("/assets/css/:file", (context) => {
    return send(context, "/frontend/css/" + context.params.file);
  })
  //Images
  .get("/assets/images/:file", (context) => {
    return send(context, "/frontend/images/" + context.params.file);
  })
  //API
  .get("/api/products", (context) => {
    return send(context, "frontend/products.json");
  })

  .get("/api/shoppingCart/totalprice", async (context) => {
    const productsFile = await Deno.readTextFile("frontend/products.json");
    let products = JSON.parse(productsFile);
    let cart = await context.state.session.get("shoppingCart");
    if (cart == undefined) {
      cart = [];
    }

    let totalprice = 0;
    for (let i = 0; i < cart.length; i++) {
      let item;
      products.forEach((element) => {
        if (element.id == cart[i]) {
          item = element;
        }
      });
      totalprice = totalprice + item.specialOffer;
    }

    context.response.body = totalprice;
  })
  .post("/api/shoppingCart/:id", async (context) => {
    const product = context.params.id;
    if (!product) {
      context.response.status = 404;
      return;
    }

    if ((await context.state.session.get("shoppingCart")) == undefined) {
      await context.state.session.set("shoppingCart", []);
    }
    let shoppingCart = await context.state.session.get("shoppingCart");
    await context.state.session.set("shoppingCart", [...shoppingCart, product]);
    context.response.status = 200;
  })
  .post("/api/shoppingcart", async (context) => {
    let shoppingCart = await context.request.body({ type: "json" }).value;
    await context.state.session.set("shoppingCart", shoppingCart);

    context.response.status = 200;
    context.response.body = { message: "OK" };
  })
  .get("/api/shoppingcart", async (context) => {
    if ((await context.state.session.get("shoppingCart")) == undefined) {
      await context.state.session.set("shoppingCart", []);
    }

    let shoppingCart = await context.state.session.get("shoppingCart");

    if (shoppingCart == undefined) {
      context.response.body = undefined;
    } else {
      context.response.body = shoppingCart;
    }
    context.response.status = 200;
  });

app.use(session.use()(session));
app.use(router.routes());
app.listen({ port: 8000 });
console.log("Server running on http://localhost:8000");
