// backend

// time consuming
const User = {
  id: 1,
  name: "Some name",
};
function getByIdPromise(id) {
  return new Promise((res, rej) => {
    setTimeout(() => {
      if (id === User.id) {
        res(User);
      } else {
        rej("User not found");
      }
    }, 2000);
  });
}
// getByIdPromise(2).then(
//   (message) => {
//     console.log(`User found here it is`, message);
//   },
//   (message) => {
//     console.log(message);
//   }
// );

async function getUserbyId(id) {
  try {
    const user = await getByIdPromise(id); //promise
    console.log(`User found at async await is`, user);
    // dsfhgfjagd
    // gfndfknfd
  } catch (error) {
    console.log(`Some error`, error);
  }
}
// getUserbyId(2);
//
