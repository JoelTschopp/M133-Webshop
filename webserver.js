import {
    Application,
    Router,
    send
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

    .get("/api/shoppingCart/totalprice", async(context) => {
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
    });

app.use(session.use()(session));
app.use(router.routes());
app.listen({ port: 8000 });
console.log("Server running on http://localhost:8000");