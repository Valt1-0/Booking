// Initialize the replica set
rs.initiate({
    _id: 'rs0',
    members: [
        { _id: 0, host: 'localhost:27018' }
    ]
});

// Use admin then create user root
var adminDB = db.getSiblingDB('admin');
adminDB.createUser({
  user: "root",
  pwd: "example",
  roles: [{ role: "root", db: "admin" }],
});

// Authenticate as the root user
adminDB.auth("root", "example");

var dbName = 'tickets';
// Create a new user in the target database
adminDB.createUser({
  user: "root",
  pwd: "example",
  roles: [{ role: "readWrite", db: dbName }],
});