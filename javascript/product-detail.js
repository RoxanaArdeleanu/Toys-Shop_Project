document.addEventListener('DOMContentLoaded', () => {

  const productDetail = document.querySelector('#product-detail');
  let toys = [];

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const toyId = urlParams.get('id');
  if (!toyId) {
    console.log('Toy ID not found in the URL', toyId);
    return;
  }

  fetch(`http://localhost:3000/toys/${toyId}`)
    .then(response => response.json())
    .then(toy => {
      productDetail.innerHTML =
        `<div class="card mb-1">
            <div class="row g-0">
              <div class="col-md-4">
                <img src="${toy.image}" class="img-fluid rounded-start" alt="${toy.title}">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title">${toy.title}</h5>
                  <h4 class="card-text">Price: ${toy.price} Lei</h4>
                  <input class="cart-quantity-input" type="number" value="1"></input>
                  <button class="addToCartBtn" data-toy-id="${toy.id}"><i class="bi bi-basket2-fill"></i>Add to cart</button>
                  <p class="card-text">${toy.description}</p>
                </div>
              </div>
            </div>
        </div>`;

      const addToCartButton = productDetail.querySelector('.addToCartBtn');
      addListenerToBtnCart(addToCartButton);

      const quantityInput = document.querySelector('#product-detail .cart-quantity-input');
      if (quantityInput) {
        quantityInput.addEventListener('change', quantityChanged);
      }
      

    })
    .catch(error => console.error('Error fetching toy details:', error));

  function addListenerToBtnCart(addToCartButton) {
    addToCartButton.addEventListener('click', (event) => {
      event.stopPropagation();
      const toyId = addToCartButton.getAttribute('data-toy-id');
      const productImage = document.querySelector('#product-detail img').src;
      const productTitle = document.querySelector('#product-detail h5.card-title').innerText;
      const productPrice = document.querySelector('#product-detail h4.card-text').innerText;
      const quantityInput = document.querySelector('#product-detail .cart-quantity-input').value;

      addToyToCartLocalStorage(toyId, productImage, productTitle, productPrice, quantityInput);
    });
  }

  
  function addToyToCartLocalStorage(toyId, productImage, productTitle, productPrice, quantity) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const newItem = {
      toyId,
      productImage,
      productTitle,
      productPrice,
      quantity,
    };

    if (cartItems.find((el) => el.productTitle == newItem.productTitle)) {
      alert('Product already added to the cart');
      return;
    } else {
      cartItems.push(newItem);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
  }

  function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartCount.innerHTML = cartItems.length;

    if (cartItems.length === 0) {
      cartCount.style.display = 'block';
    } else {
      cartCount.style.display = 'block';
    }
  }

  updateCartCount();

  //Funtion that sets the input value for quantity to minimum 1
  function quantityChanged(event) {
  const input = event.target;
  const row = input.closest('#product-detail');
  if (isNaN(input.value) || input.value < 1) {
    input.value = 1;
  }}
 
    // Fetch toys and initialize the toys array
    const fetchToys = () => {
      fetch('http://localhost:3000/toys')
        .then(response => response.json())
        .then(data => {
          toys = data.map(toy => ({
            id: toy.id,
            image: toy.image,
            title: toy.title,
            price: toy.price,
            description: toy.description
          }));
        })
        .catch(error => {
          console.error('Error fetching toys:', error);
        });
    };
    
    // Call the fetchToys function to initialize the toys array
      fetchToys();
    
  
      function searchToysByTitle(title) {
        return toys.filter(toy => toy.title.toLowerCase().includes(title.toLowerCase()));
      }
  
      // Function to display search toys in the dropdown list
      function displayToys(toys) {
        const dropdownContainer = document.getElementById('insertSearchedProducts');
        dropdownContainer.innerHTML = ''; // Clear previous content
  
        if (toys.length === 0) {
          // If no toys match the search, display a message
          dropdownContainer.innerHTML = '<p>No matching toys found.</p>';
        } else {
          // Create a dropdown list
          const dropdownList = document.createElement('ul');
  
          toys.forEach(toy => {
            const listItem = document.createElement('li');
            listItem.textContent = toy.title;
            listItem.addEventListener('click', () => {
                window.location.href = `../../pages/toys-categories/searched-toys.html?id=${toy.id}`;
            });
  
            dropdownList.appendChild(listItem);
          });
  
          dropdownContainer.appendChild(dropdownList);
        }
      }
  
      // Event listener for the search button
      document.getElementById('searchButton').addEventListener('click', function () {
        const searchInput = document.querySelector('.form-control');
        const searchTerm = searchInput.value.trim();
  
        // Search for toys by title
        const matchingToys = searchToysByTitle(searchTerm);
  
        // Display the matching toys
        displayToys(matchingToys);
      });

});
