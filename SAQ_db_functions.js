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
    remove_chair.innerHTML = "Remove";
    row.appendChild(remove_chair);
}

// display cart and multiples
function displayCart() {
    let multipleItems = 1;
    for (let i = 0; i < cart_items.length; i++) {
        multipleItems = 1;
        for (let j = 0; j < cart_items.length; j++) { // loop to check for multiples
            if ((cart_items[i] === cart_items[j])) {
                console.log(multipleItems);
                console.log(cart_items[i]);
                chairsInCart(cart_items[i], multipleItems);
            }
        }
    }
}
