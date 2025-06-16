const rupiah = (number)=>{
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  };
function sendToWhatsApp() { 
  const message = document.getElementById('message').value;
  const whatsappLink = `https://api.whatsapp.com/send?phone=6285718787490&text=${encodeURIComponent(message)}`;

  window.open(whatsappLink, '_blank');
}
 var cart = {
  // (A) PROPERTIES
  hPdt : null,      // html products list
  hItems : null,    // html current cart
  hform : null,    // html current cart
  items : {},       // current items in cart
  iURL : "asset/image/", // product image url folder
  currency : "",   // currency symbol
  total : 0,        // total amount

  // (B) LOCALSTORAGE CART
  // (B1) SAVE CURRENT CART INTO LOCALSTORAGE
  save : () => localStorage.setItem("cart", JSON.stringify(cart.items)),

  // (B2) LOAD CART FROM LOCALSTORAGE
  load : () => {
    cart.items = localStorage.getItem("cart");
    if (cart.items == null) { cart.items = {}; }
    else { cart.items = JSON.parse(cart.items); }
  },

  // (B3) EMPTY ENTIRE CART
  nuke : () => { if (confirm("Keranjang masih kosong")) {
    cart.items = {};
    localStorage.removeItem("cart");
    cart.list();
  }},


  // (C) INITIALIZE
  init : () => {
    // (C1) GET HTML ELEMENTS
    cart.hPdt = document.getElementById("cart-products");
    cart.hItems = document.getElementById("cart-items");

    // (C2) DRAW PRODUCTS LIST
    cart.hPdt.innerHTML = "";
    let template = document.getElementById("template-product").content, p, item;
    for (let id in products) {
      p = products[id];
      item = template.cloneNode(true);
      item.querySelector(".p-img").src = cart.iURL + p.img;
      item.querySelector(".p-name").textContent = p.name;
      item.querySelector(".p-price").textContent = rupiah(p.price);
      item.querySelector(".p-add").onclick = () => cart.add(id);
      cart.hPdt.appendChild(item);
    }

    // (C3) LOAD CART FROM PREVIOUS SESSION
    cart.load();

    // (C4) LIST CURRENT CART ITEMS
    cart.list();
  },


  filter: (e) => {
   
 

  // (C1) GET HTML ELEMENTS
    cart.hPdt = document.getElementById("cart-products");
    cart.hItems = document.getElementById("cart-items");

    // (C2) DRAW PRODUCTS LIST
    cart.hPdt.innerHTML = "";
    let template = document.getElementById("template-product").content, p, item;
    for (let id in products) {
          //n = products[name];
        if (products[id].category === e) {
   
      item = template.cloneNode(true);
      item.querySelector(".p-img").src = cart.iURL + products[id].img;
      item.querySelector(".p-name").textContent = products[id].name;
      item.querySelector(".p-price").textContent = rupiah(products[id].price);
      item.querySelector(".p-add").onclick = () => cart.add(id);
      cart.hPdt.appendChild(item);

        }
    }

    // (C3) LOAD CART FROM PREVIOUS SESSION
    cart.load();

    // (C4) LIST CURRENT CART ITEMS
    cart.list();
  },
  // (D) LIST CURRENT CART ITEMS (IN HTML)
  list : () => {
    // (D1) RESET
    cart.total = 0;
    cart.hItems.innerHTML = "";
    let item, empty = true;
    for (let key in cart.items) {
      if (cart.items.hasOwnProperty(key)) { empty = false; break; }
    }

    // (D2) CART IS EMPTY
    if (empty) {
      item = document.createElement("div");
      item.innerHTML = "Keranjang masih kosong";
      cart.hItems.appendChild(item);
            form = document.getElementById("form");
form.innerHTML=''
    }

    // (D3) CART IS NOT EMPTY - LIST ITEMS
    else {
      let template = document.getElementById("template-cart").content, p, item;
 
 
      for (let id in cart.items) {
        //console.log(products)
        item = template.cloneNode(true);
        item.querySelector(".c-del").onclick = () => cart.remove(id);
        item.querySelector(".c-name").textContent = products[id].name;
        item.querySelector(".c-qty").value = cart.items[id];
        item.querySelector(".c-qty").onchange = function () { cart.change(id, this.value); };
        cart.hItems.appendChild(item);
        cart.total += cart.items[id] * products[id].price;
 
      }

      // (D3-3) TOTAL AMOUNT
      item = document.createElement("div");
      item.className = "c-total";
      item.id = "c-total";
      item.innerHTML = `TOTAL: ${rupiah(cart.total)}`;
      cart.hItems.appendChild(item);
 
      // (D3-4) EMPTY & CHECKOUT
      item = document.getElementById("template-cart-checkout").content.cloneNode(true);
      form = document.getElementById("form");
      form.innerHTML='<form id="whatsapp-form"><label for="phone">Phone Number:</label><input type="tel" id="phone" name="phone" required><br><br><label for="message">Message:</label><textarea id="message" name="message" rows="4" cols="50"></textarea><br><br><button type="button" onclick="sendToWhatsApp()">Send</button></form>';
      cart.hItems.appendChild(item);
    }
  },

  // (E) ADD ITEM INTO CART
  add : id => {
    if (cart.items[id] == undefined) { cart.items[id] = 1; }
    else { cart.items[id]++; }
    cart.save(); cart.list();
  },

  // (F) CHANGE QUANTITY
  change : (pid, qty) => {
    // (F1) REMOVE ITEM
    if (qty <= 0) {
      delete cart.items[pid];
      cart.save(); cart.list();
    }

    // (F2) UPDATE TOTAL ONLY
    else {
      cart.items[pid] = qty;
      cart.total = 0;
      for (let id in cart.items) {
        cart.total += cart.items[id] * products[id].price;
        document.getElementById("c-total").innerHTML = `TOTAL: ${rupiah(cart.total)}`;
      }
    }
  },

  // (G) REMOVE ITEM FROM CART
  remove : id => {
    delete cart.items[id];
    cart.save();
    cart.list();
  },

  // (H) CHECKOUT
  checkout : () => {
    // SEND DATA TO SERVER
    // CHECKS
    // SEND AN EMAIL
    // RECORD TO DATABASE
    // PAYMENT
    // WHATEVER IS REQUIRED
    alert("TO DO");

    /*
    var data = new FormData();
    data.append("cart", JSON.stringify(cart.items));
    data.append("products", JSON.stringify(products));
    data.append("total", cart.total);

    fetch("SERVER-SCRIPT", { method:"POST", body:data })
    .then(res=>res.text())
    .then(res => console.log(res))
    .catch(err => console.error(err));
    */
  }
};
window.addEventListener("DOMContentLoaded", cart.init);

