//                                     OBJECTS
function Chair(id, name, price, comfort_options, ratings, picture) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.comfort_options = {
        firmness: comfort_options[0],
        back_support: comfort_options[1],
        arms: comfort_options[2]
    };
    this.ratings = ratings;  // an array
    this.picture = picture;
    return this
}

function Sale(buyer, date, total, chairs_arr) {
    this.buyer = buyer;
    this.date = date;
    this.total = total;
    this.chairs = chairs_arr;  // This is a Firestore reference of the type: "Chairs/chair_x"
}

// Create an array of all the Chair objects. A quick, synchronized way to get all Chair data
function create_chairs_array() {
    let chair_array = [];
    let chair_path = "images/chair_images/";
    chair_array.push(new Chair('chair_01', "the Clint", 525, [3, true, false], [1, 2, 1, 5, 5, 5, 4], chair_path + 'the_clint.jpg'));
    chair_array.push(new Chair(2, "the Fahad", 800, [1, true, true], [3, 3, 3], chair_path + 'the_fahad.png'));
    chair_array.push(new Chair(3, "the Em", 1250, [6, true, true], [5, 5], chair_path + 'the_em.jpeg'));
    chair_array.push(new Chair(4, "the Neda", 3200, [6, true, true], [5], chair_path + 'the_neda.jpg'));
    chair_array.push(new Chair(5, "the Sam", 800, [9, false, false], [3, 5], chair_path + 'the_sam.jpg'));
    chair_array.push(new Chair(6, "the Chris", 1000, [10, true, true], [1, 2, 3, 4, 5], chair_path + 'the_chris.jpg'));

    return chair_array;
}


let selectedChairs = [];
let cartCount = 0;
//Code for building the Chairs collection
// Insert a chair
function insert_chair_to_firestore(add_chair, id, collection_name){
    the_db.collection(collection_name).doc("chair_" + id).set({
        id: id,
        name: add_chair.name,
        price: add_chair.price,
        firmness: add_chair.comfort_options.firmness,
        back_support: add_chair.comfort_options.back_support,
        arms: add_chair.comfort_options.arms,
        ratings: add_chair.ratings,
        picture: add_chair.picture
    })
        .then(function() {
            console.log("Added chair " + add_chair.name);
        })
        .catch(function(error) {
            console.log("Error adding chair: " + error);
        });
}

//Insert a sale
function insert_sale_to_firestore(sale_obj) {
    the_db.collection("Users").doc().collection(sale_obj.buyer).doc().set({
        chairs_purchased: sale_obj.chairs,
        purchase_date: sale_obj.date,
        purchase_total: sale_obj.total
    })
        .then(function () {
            console.log("Added sale!");
        })
        .catch(function(error) {
            console.log("Error adding sale: " + error);
        });
}

//Create a set of mock-sales for bulk addition
function build_sales_objects() {
    let sale_arr = [];

    let large_chair_array = create_chairs_array();

    sale_arr.push(new Sale('Callie', new Date(), 800, "/Chairs/chair_4"));
    sale_arr.push(new Sale('Emma', new Date(2019, 9, 9), 3725, ["/Chairs/chair_0", "/Chairs/chair_3"]));
    sale_arr.push(new Sale('Joe', new Date(2019, 10, 15), 1000, ["/Chairs/chair_5"]));

    return sale_arr;
}

//insert the mock sales into the DB
function insert_sales() {
    //build the sales objects
    let sales_arr = build_sales_objects();

    //call functions that insert the Sales
    for (let i = 0; i < sales_arr.length; i++) {
        insert_sale_to_firestore(sales_arr[i]);
    }
}

// Display user greeting on pages
function displayUser(){
    let usergreet = JSON.parse(localStorage.getItem('userName'));
    console.log(usergreet);
    document.getElementById('EmRocks').innerHTML = "Welcome " + usergreet;
    document.getElementById('login-nav').innerHTML = "" + usergreet;
}

