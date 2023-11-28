import { products } from "../data/products.js";

let productsGridHtml = "";

products.forEach(productItem => {
  productsGridHtml += `
  <div class="productCell">
                <div><img class="productPic" src=${productItem.image}></div>
                <div>
                    <p class="productName">${productItem.name}</p>
                </div>
                <div>
                    <p class="ProductPrice">Rs ${productItem.price}</p>
                </div>
                <div class="productCellButtons">
                    <button class="buyNowButton buyNowButton_${productItem.id}" data-product-id=${productItem.id}>Buy Now</button>
                    <input class="productQuantityInput_${productItem.id}" type="number" min="1" value="1">
                    <img class="productQuantityAdd productQuantityAdd_${productItem.id}"
                    data-product-id=${productItem.id} src="assets/iconPlus.png">
                    <img class="productQuantityMinus productQuantityMinus_${productItem.id}"
                    data-product-id=${productItem.id} src="assets/iconMinus.png">
                </div>
            </div>
  `
});

document.querySelector(".productsGrid").innerHTML = productsGridHtml;

document.querySelectorAll(".buyNowButton").forEach(buttonItem => {
  buttonItem.addEventListener("click", () => {
    console.log("hi");
    document.querySelector(".overlay").classList.add("overlayShow");

    const { productId } = buttonItem.dataset, { value } = document.querySelector(`.productQuantityInput_${productId}`);
    console.log(productId, value);
    products.forEach(productItem => {
      let matchingItem, popupHtml;
      if (productId === productItem.id) {
        matchingItem = productItem;
        let total = matchingItem.price * value + 50 || 0;
        popupHtml =
          `
          <div class="popupContent">
          <div>
              <img class="popupProductPic" src=${matchingItem.image}>
          </div>
          <div class="popupDetails">
              <ul>
                  <li>
                      <div class="popupLabel">Products: </div>
                      <div>${matchingItem.name}</div>
                  </li>
                  <li>
                      <div class="popupLabel">Price: </div>
                      <div>Rs ${matchingItem.price}</div>
                  </li>
                  <li>
                      <div class="popupLabel">Quantity: </div>
                      <div>${value}</div>
                  </li>
                  <li>
                      <div class="popupLabel">Delivery Charge: </div>
                      <div>Rs 50</div>
                  </li>
                  <li>
                      <div class="popupLabel">Grand Total: </div>
                      <div>Rs ${total}</div>
                  </li>
              </ul>
          </div>
        </div>
        <div class="popupButtons">
          <button>Proceed</button>
          <button class="popupCloseButton">Close</button>
        </div>
        `
        console.log(popupHtml);
        document.querySelector('.popup').innerHTML = popupHtml;
      }
    })

    document.querySelector('.popupCloseButton').addEventListener('click', () => {
      console.log('hi');
      document.querySelector(".overlay").classList.remove("overlayShow");
    })
  })
})

document.querySelectorAll(".productQuantityAdd").forEach(buttonItem => {
  const { productId } = buttonItem.dataset || '';
  buttonItem.addEventListener("click", () => {
    const selectedButton = document.querySelector(`.productQuantityInput_${productId}`);
    selectedButton.value++;
  })
})

document.querySelectorAll(".productQuantityMinus").forEach(buttonItem => {
  const { productId } = buttonItem.dataset || '';
  buttonItem.addEventListener("click", () => {
    const selectedButton = document.querySelector(`.productQuantityInput_${productId}`);
    if (selectedButton.value > 1) selectedButton.value--;
  })
})


