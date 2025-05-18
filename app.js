  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, deleteField  } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

  const firebaseConfig = {
    apiKey: "AIzaSyDaDzTFJV-f_byjVvcDodvTPROCm7cavdU",
    authDomain: "foodpapa-88a60.firebaseapp.com",
    projectId: "foodpapa-88a60",
    storageBucket: "foodpapa-88a60.appspot.com", // .appspot.com والا ڈومین
    messagingSenderId: "871134341008",
    appId: "1:871134341008:web:0eb13e39b45e45a4537515"
  };
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;

      if(location.pathname == "/index.html"){
        location.href = "./dashboard.html"}
    } else {
      console.log("not logged in")
    }
  });
  


  function handlesignup() {
    const email = document.getElementById("Email").value;
    const password = document.getElementById("Password").value;
    createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => { 
    const user = userCredential.user;
    Swal.fire({
      title: "user signed up successfully",
      text: `${user.email}`,
      icon: "success",
    }).then(()=>{
      location.href = "dashboard.html"
    })
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "invalid credentials",
    });
  });
}
window.handlesignup = handlesignup;


  function handlelogin() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    Swal.fire({
      title: "user logged in successfully",
      text: `${user.email}`,
      icon: "success",
    }).then(() => {
      window.location.href = "dashboard.html";
    });
  })
  .catch((error) => {
  
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "invalid credentials",
    });
  });

  }
  window.handlelogin = handlelogin;
  

  function signOutUser(){
    signOut(auth)
    .then(() => {
      console.log("User signed out successfully.");
      Swal.fire({
        title: "user signed out successfully!",
        text: `bye bye`,
        icon: "success"
      }).then(() => {
        window.location.href = "index.html";
      });
    })
    .catch((error) => {
      console.error("Error signing out:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "thek hai",
      });
    });
}
window.signOutUser = signOutUser;



async function addProducts(){
  getProductListdiv.innerHTML = "";
  const product_name = document.getElementById("productName").value;
  const product_price = document.getElementById("productPrice").value;
  const product_category = document.getElementById("productCategory").value;
  const product_description = document.getElementById("productDesc").value;
  const product_url = document.getElementById("productImage").value;
  try {
    const docRef = await addDoc(collection(db, "items"), {
      product_name: product_name,
      product_price: product_price,
      product_category: product_category,
      product_description: product_description,
      product_url: product_url,
    });
    Swal.fire({
      title: "product added successfully",
      text: `Your order id is ${docRef.id}}`,
      icon: "success"
    });
    getProductList();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
window.addProducts = addProducts;


let getProductListdiv = document.getElementById("product-list");
async function getProductList() {
  const querySnapshot = await getDocs(collection(db, "items"));
querySnapshot.forEach((doc) => {
  getProductListdiv.innerHTML += `<div class="card" style="width: 18rem;">
  <img src=${doc.data().product_url} class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${doc.data().product_name}</h5>
    <p class="card-text">${doc.data().product_description}</p>
    <h5 class="card-title">${doc.data().product_price}</h5>
     <button onclick='openEditModal("${doc.id}", "${
      doc.data().product_name
    }", "${doc.data().product_price}","${doc.data().product_category}","${doc.data().product_description}", "${
      doc.data().product_url
    }")' class='btn btn-info'> Edit </button>
    <button onclick="delItem('${doc.id}')" class="btn btn-danger">Delete</button>
  </div>
</div>`
});

}
getProductList();
//widow.getProductList = getProductList;

async function delItem(params) {
  getProductListdiv.innerHTML = "";
  const cityRef = doc(db, 'items', params);
await deleteDoc(cityRef, {
    capital: deleteField()
});
getProductList()
}
window.delItem = delItem;




window.openEditModal = function (id, name, price, category, desc, url) {
  document.getElementById("editProductId").value = id;
  document.getElementById("editProductName").value = name;
  document.getElementById("editProductPrice").value = price;
  document.getElementById("editProductCategory").value = category;
  document.getElementById("editProductDesc").value = desc;
  document.getElementById("editProductImage").value = url;

  let editModal = new bootstrap.Modal(
    document.getElementById("editProductModal")
  );
  editModal.show();
};

window.saveProductChanges = async function () {
  const id = document.getElementById("editProductId").value;
  const name = document.getElementById("editProductName").value;
  const price = document.getElementById("editProductPrice").value;
  const category = document.getElementById("editProductCategory").value;
  const desc = document.getElementById("editProductDesc").value;
  const url = document.getElementById("editProductImage").value;

  const productRef = doc(db, "items", id);

  try {
    await updateDoc(productRef, {
      product_name: name,
      product_price: price,
      product_category: category,
      product_description: desc,
      product_url: url,
    });
    Swal.fire({
      title: "Updated!",
      text: "Product updated successfully.",
      icon: "success",
    });
    getProductListdiv.innerHTML = "";
    getProductList();
    bootstrap.Modal.getInstance(
      document.getElementById("editProductModal")
    ).hide();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text: error.message,
    });
  }
};




