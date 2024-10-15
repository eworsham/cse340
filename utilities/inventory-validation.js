const utilities = require(".")
const { body, validationResult } = require("express-validator")
const inventoryModel = require("../models/inventory-model")
const validate = {}

/* ***********************************
 *  New Classification Data Validation Rules
 * *********************************** */
validate.newClassificationRules = () => {
    return [
        // classification_name is required and must be only alphabetic charatcers
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .isAlpha()
            .withMessage("Please provide a valid classification name."),
    ]
}

/* ***********************************
 *  Check data and return errors or continue
 * *********************************** */
validate.checkNewClassificationData = async (req, res, next) => {
    console.log("HERE 2")
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav
        })
        return
    }
    next()
}

module.exports = validate