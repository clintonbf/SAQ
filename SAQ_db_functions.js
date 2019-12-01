function get_chair_collection(db_ref){
    return db_ref.collection("Chairs");
}

function get_sales_collection(db_ref) {
    return db_ref.collection("Sales");
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
