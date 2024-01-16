const Validator = require("fastest-validator");


const validate = (schema, data) => {
    const v = new Validator();
    const check = v.compile(schema);
    const validationResult = check(data);
    
    if (validationResult === true) {
        return true
    } else {
        return { valid: false, errors: validationResult };
    }
};

module.exports = {validate}