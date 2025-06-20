const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR"
    }).format(number);
};
var hargasemua = [];
var myArray = [];
var datL = [];

var cart = {
    // (A) PROPERTIES
    hPdt: null,      // html products list
    hItems: null,    // html current cart
    hform: null,
    ps: null,   // html current cart
    items: {},
    // current items in cart
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
        cart.hPdt = document.getElementById("cart-products");
        cart.hItems = document.getElementById("cart-items");
        cart.ps = document.getElementById("detail-ps");

        // (C2) DRAW PRODUCTS LIST
        //cart.hPdt.innerHTML = "";
        cart.ps.innerHTML = "";

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        let idproduct = urlParams.get('detail');
        let cartno = urlParams.get('d');

        var link = document.createElement('meta');
        link.setAttribute('property', 'og:url');
        link.content = 'https://clopzkitchen.web.id/produk.html?detail=' + idproduct;
        document.getElementsByTagName('head')[0].appendChild(link);

        document.getElementById("title-produk").innerHTML = "<span class='text-left d-block'>Sedang Memuat Harap Tunggu</span>"; 
        fetch('https://cdn.jsdelivr.net/gh/micakucing/clopzkitchen@main/datainit.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(products => {
                let template = document.getElementById("template-detail").content;
                datL.push(products);
                if (idproduct) {
                    datx = alasql("SELECT * FROM ? WHERE id =" + idproduct, [datL[0]]);
                    if (datx != '') {
                        for (let i = 0; i < datx.length; i++) {
                            //let template = document.getElementById("template-detail").content, p, item;
                            st = datx[0]['stok'];
                            document.getElementById("title-produk").innerHTML = datx[0]['name'];
                            cart.ps = document.getElementById("detail-ps");
                            // (C2) DRAW PRODUCTS LIST
                            //cart.hPdt.innerHTML = "";
                            itemx = template.cloneNode(true);
                            itemx.querySelector(".d-img").src = cart.iURL + datx[0]['img'];
 
                            if(cartno > datx.length) {
                               itemx.querySelector(".p-add").style.display="none";
                            }else{}
                            if(cartno === null){ 
                                 itemx.querySelector(".p-add").style.display="none";
                            }else{
                                
                            itemx.querySelector(".p-add").onclick = () => cart.add(cartno);
                            }
                            // p = datL[0][idproduct];
                            document.getElementById("title-produk").innerHTML = datx[0]['name'];
                            //itemx.querySelector(".p-back").onclick = () => cart.list;
                            itemx.querySelector(".des-produk").innerHTML = '<h4 class="mt-4 mb-4">' + datx[0]['des'] + '</h4>';
                            cart.ps.appendChild(itemx);
                            break;
                        }

                    } else {
                        document.getElementById("title-produk").innerHTML = '<span class="text-center d-block">Mohon Maaf, Produk Yang Anda Tuju Tidak Di Temukan</span>';

                    }

                } else {
                    document.getElementById("title-produk").innerHTML = '<span class="text-center d-block">Mohon Maaf, Apa Anda Tersessat Di Halaman Ini</span>';
                }
                // (C3) LOAD CART FROM PREVIOUS SESSION
                cart.load();
                // (C4) LIST CURRENT CART ITEMS
                cart.list();
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
            });
    },
    home: (e) => {
        window.history.pushState({ page: "another" }, "another page", "index.html");
        cart.init();
        window.location.reload();

    },

    filter: (e) => {
        window.history.pushState({ page: "another" }, "another page", "index.html");

        cart.ps.innerHTML = "";
        attributeValue = event.target.getAttribute('data-product');
        document.getElementById("title-produk").innerHTML = attributeValue;
        cart.hPdt = document.getElementById("cart-products");
        cart.hItems = document.getElementById("cart-items");
        cart.hPdt.innerHTML = "";
        let template = document.getElementById("template-product").content,
            p, item;
        x = 1;
        for (let id in datL[0]) {
            if (datL[0][id].category === e) {
                item = template.cloneNode(!0);
                item.querySelector(".p-img").src = cart.iURL + datL[0][id].img;
                item.querySelector(".p-name").textContent = datL[0][id].name;
                item.querySelector(".p-price").textContent = rupiah(datL[0][id].price);
                item.querySelector(".p-add").onclick = () => cart.add(id);
                cart.hPdt.appendChild(item);
                document.getElementById("title-produk").innerHTML = attributeValue + ' <span style="display:block; font-size: 18px; margin: 10px 5px;">' + x + ' total produk</span>';
                x++
            } else if (e === '*') {
                item = template.cloneNode(!0);
                item.querySelector(".p-img").src = cart.iURL + datL[0][id].img;
                item.querySelector(".p-name").textContent = datL[0][id].name;
                item.querySelector(".p-price").textContent = rupiah(datL[0][id].price);
                item.querySelector(".p-add").onclick = () => cart.add(id);
                cart.hPdt.appendChild(item);
                console.log(x);
                x++
            }
        }
        cart.load();
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
                cart.total += cart.items[id] * datL[0][id].price;
                harga = cart.items[id] * datL[0][id].price;
                //console.log(cart.items[id])
                item = template.cloneNode(true);
                item.querySelector(".c-del").onclick = () => cart.remove(id);
                item.querySelector(".namaproduk").textContent = datL[0][id].name;
                item.querySelector(".c-price").textContent = ' (' + rupiah(datL[0][id].price) + ')';
                item.querySelector(".c-qty").value = cart.items[id];
                item.querySelector(".c-qty").onchange = function () {
                    cart.change(id, this.value);
                };
                cart.hItems.appendChild(item);
                object = { name: datL[0][id].name, quantitas: cart.items[id] };
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
    add: (id) => {
       
        if (cart.items[id] == undefined) { cart.items[id] = 1; }
        else {
            cart.items[id]++;
        } 
        cart.save(); 
        cart.list();
    },
    // (F) CHANGE QUANTITY
    change: (pid, qty) => {
        // (F1) REMOVE ITEM
        if (qty <= 0) {
            myArray = [];
            delete cart.items[pid];
            cart.save(); cart.list();
            //console.log(myArray)\\f
        } else {
            cart.items[pid] = qty;
            cart.total = 0;
            for (let id in cart.items) {
                cart.total += cart.items[id] * datL[0][id].price;
                document.getElementById("c-total").innerHTML = `TOTAL: ${rupiah(cart.total)}`;
                hargasemua = [rupiah(cart.total)]
                object = { name: datL[0][id].name, quantitas: cart.items[id] };
            }
        }
    },
    // (G) REMOVE ITEM FROM CART
    remove: id => {
        delete cart.items[id];
        cart.save();
        cart.list();
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
            perharga = cart.items[id] * datL[0][id].price;
            semuatotal += cart.items[id] * datL[0][id].price;
            namepro.push(i + '. ' + datL[0][id].name + ' - ( ' + cart.items[id] + ' * ' + datL[0][id].price + ' = ' + perharga + ')')
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