// Cart Functions
// Create chairs chosen
function chairsInCart(chair_info, multiple_amount) {
    let div_tag = document.createElement('div');
    div_tag.setAttribute('class', 'cart-div');
    document.body.appendChild(div_tag);
    let main_table = document.createElement('table');
    main_table.setAttribute("class", "cart-table");
    div_tag.appendChild(main_table);
    let row = document.createElement('tr');
    main_table.appendChild(row);
    row.setAttribute('class', 'cart-text');


    //Main table structure is now complete. Add all the relevant details in TDs
    let td_name = document.createElement('td');
    row.appendChild(td_name);
    td_name.innerHTML = chair_info.name;
    td_name.setAttribute('class', 'cart-item');
    let cell_chair_price = chair_info.price;
    let td_price = document.createElement('td');
    row.appendChild(td_price);
    td_price.setAttribute('class', 'cart-price');
    td_price.innerHTML = " $" + cell_chair_price;

    let chair_count = document.createElement('td');
    chair_count.innerHTML = multiple_amount.toString();
    row.appendChild(chair_count);

    let remove_chair = document.createElement('td');
    remove_chair.setAttribute('class', 'remove');
    remove_chair.setAttribute('id', removeHandler + "_remove");
    remove_chair.innerHTML = "Remove";
    row.appendChild(remove_chair);
    identifyRemoval(removeHandler + "_remove", chair_info.name);
}

// display cart and multiples
function displayCart() {
    let multipleItems = 1;
    for (let i = 0; i < cart_items.length; i++) {
        removeHandler = cart_items[i].name;
        chairsInCart(cart_items[i], 1, removeHandler);
        console.log("the name is" + cart_items[i].name);
    }
}


function identifyRemoval(removalid, removename) {
    document.getElementById(removalid).addEventListener("click", function () {
        remove(removename);
    });
}

// sort through list
function remove(removeHandler) {
    for(let i=0; i < cart_items.length; i++) {
        if (removeHandler === cart_items[i].name) {
            cart_items.splice(i, 1);
            localStorage.setItem('cartItems', JSON.stringify(cart_items));
            console.log(cart_items);
            document.location.reload(true);
        }
    }
}


// Functions for getting chair prefix
function get_prefix(chair_name) {
    if (chair_name === 'the Clint') {
        return 'clint_';
    }
    else if (chair_name === 'the Fahad') {
        return 'fahad_';
    }
    else if (chair_name === 'the Em') {
        return 'em_';
    }
    else if (chair_name === 'the Neda') {
        return 'neda_';
    }
    else if (chair_name === 'the Sam') {
        return 'sam_';
    }
    else if (chair_name === 'the Chris') {
        return 'chris_';
    }
}

//Calculate the average of a given array of int
function calculate_average(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return Math.floor(sum/arr.length);
}

//Create elements to showcase an individual chair in detail
function display_individual_chair(doc, name) {
    console.log(doc);
    console.log(name);
    let deb_ref = the_db.collection("clints_work").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (doc.data().name === name) {
                let name = doc.data().name;
                let prefix = get_prefix(name);
                //The following code is an attempt to auto-generate the HTML
                let chair_image = document.createElement("img");
                chair_image.setAttribute("class", "img-fluid");
                chair_image.setAttribute("id", prefix + "pic");
                document.getElementById("chair-feature-image").appendChild(chair_image);
                let div_tag = document.createElement("div");
                div_tag.setAttribute("class", "container feature-div");
                div_tag.setAttribute("id", prefix + "goto");
                document.body.appendChild(div_tag);
                let table_parent = document.createElement("table");
                table_parent.setAttribute("class", "display-4 catalog-div-text");
                div_tag.appendChild(table_parent);
                let tr_parent = document.createElement("tr");
                table_parent.appendChild(tr_parent);
                let td_1 = document.createElement("td");
                tr_parent.appendChild(td_1);
                let table_child_1 = document.createElement("table");
                table_child_1.setAttribute("class", "picture");
                td_1.appendChild(table_child_1);
                let tr_child_1 = document.createElement("tr");
                table_child_1.appendChild(tr_child_1);
                let td_child_1 = document.createElement('td');
                tr_child_1.appendChild(td_child_1);
                let td_2 = document.createElement("td");
                tr_parent.appendChild(td_2);
                let table_child_2 = document.createElement("table");
                //table_child_2.setAttribute("class", "chair_info");
                td_2.appendChild(table_child_2);
                let specs = [prefix + "name", prefix + "comfort_options", prefix + "price", prefix + "rating"];
                for (let i = 0; i < specs.length; i++) {
                    let tr_spec = document.createElement("tr");
                    table_child_2.appendChild(tr_spec);
                    let td_spec = document.createElement("td");
                    td_spec.setAttribute("id", specs[i]);
                    tr_spec.appendChild(td_spec);
                }
                let tr_add = document.createElement("tr");
                table_child_2.appendChild(tr_add);
                let td_add = document.createElement("td");
                tr_add.appendChild(td_add);
                let add_name = name.split(" ")[1];
                add_name = add_name.charAt(0).toLowerCase() + add_name.slice(1);
                let div_add = document.createElement("div");
                div_add.setAttribute("id","Add");
                div_add.setAttribute("class", "feature-add");
                div_add.innerHTML = "Add to Cart";
                td_add.appendChild(div_add);


                // Now back to our filling of the table
                document.getElementById("feature-chair").innerHTML = name;
                document.getElementById(prefix + "name").innerHTML = name;
                document.getElementById(prefix + "price").innerHTML = '$' + doc.data().price;
                document.getElementById(prefix + "rating").innerHTML = "Average rating: " + calculate_average(doc.data().ratings);
                document.getElementById(prefix + "pic").src = doc.data().picture;
            } else {
                console.log("error");
            }
        });

        })
}


