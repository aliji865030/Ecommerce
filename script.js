const loadProductsBtn = document.getElementById("loadProducts");
const productGrid = document.getElementById("productGrid");
const loader = document.getElementById("loader");
const sortSection = document.getElementById("sortSection");
const sortFilter = document.getElementById("sortFilter");

let products = [];

// Function to fetch products
async function fetchProducts() {
  try {
    // Show loader and hide button
    loader.style.display = "block";
    loadProductsBtn.style.display = "none";

    const response = await fetch(
      "https://run.mocky.io/v3/92348b3d-54f7-4dc5-8688-ec7d855b6cce?mocky-delay=500ms"
    );
    const data = await response.json();
    products = data.map((item) => item.product);

    // Display products and show sort section
    displayProducts(products);
    sortSection.style.display = "flex";
    sortSection.style.justifyContent = "space-around";
    sortSection.style.alignItems = "center";
  } catch (error) {
    console.error("Failed to fetch products", error);
  } finally {
    loader.style.display = "none";
  }
}

// Function to display products
function displayProducts(productList) {
  productGrid.innerHTML = ""; 
  productList.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    // Adding staggered animation
    setTimeout(() => productCard.classList.add("show"), index * 100);

    const productImage =
      product.images && product.images[0]
        ? product.images[0].src
        : "placeholder.jpg";
    const productName = product.title || "Unnamed Product";
    const productPrice =
      product.variants && product.variants[0]
        ? product.variants[0].price
        : "N/A";
    const currency =
      product.variants && product.variants[0]
        ? product.variants[0].price_currency
        : "USD";
    const productDescription = product.body_html || "No description available";

    productCard.innerHTML = `
      <img src="${productImage}" alt="${productName}" class="product-image">
      <h3 class="product-name">${productName}</h3>
      <p class="product-price"> &#8377;${productPrice}</p>
      <p class="product-description">${productDescription}</p>
      <button class="add-to-cart-btn"> <i class="fa-solid fa-cart-shopping"></i> <span>Add to Cart</span></button>
    `;

    const addToCartBtn = productCard.querySelector(".add-to-cart-btn");
    addToCartBtn.addEventListener("click", () => {
      addToCartBtn.classList.add("clicked");
      setTimeout(() => addToCartBtn.classList.remove("clicked"), 500);
    });

    productGrid.appendChild(productCard);
  });
}

// Sort products based on the selected option
function sortProducts() {
  const sortOrder = sortFilter.value;
  const sortedProducts = [...products].sort((a, b) => {
    const priceA = parseFloat(
      a.variants && a.variants[0] ? a.variants[0].price : "0"
    );
    const priceB = parseFloat(
      b.variants && b.variants[0] ? b.variants[0].price : "0"
    );

    return sortOrder === "lowToHigh" ? priceA - priceB : priceB - priceA;
  });
  displayProducts(sortedProducts);
}

// Event Listeners
loadProductsBtn.addEventListener("click", fetchProducts);
sortFilter.addEventListener("change", sortProducts);
