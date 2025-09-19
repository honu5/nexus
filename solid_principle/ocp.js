// Classes should be open for extension but closed for
// modification.
//

// class PaymentMethod {
//     // creditcard, telebirr, cbe
//     constructor(amount, method) {
//         this.amount = amount
//         this.method = method
//     }
//     getPayment() {
//         switch (this.method) {
//             case "creditCard":
//                 return `Paying ${this.amount} through creditcard`
//             case "telebirr":
//                 // return
//             case "cbe":
//                 // return
//             case "other new method":
//                 //
//         }
//     }
// }
class PaymentMethod {
    // interface
    getPayment() {
        throw new Error("Payment must be implemnted")
    }
}
class CreditCard extends PaymentMethod {
    getPayment() {
        return  `Paying through credit Card`
    }
}
class Telebirr extends PaymentMethod {
    // dbjsjds
}
//
