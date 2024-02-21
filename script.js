// navbar toggle
const menu = document.getElementById('menu-checkbox');
const sidebar = document.getElementsByClassName('sidebar')[0]

menu.addEventListener('click', function(){
    sidebar.classList.toggle('hide')
})

// order
let iconCart = document.querySelector('.icon-cart');
let body = document.querySelector('body');
let close = document.querySelector('.Close')
let listProductHTML = document.querySelector('.listProduct')
let listCartHTML = document.querySelector('.listCart')
let iconCartSpan = document.querySelector('.icon-cart span')

let listProducts = [];
let carts = [];

iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart')
}) 

close.addEventListener('click', () =>{
    body.classList.toggle('showCart')
})

const addDataToHTML = () =>{
    listProductHTML.innerHTML = '';
    if(listProducts.length > 0){
        listProducts.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            newProduct.dataset.id= product.id;
            newProduct.innerHTML = `
            <div class="item" data-id="${product.id}">
            <img src="${product.image}" alt="">
            <h2>${product.name}</h2>
            <div class="price">${product.price}</div>
            <button class="addCart">
                Add To Cart
            </button>
            `;
            listProductHTML.appendChild(newProduct);
        })
    }
}
listProductHTML.addEventListener('click', (event)=>{
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        console.log(positionClick.parentElement)
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
})

const addToCart = (product_id) => {
    let positionOnThisProductInCart = carts.findIndex((value) => value.product_id == product_id);
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity:1
        }]
    }else if(positionOnThisProductInCart < 0){
        carts.push({
            product_id: product_id,
            quantity:1
        })
    }else{
        carts[positionOnThisProductInCart].quantity = carts[positionOnThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartTOMemory();
}
const addCartTOMemory = () =>{
    localStorage.setItem('cart', JSON.stringify(carts));
}
const addCartToHTML = () =>{
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart =>{
            totalQuantity = totalQuantity + cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');
            newCart.dataset.id = cart.product_id;
            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            let info = listProducts[positionProduct];
            newCart.innerHTML =`
            <div class="image" data-id="${info.id}">
                <img src="${info.image}" alt="">
         </div>
            <div class="name">
            ${info.name}
            </div>
            <div class="totalPrice">${info.price * cart.quantity}</div>
        
                <div class="quantity">
                <span class="minus"><</span>
                <span>${cart.quantity}</span>
                <span class="plus">></span>
                    </div>
            `;
        listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText= totalQuantity;
}
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus'
        if(positionClick.classList.contains('plus')){
            type ='plus'
        }
        changeQuantity(product_id, type);
    }
})
const changeQuantity = (product_id, type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
        
            default:
                let valueChange = carts[positionItemInCart].quantity - 1;
                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                }else{
                    carts.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartTOMemory();
    addCartToHTML();
}
const initApp = () =>{
    // get data from json
    fetch('product.json')
    .then(response => response.json())
    .then(data =>{
        listProducts = data;
        addDataToHTML();

        // get data from memory
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();
