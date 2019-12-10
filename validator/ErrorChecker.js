const { validationResult } = require('express-validator');

module.exports = {
    checkErrors: function(req, res){
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return true;
        }
        return false;
    }
}