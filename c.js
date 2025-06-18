const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
};
var hargasemua = [];
var myArray = [];
var cart = {
    // (A) PROPERTIES
    hPdt: null,      // html products list
    hItems: null,    // html current cart
    hform: null,
    ps: null,   // html current cart
    items: {},       // current items in cart
    iURL: "asset/image/", // product image url folder
    currency: "",   // currency symbol
    total: 0,
    // (B) LOCALSTORAGE CART
    // (B1) SAVE CURRENT CART INTO LOCALSTORAGE
    save: () => localStorage.setItem("cart", JSON.stringify(cart.items)),
    // (B2) LOAD CART FROM LOCALSTORAGE
    load: () => {
        cart.items = localStorage.getItem("cart");
        if (cart.items == null) { cart.items = {}; }
        else { cart.items = JSON.parse(cart.items); }
    },
    // (B3) EMPTY ENTIRE CART
    nuke: () => {
        if (confirm("Apa anda yakin akan menghapus semua keranjang belanja anda")) {
            cart.items = {};
            localStorage.removeItem("cart");
            cart.list();
        }
    },
    // (C) INITIALIZE
    init: () => {
        // (C1) GET HTML ELEMENTS
        /*
fetch('https://cdn.jsdelivr.net/gh/micakucing/clopzkitchen/products.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(products => {
    console.log(products); // The parsed JSON data
    // You can now work with the 'data' object
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
  });
*/
  cart.hPdt = document.getElementById("cart-products");
        cart.hItems = document.getElementById("cart-items");
        cart.ps = document.getElementById("detail-ps");
        document.getElementById("title-produk").innerHTML = "Semua Produk";
        // (C2) DRAW PRODUCTS LIST
        cart.hPdt.innerHTML = "";
        cart.ps.innerHTML = "";
        let template = document.getElementById("template-product").content, p, item;
        for (let id in products) {
            p = products[id];
            st = p.stok;
            if (st === 'r') {
                item = template.cloneNode(true);
                item.querySelector(".p-img").src = cart.iURL + p.img;
                item.querySelector(".p-name").textContent = p.name;
                item.querySelector(".p-price").textContent = rupiah(p.price);
                item.querySelector(".p-add").onclick = () => cart.add(id);
                item.querySelector(".p-detail").onclick = () => cart.detail(id);

                cart.hPdt.appendChild(item);
            } else {
                item = template.cloneNode(true);
                item.querySelector(".p-img").src = cart.iURL + p.img;
                item.querySelector(".p-name").textContent = p.name;
                item.querySelector(".p-price").textContent = rupiah(p.price);
                item.querySelector(".p-add").textContent = 'stok habis';
                item.querySelector(".p-add").onclick = () => alert('maaf sudah stok habis');
                cart.hPdt.appendChild(item);
            }
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
        attributeValue = event.target.getAttribute('data-product');
        document.getElementById("title-produk").innerHTML = attributeValue;
        // (C2) DRAW PRODUCTS LIST
        cart.hPdt.innerHTML = "";
        let template = document.getElementById("template-product").content, p, item;
        x = 1;
        for (let id in products) {
            //n = products[name];
            if (products[id].category === e) {
                item = template.cloneNode(true);
                item.querySelector(".p-img").src = cart.iURL + products[id].img;
                item.querySelector(".p-name").textContent = products[id].name;
                item.querySelector(".p-price").textContent = rupiah(products[id].price);
                item.querySelector(".p-add").onclick = () => cart.add(id);
                item.querySelector(".p-detail").onclick = () => cart.detail(id);

                cart.hPdt.appendChild(item);
                document.getElementById("title-produk").innerHTML = attributeValue + ' <span style="display:block; font-size: 18px; margin: 10px 5px;">' + x + ' total produk</span>';
                x++;
            } else if (e === '*') {
                item = template.cloneNode(true);
                item.querySelector(".p-img").src = cart.iURL + products[id].img;
                item.querySelector(".p-name").textContent = products[id].name;
                item.querySelector(".p-price").textContent = rupiah(products[id].price);
                item.querySelector(".p-add").onclick = () => cart.add(id);
                cart.hPdt.appendChild(item);
                console.log(x);
                x++;
            }

        }
        // (C3) LOAD CART FROM PREVIOUS SESSION
        cart.load();
        // (C4) LIST CURRENT CART ITEMS
        cart.list();



    },
    // (D) LIST CURRENT CART ITEMS (IN HTML)
    list: () => {
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
            myArray = []
        }
        // (D3) CART IS NOT EMPTY - LIST ITEMS
        else {
            let template = document.getElementById("template-cart").content, p, item;
            for (let id in cart.items) {
                //console.log(products)
                cart.total += cart.items[id] * products[id].price;
                harga = cart.items[id] * products[id].price;
                console.log(cart.items[id])
                item = template.cloneNode(true);
                item.querySelector(".c-del").onclick = () => cart.remove(id);
                item.querySelector(".namaproduk").textContent = products[id].name;
                item.querySelector(".c-price").textContent = ' (' + rupiah(products[id].price) + ')';
                item.querySelector(".c-qty").value = cart.items[id];
                item.querySelector(".c-qty").onchange = function () {
                    cart.change(id, this.value);
                };
                cart.hItems.appendChild(item);
                object = { name: products[id].name, quantitas: cart.items[id] };
            }
            //console.log(object)
            // (D3-3) TOTAL AMOUNT
            item = document.createElement("div");
            item.className = "c-total";
            item.id = "c-total";
            item.innerHTML = `TOTAL: ${rupiah(cart.total)}`;
            cart.hItems.appendChild(item);
            let pricetot = document.getElementById("c-total").innerHTML;
            //hargasemua.push(pricetot)
            hargasemua = [rupiah(cart.total)]
            // (D3-4) EMPTY & CHECKOUT
            item = document.getElementById("template-cart-checkout").content.cloneNode(true);
            cart.hItems.appendChild(item);
            //element = document.getElementById("message");
            // element.innerHTML = myArray[0].name + '\nTOTAL:' + hargasemua;
        }
    },
    // (E) ADD ITEM INTO CART
    add: id => {
        if (cart.items[id] == undefined) { cart.items[id] = 1; }
        else {
            cart.items[id]++;
        }
        console.log(cart.items[id])
        cart.save(); cart.list();
    },
    // (F) CHANGE QUANTITY
    change: (pid, qty) => {
        // (F1) REMOVE ITEM
        if (qty <= 0) {
            myArray = [];
            delete cart.items[pid];
            cart.save(); cart.list();
            //console.log(myArray)\\
        } else {
            cart.items[pid] = qty;
            cart.total = 0;
            for (let id in cart.items) {
                cart.total += cart.items[id] * products[id].price;
                document.getElementById("c-total").innerHTML = `TOTAL: ${rupiah(cart.total)}`;
                hargasemua = [rupiah(cart.total)]
                object = { name: products[id].name, quantitas: cart.items[id] };
            }
        }
    },
    // (G) REMOVE ITEM FROM CART
    remove: id => {
        delete cart.items[id];
        cart.save();
        cart.list();
    },
    detail: ds => {
        let template = document.getElementById("template-detail").content, p, item;
        cart.ps = document.getElementById("detail-ps");
        // (C2) DRAW PRODUCTS LIST
        cart.hPdt.innerHTML = "";
        itemx = template.cloneNode(true);
        itemx.querySelector(".d-img").src = cart.iURL + products[ds].img;
        p = products[ds]; 
        document.getElementById("title-produk").innerHTML = p.name;
               //itemx.querySelector(".p-back").onclick = () => cart.list;
        itemx.querySelector(".des-produk").innerHTML = '<h4 class="mt-4 mb-4">'+ p.des+'</h4>';
        cart.ps.appendChild(itemx);
    },
    // (H) CHECKOUT
    checkout: () => {
        // SEND DATA TO SERVER
        // CHECKS
        // SEND AN EMAIL
        // RECORD TO DATABASE
        // PAYMENT
        // WHATEVER IS REQUIRED
        //console.log(myArray)
        //console.log(cart.total)


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

        var namepro = [];
        var jumlah = [];
        var semuatotal;
        i = 1;
        for (let id in cart.items) {
            perharga = cart.items[id] * products[id].price;
            semuatotal += cart.items[id] * products[id].price;
            namepro.push(i + '. ' + products[id].name + ' - ( ' + cart.items[id] + ' * ' + products[id].price + ' = ' + perharga + ')')
            i++;
        }
        totalfinal = encodeURIComponent('\n\nTOTAL BAYAR: ' + rupiah(cart.total) + '\n terima kasih sudah belanja di clopz kitchen')
        content = namepro;
        alert("terima kasih sudah belanja cemilan di clopz kitchen \n \n sebentar lagi anda akan di hubungkan ke admin clopz kitchen");
        // const message = document.getElementById('message').value;
        const whatsappLink = `https://api.whatsapp.com/send?phone=6285718787490&text=${encodeURIComponent(content.join('\n'))} ${totalfinal}`;
        namepro = [];
        myArray = [];
        cart.items = {};
        localStorage.removeItem("cart");
        cart.total = 0;
        cart.hItems.innerHTML = "";
        window.open(whatsappLink, '_blank');
        window.location.reload();
    }
};
window.addEventListener("DOMContentLoaded", cart.init);