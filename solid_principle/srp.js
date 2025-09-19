//A class should have just one reason to change.
//
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  //creating the user
}
class UserRepository {
  // saving the user
  save(user) {
    console.log(`Saving user ${user.name}`);
  }
}

const user = new User("Bitanya", 20);
const repository = new UserRepository();
repository.save(user);
