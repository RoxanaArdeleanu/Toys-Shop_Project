document.addEventListener('DOMContentLoaded', () => {
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

});
