// Clients shouldn’t be forced to depend on methods they
// do not use.

// class Machine {
//     print(pdf) {
//     }
//     copy(pdf) {
//     }
// }

// class Printer extends Machine {
//     print() {

//     }
// }

class Printer {
  print() {
    throw new Error(dsjbkdsf);
  }
}
class Copier {
  copy() {
    throw new Error(fdbjdf);
  }
}

class SimplePrinter extends Printer {
  // // dsffdkjs
  // print(pdf) {
  //     djndsf
  // }
}

// class MultiPurpose extends Printer, Copier{
//
// }
//
