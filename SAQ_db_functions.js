function get_chair_collection(db_ref){
    return db_ref.collection("Chairs");
}

function get_sales_collection(db_ref) {
    return db_ref.collection("Sales");
}

//Code to destroy database
function destroy_database (db_ref) {
    let chair_colctn = get_chair_collection(db_ref);

    chair_colctn.get().then(function(docs) {
        docs.forEach(function(doc) {
            doc.delete().then(function() {
                console.log("Deleted record for " + doc.data().name);
            })
        })
    })
        .catch(function(error) {
            console.log("Threw error " + error);
        });
}

function delete_chair_record(db_ref, chair){
    let chair_collection = get_chair_collection(db_ref);

    chair_collection.doc(chair).delete().then(function() {
        console.log("Deleted " + chair);
    }).catch(function(error) {
        console.error("Whoops " + error);
    });
}