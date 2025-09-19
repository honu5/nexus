// function greet(name) {
//   console.log(`Hi ${name}`);
// }
// console.log(`Starting the execution`);
// // hof
// setTimeout(() => {
//   console.log(`Running this code`);
// }, 2000); //ms time
// for (let i = 0; i < 10000000; i++) {
//   // time consuming code
// //   dsjfds
// }
// greet("Nexus");
// console.log(`Finished Executing`);

// function timeConsuming() {
//     console.log(`Time consuming started`);
//     for (let i = 0; i < 10000000; i++) {
//         // time consuming code
//     }
//     console.log(`Exiting from the time consuming`);
// }
// function timeConsumingTimeout() {
//     console.log(`Starting time out`);
//     setTimeout(() => {
//         console.log(`Inside setTime out`);
//     }, 3000)
// } // 32 20 27 24 29 36 // 32 20 27 29 24 36 // 32 20 24 27 20 24 29 36 // 32 20 24 27 20 24 36 28
// console.log(`Start`);
// timeConsuming()
// timeConsumingTimeout()
// timeConsuming()
// console.log(`End`);

// {
// key : value
// }

// Promise
// special object will be returned immediately.
// consider a placeholder fro future result

// {

// status : [pending, fulfill, reject]
// value: any datatype
// onfullfillment : [handler]
// onrejection : [handler]

// intially
// status : pending
// value : undefined

// }

function bigTaskPromise() {
  return new Promise((resolve, reject) => {
    console.log(`Inside Promise`);
    setTimeout(() => {
      resolve(124243156);
    }, 6000);
    // reject("uislrlqegbrjqe");
  });
}
const promise = bigTaskPromise();

// function successHandler() {

// }
// function rejectionHandler() {


// }
promise.then(
  (message) => {
    console.log(`Inside fullfillment`);
    console.log(`Promise resolved`, message);
  },
  (message) => {
    console.log(`Inside rejection`);
    console.log(`Promise rejected`, message);
  }
);
//
