const { body } = require('express-validator')


exports.validate = () => {
    return [
        body('username', "Event Start Does Not Exist Or Not Correclty Formated").exists().isInt(),
        body('password', "Event End Does Not Exist Or Not Correclty Formated").exists().isInt(),
        body('email', "Event Title Does Not Exist Or Not Correclty Formated").exists().isString(),
        body('age', "Event Details Does Not Exist Or Not Correclty Formated").optional().isInt(),
    ]
}