function showFeaturedChair(doc, name) {
    display_individual_chair(doc, name );
    setTimeout(function () {
        individual_add(doc, name);
    }, 3000);
}


function individual_add(chair_document, chair_name) {
    document.getElementById("Add").addEventListener("click", addChair(chair_document, chair_name));
}

//
function featureHandler(chair_chosen, chair_chosen_name) {
    localStorage.setItem('goto', JSON.stringify([chair_chosen, chair_chosen_name]));
    goToChairDetails();
}

// Direct user to page that features chair
function goToChairDetails(){
    window.location.href = "chair.html";
}

// Direct user to catalog page
function gotoCatalog() {
    window.location.href="saq_catalog.html";
}

// Delete the local storage with key 'goto'
function removeFeatureStorage(){
    localStorage.removeItem('goto');
}

// Go to login page
function goToLogin() {
    window.location.href="userLogin.html";
}

// Sum total price of all chairs in your cart
function displayCartTotal() {
    let cartTotal = 0;
    let itemCount = 0;

    for (let i = 0; i < cart_items.length; i++) {
        cartTotal += cart_items[i].price;
        itemCount +=1;
    }

    let total_field = document.getElementById("our-cart");
    total_field.innerHTML = "$" + cartTotal.toString();
    document.getElementById("cart-summary").appendChild(total_field);
    let displayItemCount = document.getElementById("item-count");
    displayItemCount.innerHTML = "Items:  " + itemCount.toString();
}

//Add chair to cart
function addChair(doc, name) {
    let dbRef = the_db.collection("Chairs").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            if (doc.data().name === name) {
                selectedChairs.push(doc.data());
                console.log(selectedChairs);
                cartCount ++;
                document.getElementById('cart').innerHTML = "Cart: " + cartCount.toString();
                console.log("works")
            }
        })
        //     .catch(function (error) {
        //     console.log("Error displaying all items");
        // })
    })
}

// Get a chair from the DB
function get_single_chair(chair_id) {
    let db_ref = the_db.collection("Chairs").doc(chair_id);
    db_ref.get().then(function(doc){
        if (doc.exists){
            let ratings =  doc.data().ratings;
            let options = [doc.data().firmness,  doc.data().back_support, doc.data().arms];
            //id, name, price, comfort_options, ratings, picture
            let chair = new Chair(doc.data().id, doc.data().name, doc.data().price, options, ratings, doc.data().picture);
            document.getElementById('chair_name').innerHTML = chair.name;
            document.getElementById('price').innerHTML = "$" + chair.price;
            document.getElementById('rating').innerHTML = chair.ratings;
            document.getElementById('pic').src = chair.picture;
        }
        else {
            console.log("Didn't work");
        }
    })
        .catch(function(error) {
            console.log("Threw error " + error);
        });
}