let userDiv = document.getElementById("userDiv");
async function userData() {
  const querySnapshot = await getDocs(collection(db, "items"));
querySnapshot.forEach((doc) => {
 userDiv.innerHTML += `<div class="card" style="width: 22rem;">
  <img src=${doc.data().product_url} class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${doc.data().product_name}</h5>
    <p class="card-text">${doc.data().product_description}</p>
    <h5 class="card-title">${doc.data().product_price}</h5>
  </div>
  <button onclick='addtocart("${doc.id}")' class="btn btn-primary">Add To Cart</button>
</div>`
});
}
if(userDiv){
  userData()
}


let num = 0
const cart = document.getElementById("cart-badge");


async function addtocart(id, name, price, category, desc, url){
  try {
    const docRef = await addDoc(collection(db, "carts"), {
      id: id,
      name: name,
      price: price,
      category: category,
      desc: desc,
      url: url,
    });
    Swal.fire({
      title: "product add to cart successfully",
      text: `Your order id is ${docRef.id}}`,
      icon: "success"
    });
    getProductList();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
  num++;
  cart.innerHTML = num;
}
window.addtocart = addtocart;


/*
let showCart = document.getElementById("showCart");
async function cartData() {
  const querySnapshot = await getDocs(collection(db, "carts"));
querySnapshot.forEach((doc) => {
 showCart.innerHTML += `<div class="card" style="width: 22rem;">
  <img src=${doc.data().url} class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title">${doc.data().name}</h5>
    <p class="card-text">${doc.data().description}</p>
    <h5 class="card-title">${doc.data().price}</h5>
  </div>
  <div class='d-flex justify-content-around'>
  <button class="btn btn-warning"> + </button>
  <button class="btn btn-danger"> - </button>
  </div>
</div>`
});
}
if (showCart){
  cartData();
}
  */



let showCart = document.getElementById("showCart");
let totalPrice = 0;
const totalPriceSpan = document.getElementById("totalPrice");

async function cartData() {
  const querySnapshot = await getDocs(collection(db, "carts"));
  querySnapshot.forEach((doc) => {
    const price = parseFloat(doc.data().price); // assuming price is string like "200"
    
    const card = document.createElement("div");
    card.className = "card mb-3";
    card.style.width = "22rem";
    card.innerHTML = `
      <img src="${doc.data().url}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${doc.data().name}</h5>
        <p class="card-text">${doc.data().desc || ""}</p>
        <h5 class="card-title">Rs. ${price}</h5>
      </div>
      <div class='d-flex justify-content-around mb-2'>
        <button class="btn btn-warning plus-btn"> + </button>
        <button class="btn btn-danger minus-btn"> - </button>
      </div>
    `;

    showCart.appendChild(card);

    // Add event listener for + button
    const plusBtn = card.querySelector(".plus-btn");
    plusBtn.addEventListener("click", () => {
      totalPrice += price;
      totalPriceSpan.innerText = totalPrice;
    });

    // Add event listener for - button
    const minusBtn = card.querySelector(".minus-btn");
    minusBtn.addEventListener("click", () => {
      if (totalPrice >= price) {
        totalPrice -= price;
        totalPriceSpan.innerText = totalPrice;
      }
    });
  });
}

if (showCart) {
  cartData();
}

  
