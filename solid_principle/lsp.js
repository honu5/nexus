// When extending a class, remember that you should be
// able to pass objects of the subclass in place of objects of
// the parent(super) class without breaking the client code.

// not correct
class File {
    
    // read(text) {
    //     console.log(`Reading dsjbdkbjs`);
    // }
}
// class ReadOnlyFile extends File{
// // violates lsp
// }

// class Readable {
//     read() {
//         throw new Error("Should be implemented")
//     }
// } 
// class WritableOnly extends File {
//  write() {
//     throw new Error("Should be implemented")
//  }
// }

class ReadOnlyFile extends File {
    // read
}

// class File extends Readable, Writable {

// }
// 
