document.addEventListener('DOMContentLoaded', () => {

    const insertFeaturedProducts = document.getElementById('insertFeaturedProducts');
    
    let toys = [];
    
    
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
  
      // Function to display toys in the dropdown list
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

    
      //Function to redirect on the product-detail page of the toys when block toy is clicked 
      const addEventListenerToBlockToy = (toyBlock) => {
      toyBlock.addEventListener('click', () => {
        const toyId = toyBlock.id;
        window.location.href = `../../pages/toys-categories/product-detail.html?id=${toyId}`;
      });
    };
    
    // Function to add event listener to addToCartBtn
    const addListenerToBtnCart = (addToCartButton) => {
      addToCartButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from propagating to toyBlock
        const toyId = addToCartButton.getAttribute('data-toy-id');
        const productImage = addToCartButton.parentElement.querySelector('img').src;
        const productTitle = addToCartButton.parentElement.querySelector('h5').innerText;
        const productPrice = addToCartButton.parentElement.querySelector('h4').innerText;
        const quantityInput = addToCartButton.parentElement.querySelector('.cart-quantity-input').value;
    
        addToyToCartLocalStorage(toyId, productImage, productTitle, productPrice, quantityInput);
      });
    };
    
    // Function to add toy to localStorage
    function addToyToCartLocalStorage(toyId, productImage, productTitle, productPrice, quantity) {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const newItem = {
        toyId,
        productImage,
        productTitle,
        productPrice,
        quantity,
      }
    
      if(cartItems.find((el)=>el.productTitle==newItem.productTitle)){
        alert("Product already added to the cart");
        return;
       }
       else{
        cartItems.push(newItem);
       }
    
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      updateCartCount();
    }
    
    //Function to update cart count icon
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const count = cartItems.length;
      
        cartCount.innerHTML = count;
      
        if (count === 0) {
          cartCount.style.display = 'block';
        } else {
          cartCount.style.display = 'block';
        }
      }
      
      updateCartCount(); 
    
      //Function to display several featured toys
    const addFeaturedProducts = (toy) => {
      insertFeaturedProducts.insertAdjacentHTML(
          'afterbegin',
              `<div class="card" id="${toy.id}">
                  <img src="${toy.image}" class="card-img-top" alt="${toy.title}">
                  <div class="card-body">
                      <h5 class="card-title">${toy.title}</h5>
                      <h4 class="card-text">Price: ${toy.price} Lei</h4>
                  <input class="cart-quantity-input" type="number" value="1"></input>
              </div>
                  <button class="addToCartBtn" data-toy-id="${toy.id}"><i class="bi bi-basket2-fill"></i>Add to cart</button>
              </div>`
      );
    };
    
    
      // Insert featured products into the specified element
      const addFeaturedToys = function () {
        fetch('http://localhost:3000/toys')
          .then(response => response.json())
          .then(data => {
            const FeaturedToys = data.slice(2, 10); // method that can be used with arrays or strings to extract a portion of the array or string. The slice method takes two parameters: start 2 inclusive and end 10 but not included.
            console.log('Selected featured toys:', FeaturedToys);
    
            FeaturedToys.forEach(toy => {
                toys[toy.id] = {
                  id: toy.id,
                  image: toy.image,
                  title: toy.title,
                  price: toy.price,
                  description: toy.description
                };
    
              addFeaturedProducts(toy);
    
              const toyBlock = document.getElementById(toy.id);
              addEventListenerToBlockToy(toyBlock);
    
              const addToCartButton = toyBlock.querySelector('.addToCartBtn');
              addListenerToBtnCart(addToCartButton);
    
            });
          });
      };
      
        addFeaturedToys();
    });
    