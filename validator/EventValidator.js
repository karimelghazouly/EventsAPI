const { body } = require('express-validator')


exports.validate = () => {
    return [
        body('start', "Event Start Does Not Exist Or Not Correclty Formated").exists().isInt(),
        body('end', "Event End Does Not Exist Or Not Correclty Formated").exists().isInt(),
        body('title', "Event Title Does Not Exist Or Not Correclty Formated").exists().isString(),
        body('details', "Event Details Does Not Exist Or Not Correclty Formated").exists().isString(),
        body('location', "Event Location Does Not Exist Or Not Correclty Formated").exists().isJSON(),
        body('location.address', "Event Location Address Does Not Exist Or Not Correclty Formated").exists().isString(),
        body('location.lngLat', "Event Latitude and Longitude Does Not Exist Or Not Correclty Formated").exists().isLatLong()
    ]
}