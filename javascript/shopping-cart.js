import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA0ciiceUsWD6jkXPJgX_sktljdlXyji_U",
  authDomain: "roxanawebapp.firebaseapp.com",
  projectId: "roxanawebapp",
  storageBucket: "roxanawebapp.appspot.com",
  messagingSenderId: "583615180884",
  appId: "1:583615180884:web:770a23a63eb158bf577dc1",
  measurementId: "G-CLVPN87PWH"
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {

    const cartTableBody = document.getElementById('cartTableBody');
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
  


  // Add event listener for remove buttons
  cartTableBody.addEventListener('click', function (event) {
    const buttonClicked = event.target.closest('.btn-remove');
    if (buttonClicked) {
     
      const rowToRemove = buttonClicked.closest('tr');
      const toyId = buttonClicked.getAttribute('data-toy-id');
      console.log('Toy ID removed:', toyId);

      //remove item from localStorage
      removeFromLocalStorage(toyId);

      rowToRemove.remove();

      //remove row item from shopping cart
      updateCartTotalWhenQtyChanged();
    }
  });

  function removeFromLocalStorage(toyId) {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    // Find the index of the item to remove
    const index = cartItems.findIndex((item) => item.toyId === toyId);

    if (index !== -1) {
      // Remove the item from the array
      cartItems.splice(index, 1);

      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));

      // Update the cart count
      updateCartCount();
    }
  }


  // Add event listener for quantity change
  cartTableBody.addEventListener('change', function (event) {
    if (event.target && event.target.classList.contains('cart-quantity-input')) {
      quantityChanged(event);
    }
  });

  //Function that always updates input to be at least 1 or greater and updates the subtotal and the total of the cart
  function quantityChanged(event) {
    const input = event.target;
    const row = input.closest('tr');
    const priceElement = row.querySelector('td:nth-child(4)');
    const price = parseFloat(priceElement.textContent.replace('Price: ', '').replace(' Lei', ''));
    
    if (isNaN(input.value) || input.value <= 1) {
      input.value = 1;
    }
  
    const quantity = parseInt(input.value);
    const subtotal = calculateSubtotal(price, quantity);
    row.querySelector('td:last-child').textContent = `${subtotal} Lei`;
  
    updateCartTotalWhenQtyChanged();
  }
  

  function updateCartTotalWhenQtyChanged() {
    const cartRows = cartTableBody.querySelectorAll('tr');
    let total = 0;
  
    cartRows.forEach((cartRow) => {
      const priceElement = cartRow.querySelector('td:nth-child(4)');
      const quantityElement = cartRow.querySelector('.cart-quantity-input');
      const price = parseFloat(priceElement.textContent.replace('Price: ', '').replace(' Lei', ''));
      const quantity = parseInt(quantityElement.value);
      const subtotal = calculateSubtotal(price, quantity);
      total += parseFloat(subtotal);
      cartRow.querySelector('td:last-child').textContent = `${subtotal} Lei`;
    });
  
    const totalElement = document.querySelector('#table-footer tr td:last-child strong');
    if (totalElement) {
      totalElement.textContent = `${total.toFixed(2)} Lei`;
    }
  }
  
    //Function to get cartItems from localStorage and display them into a table shopping-cart
    function displayCartItems() {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      cartTableBody.innerHTML = ''; 
  
      cartItems.forEach((item) => {
        const productPrice = parseFloat(item.productPrice.replace('Price: ', '').replace(' Lei', ''));
        const quantity = parseInt(item.quantity);
        const subtotal = calculateSubtotal(productPrice, quantity);
  
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>
            <button type="button" class="btn-remove" data-toy-id="${item.toyId}">
              <i class="bi bi-trash3-fill"></i>
            </button>
          </td>
          <td><img src="${item.productImage}" alt="${item.productTitle}" /></td>
          <td>${item.productTitle}</td>
          <td>${item.productPrice}</td>
          <td><input class="cart-quantity-input" type="number" value="${item.quantity}" /></td>
          <td>${subtotal} Lei</td>
        `;
  
        cartTableBody.appendChild(newRow);
      });
  
      calculateTotal();
    }
  
    function calculateSubtotal(price, quantity) {
      return (price * quantity).toFixed(2);
    }
  
    function calculateTotal() {
      const totalElement = document.querySelector('#table-footer tr td:last-child strong');
      const subtotalElements = document.querySelectorAll('#cartTableBody tr td:last-child');
  
      let total = 0;
      subtotalElements.forEach((subtotalElement) => {
        total += parseFloat(subtotalElement.textContent);
      });
  
      if (totalElement) {
        totalElement.textContent = `${total.toFixed(2)} Lei`;
      } 

      const sendOrderBtn = document.getElementById('send-order-btn');
      sendOrderBtn.addEventListener('click', () => {
      const user = auth.currentUser;
     
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

      if (cartItems.length === 0) {
          alert("Your cart is empty. You need to have at least 1 item.");
          window.location.href = "/index.html";
        } 
        else if (user && cartItems.length === 0) {
        alert("Your cart is empty. You need to have at least 1 item.");
        window.location.href = "/index.html";
        } 
        else if (user && cartItems.length > 0) {
          window.location.href = "../../pages/account/checkout.html";
        }
      else {
        alert("You need to be logged in to send the order.");
        window.location.href = "../../pages/account/account.html";
        }
      });
    }

    displayCartItems();

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
  