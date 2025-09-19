// High-level classes shouldn’t depend on low-level class-
// es. Both should depend on abstractions. Abstractions
// shouldn’t depend on details. Details should depend on
// abstractions.

// class SMSService {
//     // sdjjdsf
//     send(message) {

//     }
// }
// class EmailService {
//     // sdbkjdsv
//     send(message) {

//     }
// }

// class WhatsappService {

// }
// class NotificationService {
//     constructor() {
//         this.smsService = new SMSService()
//         this.emailService =  new EmailService()
//         // modify
//     }

//     notifyviaSMS(message) {
//         this.smsService.send(message)
//     }

//     notifyviaEmail(message) {
//         this.emailService.send(message)
//     }
//     // modify
// }

// interface
class NotificationChannel {
    send(message) {
        throw new Error("implemented")
    }
}

class SMSService extends NotificationChannel{
    // sdjjdsf
    send(message) {

    }
}
class EmailService extends NotificationChannel {
    // sdbkjdsv
    send(message) {
    }
}

class WhatsappService extends NotificationChannel {
    send(message) {
    }
}

class NotificationService {
    constructor(notificationChannel) {
        this.notificationChannel = notificationChannel
    }
    notify(message) {
        this.notificationChannel.send(message)
    }
}

const emailNotify = new NotificationService(new EmailService()) // dependency injection
const smsNotify = new NotificationService(new SMSService())
const whatsapp = new NotificationService(new WhatsappService())
// 
