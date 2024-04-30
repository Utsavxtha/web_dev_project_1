import generateRandomHex from "./utils/generateRandomHex.js";
import hashGenerator from "./utils/hashGenerator.js";

let products = [];
let productsGridHtml = "";

function fetchJSONData() {
  fetch("../data/products.json")
    .then((res) => {  //res: Response
      if (!res.ok) {
        throw new Error
          (`HTTP error! Status: ${res.status}`); //error handling
      }
      return res.json(); //a promise; which returns a parsed JSON as 'data' in .then(data)
    })
    .then((data) => {  //executed when res.json() successfully parses the JSON 
      products = data.productData;
      productHtmlGen(); 
    }
    )
    .catch((error) =>
      console.error("Unable to fetch data:", error));
}


//had to create the below function because the below block was being executed before the fetch and JSON parse were resolved
//the below block is executed in the fetchJSONData function at the end

//generates the html for each product in the grid
function productHtmlGen() {
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
                </form>
            </div>
  `
  });


  //puts the generated html for grid in the productGrid element
  document.querySelector(".productsGrid").innerHTML = productsGridHtml;

  //shows the popup and generates the html for popup
  document.querySelectorAll(".buyNowButton").forEach(buttonItem => {
    buttonItem.addEventListener("click", () => {
      //shows the overlay
      document.querySelector(".overlay").classList.add("overlayShow");

      //gets product from respective dataset
      //gets value from the quantity input
      const { productId } = buttonItem.dataset, { value } = document.querySelector(`.productQuantityInput_${productId}`);

      //loops through all elements in 'products' array
      products.forEach(productItem => {
        let matchingItem, popupHtml;

        //checks if the product matches
        if (productId === productItem.id) {

          //stores the matched object
          matchingItem = productItem;

          //calculates total
          let total = (matchingItem.price * value + 50) || 0;

          //for esewa api
          const transaction_uuid = generateRandomHex(16);
          const input = `total_amount=${total},transaction_uuid=${transaction_uuid},product_code=EPAYTEST`;
          const signature = hashGenerator(input);

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
          <form class="esewa_form" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <input class="no_display" type="text" id="amount" name="amount" value="${total - 50}" required>
            <input class="no_display" type="text" id="tax_amount" name="tax_amount" value ="0" required>
            <input class="no_display" type="text" id="total_amount" name="total_amount" value="${total}" required>
            <input class="no_display" type="text" id="transaction_uuid" name="transaction_uuid" value="${transaction_uuid}" required>
            <input class="no_display" type="text" id="product_code" name="product_code" value ="EPAYTEST" required>
            <input class="no_display" type="text" id="product_service_charge" name="product_service_charge" value="0" required>
            <input class="no_display" type="text" id="product_delivery_charge" name="product_delivery_charge" value="50" required>
            <input class="no_display" type="text" id="success_url" name="success_url" value="${window.location.href}" required>
            <input class="no_display" type="text" id="failure_url" name="failure_url" value="${window.location.href}" required>
            <input class="no_display" type="text" id="signed_field_names" name="signed_field_names" value="total_amount,transaction_uuid,product_code" required>
            <input class="no_display" type="text" id="signature" name="signature" value="${signature}" required>
            <input class="popupProceedButton" value="Proceed" type="submit">
          </form>
          <button class="popupCloseButton">Close</button>
        </div>
        `
          document.querySelector('.popup').innerHTML = popupHtml;

        }
      })

      //hides the popup and overlay when 'Close' button is pressed
      document.querySelector('.popupCloseButton').addEventListener('click', () => {
        document.querySelector(".overlay").classList.remove("overlayShow");
      })
    })
  })

  //increses the quantity of product selected if '+' button is pressed
  document.querySelectorAll(".productQuantityAdd").forEach(buttonItem => {
    const { productId } = buttonItem.dataset || '';
    buttonItem.addEventListener("click", () => {
      const selectedButton = document.querySelector(`.productQuantityInput_${productId}`);
      selectedButton.value++;
    })
  })

  //decreases the quantity of product selected if '-' button is pressed
  document.querySelectorAll(".productQuantityMinus").forEach(buttonItem => {
    const { productId } = buttonItem.dataset || '';
    buttonItem.addEventListener("click", () => {
      const selectedButton = document.querySelector(`.productQuantityInput_${productId}`);
      if (selectedButton.value > 1) selectedButton.value--;
    })
  })
}

fetchJSONData();