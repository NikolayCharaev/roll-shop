const cartWrapper = document.querySelector('.cart-wrapper') // обертка карточек в корзине

// создаю прослушивание событий 
window.addEventListener('click', (event) => {
    const target = event.target; //для облегчения

    if (target.dataset.action === 'plus' || target.dataset.action === 'minus') {
        const counterWrapper = target.closest('.counter-wrapper');
        const counter = counterWrapper.querySelector('[data-counter]');
        // увеличиваю counter при клике
        if (target.dataset.action === 'plus') {
            counter.innerText = ++counter.innerText;
        };
        
        // уменьшаю counter при клике
        if (target.dataset.action === 'minus') {
            if (counter.innerText > 1) {
                counter.innerText = --counter.innerText;
            } else if (target.closest('.cart-wrapper') && parseInt(counter.innerText) === 1) {
                target.closest('.cart-item').remove()  
            }
            
        };
        calculateCards()
        toggleCartStatus()
        if (cartWrapper.children.length === 0){
            document.querySelector('.total-price').innerText = ''
            document.querySelector('.delivery-cost').textContent = ''
            
        }

    };

    //отслеживаю клик по кнопке "+ в корзину"
    if (target.hasAttribute('data-cart')) {
        
        const cart = target.closest('.card')
        const productInfo = { // добавляю данные из кликнутой карточки для дальнейшей отрисовки в корзине
            id: cart.dataset.id,
            image: cart.querySelector('.product-img').getAttribute('src'),
            title: cart.querySelector('.item-title').innerText,
            amount: cart.querySelector('[data-items-in-box]').innerText,
            weight: cart.querySelector('.price__weight').innerText,
            count: cart.querySelector('[data-counter]').innerText,
            price: cart.querySelector('.price__currency').innerText

        };

        const itemCart = cartWrapper.querySelector(`[data-id="${productInfo.id}"]`)
        if (itemCart) {

            const counterElement = itemCart.querySelector('[data-counter]')
            counterElement.innerText = parseInt(counterElement.innerText) + parseInt(productInfo.count)
        } else {

            const cartItemHTML = `
        <div class="cart-item" data-id="${productInfo.id}">
			<div class="cart-item__top">
				<div class="cart-item__img">
					<img src="${productInfo.image}" alt="">
				</div>
				<div class="cart-item__desc">
					<div class="cart-item__title">${productInfo.title}</div>
					<div class="cart-item__weight">${productInfo.amount}. / ${productInfo.weight}.</div>

					<!-- cart-item__details -->
					<div class="cart-item__details">

						<div class="items items--small counter-wrapper">
							<div class="items__control" data-action="minus">-</div>
							<div class="items__current" data-counter="">${productInfo.count}</div>
							<div class="items__control" data-action="plus">+</div>
						</div>

						<div class="price">
							<div class="price__currency">${productInfo.price}</div>
						</div>

					</div>
					<!-- // cart-item__details -->

				</div>
			</div>
		</div>
        `
        cartWrapper.insertAdjacentHTML('beforeend', cartItemHTML) // прорисовка карочек при клике поочередно
        }
        const resetCountOnClick = target.closest('.card') // обнуляю счетчик при клике на "+ в корзину"
        resetCountOnClick.querySelector('[data-counter]').innerText = 1
        calculateCards()
        toggleCartStatus()
    };

});
// пишу функцию для динамического отображения контента в блоке корзины
function toggleCartStatus() {
    const basketInfo = document.querySelector('[data-cart-empty]')
    const orderForm = document.querySelector('#order-form')
    if(cartWrapper.children.length >= 1){
        basketInfo.classList.add('none')
        orderForm.classList.remove('none')
    }else{
        basketInfo.classList.remove('none')
        orderForm.classList.add('none')
    }
}
// пишу функцию подсчета общей суммы в корзине товаров, динамического отображения варианта доставки

function calculateCards(){
    let count = 0 // итоговая сумма(будет динамически изменяться)
    const cartItems = document.querySelectorAll('.cart-item')
    const totalPrice = document.querySelector('.total-price')
    const cartTotal = document.querySelector('.cart-total')
    const deliveryText = document.querySelector('.delivery-cost')



    cartItems.forEach(item => {
        const itemPrice = item.querySelector('.price__currency').innerText
        const itemCurrent = item.querySelector('[data-counter]').innerText
        count += parseInt(itemPrice) * parseInt(itemCurrent)
        totalPrice.innerText = count 
    })
    if(parseInt(totalPrice.innerText) < 600){
        deliveryText.textContent = '250 ₽'
        deliveryText.classList.remove('free')
    }else{
        deliveryText.textContent = 'Бесплатно'
        deliveryText.classList.add('free')
    }

}   


