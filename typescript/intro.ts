let id: number = 5;
let firstName = "Nexus"; // Type inference

// union (or +)
let userId: string | number = "5433535435";
userId = 235;

// for arrays
let numbers: number[] = [1, 2, 3, 4, 5];
let hetro1: (number | string | boolean)[] = [1, "some string", true];
let hetro2: any = [1, "some string", true]; // consider as a js // not recommended
let hetro3: [number, string, boolean] = [1, "some string", true];

// How we give types for Object
// ---> Interface or type
interface Books {
  // for object
  id: number;
  title: string;
  author: string;
  isSold?: boolean;
}

const newBook: Books = {
  id: 1,
  title: "jhdsgsd",
  author: "safdsbfd",
  // isSold : false
};
// It use for reusable object for database schema/entities, api request and response
// function
function add(a: number, b: number): number {
  return a + b;
}
// Date
let today: Date = new Date();
// enums
enum Role {
  user = "user",
  admin = "admin",
}

let role: Role = Role.user;
// type in TS

// for function interface
interface LoggerInterface {
  log: (msg: string, code: number) => void;
}
type Logger = (msg: string, code: number) => void;
// for logger
const logger1: Logger = (msg, errorcode) => {
  console.log(`logging ${msg}, ${errorcode}`);
};
const logger2: Logger = (msg, successcode) => {
  console.log(`loggifng ${msg}, ${successcode}`);
};

// HashMap
//! for any key-value pairs: Record
interface User {
  id: number;
  username: string;
  email: string;
}
type UserMap = Record<string, User>;

interface UserDict {
  [key: string]: User;
}
const users: UserMap = {
  "1": {
    id: 1,
    username: "fhdsf",
    email: "dsfbfwu@gmail.com",
  },
};

// protected, public , private

// readonly -> prevent property modifiers
class Book {
  readonly id: number;
  private title: string;
  protected author: string;
  isSold?: boolean;

  constructor(id: number, title: string, author: string, isSold?: boolean) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.isSold = isSold;
  }
}

const newBook2 = new Book(1, "dfsbkd", "jfabfsd", false);
// newBook2.id = 2 // readonly

// Generics
// type-safe coding, to make some property reusable
interface Repository<T> {
  create(data: T): void; // "is a user or a book or other"/
  findbyId(id: number): T; // "is a user or a book"
}

class UserRepository implements Repository<User> {
  create(data: User): void {
    console.log(`Saving inside the database of User ${data}`);
  }
  findbyId(id: number) {
    return { id, username: "ffjnfda", email: "dfjbdsfj@gmail.com" };
  }
}

class BookRepository implements Repository<Books> {
  create(data: Books): void {
    console.log(`Saving inside the database of Book ${data}`);
  }
  findbyId(id: number) {
    return { id, title: "ffjnfda", author: "dfjbdsfj@gmail.com", isSold: true };
  }
}
// extend
//
