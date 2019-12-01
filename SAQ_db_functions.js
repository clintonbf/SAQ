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

//Define the sales object
function Sale(transaction_id, sold_chair, buyer, date) {
    this.transaction_id = transaction_id;
    this.chair = sold_chair;  // Chair object
    this.buyer = buyer;
    this.sale_date = date;
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

//Initialize Firestore with chairs
function initialize_chair_collection(collection_name) {
    let chair_collection = create_chairs_array();

    for (let i = 0; i < chair_collection.length; i++) {
        insert_chair_to_firestore(chair_collection[i], i, collection_name);
    }
}

//Code for building the Sales collection
//Insert a sale
function insert_sale(sale_obj) {
    let buyer = sale_obj.name;

    the_db.collection("Sales").doc(buyer).set({
        chairs_purchased: sale_obj.purchased_chairs,
        purchase_date: sale_obj.date,
        purchase_total: sale_obj.purchase_total
    })
        .then(function () {
            console.log("Added sale!");
        })
        .catch(function(error) {
            console.log("Error adding sale: " + error);
        });
}

// Initialize Firestore with sales
function insert_sales() {
    let sale_array = [];
    sale_array.push(new Sale(generate_trans_id(), "the Clint", "Boogie Woogie", "Oct 14, 2019"));
    sale_array.push(new Sale(generate_trans_id(), "the Clint", "GitMaster", "Oct 15, 2019"));
    sale_array.push(new Sale(generate_trans_id(), "the Neda", "Neda", "Oct 31, 2019"));
    sale_array.push(new Sale(generate_trans_id(), "the Neda", "Sam", "Nov 31, 2019"));

    for (let j = 0; j < sale_array.length; j++) {
        insert_sale(sale_array[j]);
    }
}

function displayUser(){
    let usergreet = JSON.parse(localStorage.getItem('userName'));
    console.log(usergreet);
    document.getElementById('EmRocks').innerHTML = "Welcome " + usergreet;
    document.getElementById('login-nav').innerHTML = "" + usergreet;
}
