var id = 5;
var firstName = "Nexus"; // Type inference
// union (or +)
var userId = "5433535435";
userId = 235;
// for arrays
var numbers = [1, 2, 3, 4, 5];
var hetro1 = [1, "some string", true];
var hetro2 = [1, "some string", true]; // consider as a js // not recommended
var hetro3 = [1, "some string", true];
var newBook = {
    id: 1,
    title: "jhdsgsd",
    author: "safdsbfd",
    // isSold : false
};
// It use for reusable object for database schema/entities, api request and response
// function
function add(a, b) {
    return a + b;
}
// Date
var today = new Date();
// enums
var Role;
(function (Role) {
    Role["user"] = "user";
    Role["admin"] = "admin";
})(Role || (Role = {}));
var role = Role.user;
// for logger
var logger1 = function (msg, errorcode) {
    console.log("logging ".concat(msg, ", ").concat(errorcode));
};
var logger2 = function (msg, successcode) {
    console.log("loggifng ".concat(msg, ", ").concat(successcode));
};
var users = {
    "1": {
        id: 1,
        username: "fhdsf",
        email: "dsfbfwu@gmail.com",
    },
};
// protected, public , private
// readonly -> prevent property modifiers
var Book = /** @class */ (function () {
    function Book(id, title, author, isSold) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isSold = isSold;
    }
    return Book;
}());
var newBook2 = new Book(1, "dfsbkd", "jfabfsd", false);
var UserRepository = /** @class */ (function () {
    function UserRepository() {
    }
    UserRepository.prototype.create = function (data) {
        console.log("Saving inside the database of User ".concat(data));
    };
    UserRepository.prototype.findbyId = function (id) {
        return { id: id, username: "ffjnfda", email: "dfjbdsfj@gmail.com" };
    };
    return UserRepository;
}());
var BookRepository = /** @class */ (function () {
    function BookRepository() {
    }
    BookRepository.prototype.create = function (data) {
        console.log("Saving inside the database of Book ".concat(data));
    };
    BookRepository.prototype.findbyId = function (id) {
        return { id: id, title: "ffjnfda", author: "dfjbdsfj@gmail.com", isSold: true };
    };
    return BookRepository;
}());
//