function createDivs(order) {
    let db_ref = the_db.collection("clints_work").orderBy("price", order); // ToDo <----- replace with live Collection
    db_ref.get().then(function (catalog) {
        // Create a div area and put the chair into it
        catalog.forEach(function (doc) {
            let name = doc.data().name;
            let prefix = get_prefix(name);
            //The following code is an attempt to auto-generate the HTML
            let div_tag = document.createElement("div");
            div_tag.setAttribute("class", "container catalog-div");
            div_tag.setAttribute("id", prefix + "goto");
            document.body.appendChild(div_tag);
            let table_parent = document.createElement("table");
            table_parent.setAttribute("class", "display-4 catalog-div-text");
            div_tag.appendChild(table_parent);
            let tr_parent = document.createElement("tr");
            table_parent.appendChild(tr_parent);
            let td_1 = document.createElement("td");
            tr_parent.appendChild(td_1);
            let table_child_1 = document.createElement("table");
            table_child_1.setAttribute("class", "picture");
            td_1.appendChild(table_child_1);
            let tr_child_1 = document.createElement("tr");
            table_child_1.appendChild(tr_child_1);
            let td_child_1 = document.createElement('td');
            tr_child_1.appendChild(td_child_1);
            let chair_image = document.createElement("img");
            chair_image.setAttribute("class", "img-fluid catalog-images");
            chair_image.setAttribute("id", prefix + "pic");
            td_child_1.appendChild(chair_image);
            let td_2 = document.createElement("td");
            tr_parent.appendChild(td_2);
            let table_child_2 = document.createElement("table");
            //table_child_2.setAttribute("class", "chair_info");
            td_2.appendChild(table_child_2);
            let specs = [prefix + "name", prefix + "comfort_options", prefix + "price", prefix + "rating"];
            for (let i = 0; i < specs.length; i++) {
                let tr_spec = document.createElement("tr");
                table_child_2.appendChild(tr_spec);
                let td_spec = document.createElement("td");
                td_spec.setAttribute("id", specs[i]);
                tr_spec.appendChild(td_spec);
            }
            let tr_add = document.createElement("tr");
            table_child_2.appendChild(tr_add);
            let td_add = document.createElement("td");
            tr_add.appendChild(td_add);
            let add_name = name.split(" ")[1];
            add_name = add_name.charAt(0).toLowerCase() + add_name.slice(1);
            let div_add = document.createElement("div");
            div_add.setAttribute("id", add_name + "Add");
            div_add.setAttribute("class", "quick-add");
            div_add.innerHTML = "quick add";
            td_add.appendChild(div_add);



            // Now back to our filling of the table
            document.getElementById(prefix + "name").innerHTML = name;
            document.getElementById(prefix + "price").innerHTML = '$' + doc.data().price;
            document.getElementById(prefix + "rating").innerHTML = "Average rating: " + calculate_average(doc.data().ratings);
            document.getElementById(prefix + "pic").src = doc.data().picture;
        });
    });
}


function empty_div() {
    let empty_div = document.createElement("div");
    empty_div.setAttribute("class", "fill-div")
    empty_div.innerHTML = "empty";

}

function createDivListener() {
    document.getElementById("clintAdd").addEventListener("click", function () {
        addChair("chair_0", 'the Clint');
    });
    document.getElementById("fahadAdd").addEventListener("click", function () {
        addChair("chair_1", 'the Fahad');
    });
    document.getElementById("emAdd").addEventListener("click", function () {
        addChair("chair_2", 'the Em');
    });
    document.getElementById("nedaAdd").addEventListener("click", function () {
        addChair("chair_3", 'the Neda');
    });
    document.getElementById("samAdd").addEventListener("click", function () {
        addChair("chair_4", 'the Sam');
    });
    document.getElementById("chrisAdd").addEventListener("click", function () {
        addChair("chair_5", 'the Chris');
    });
    document.getElementById("clint_pic").addEventListener("click", function () {
        featureHandler("chair_0", "the Clint");
    });
    document.getElementById("fahad_pic").addEventListener("click", function () {
        featureHandler("chair_1", "the Fahad");
    });
    document.getElementById("em_pic").addEventListener("click", function () {
        featureHandler("chair_2", "the Em");
    });
    document.getElementById("neda_pic").addEventListener("click", function () {
        featureHandler("chair_3", "the Neda");
    });
    document.getElementById("sam_pic").addEventListener("click", function () {
        featureHandler("chair_4", "the Sam");
    });
    document.getElementById("chris_pic").addEventListener("click", function () {
        featureHandler("chair_5", "the Chris");
    });

}

//
function catalogLowToHigh() {
    createDivs();
    setTimeout(function () {
        createDivListener();
    }, 2000);
}

function catalogHighToLow() {
    createDivs("desc");
    setTimeout(function () {
        createDivListener();
    }, 2000);
}


// display user information on information page
function userInfo(){
    let yourName = JSON.parse(localStorage.getItem('userName'));
    let yourEmail = JSON.parse(localStorage.getItem('userEmail'));
    document.getElementById('currentName').innerHTML = 'Username: ' + yourName;
    document.getElementById('currentEmail').innerHTML = 'Email: ' + yourEmail;
}


