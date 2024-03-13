document.addEventListener('DOMContentLoaded', () => {
   
    let toys = {};

        // Fetch toy details based on toyId from the query parameter
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const toyId = urlParams.get('id');
        console.log('toy id:', toyId);
    
        // Check if toyId is present
        if (toyId) {
            fetch(`http://localhost:3000/toys/${toyId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((toy) => {
                    if (toy.id && toy.image && toy.title && toy.price) {
                       displayToy(toy);
                    } else {
                        console.error('Invalid toy data:', toy);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching toy details:', error);
                });
            } 
            else {
                fetchToys();
            }
        

    function displayToy(toy) {
        const mappedToysContainer = document.getElementById('mappedToysContainer');

        if (toy) {
            mappedToysContainer.innerHTML = '';
            mappedToysContainer.insertAdjacentHTML('afterbegin', 
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

            const cardDiv = document.getElementById(toy.id);
                if (cardDiv) {
                cardDiv.addEventListener('click', () => {
                    window.location.href = `../../pages/toys-categories/product-detail.html?id=${toy.id}`;
                });

            const addToCartButton = cardDiv.querySelector('.addToCartBtn');
                if (addToCartButton) {
                    addToCartButton.addEventListener('click', (event) => {
                      event.stopPropagation(); // Prevent the click event from propagating to toyBlock
                      const toyId = addToCartButton.getAttribute('data-toy-id');
                      const productImage = cardDiv.parentElement.querySelector('img').src;
                      const productTitle = cardDiv.parentElement.querySelector('h5').innerText;
                      const productPrice = cardDiv.parentElement.querySelector('h4').innerText;
                      const quantityInput = cardDiv.parentElement.querySelector('.cart-quantity-input').value;
                  
                      addToyToCartLocalStorage(toyId, productImage, productTitle, productPrice, quantityInput);
                    });
                  };
                  
            }
        } 
        else {
            console.error('Invalid toy data:', toy);
        }
    }

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
  
  //Function to update cart count on page
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

            toys.forEach(toy => {
                displayToy(toy);
            });

        })
        .catch(error => {
            console.error('Error fetching toys:', error);
        });
    };
        if (!toyId){
        fetchToys();
        }
});

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

