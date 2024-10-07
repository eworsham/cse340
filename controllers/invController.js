const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* *******************************************
 * Build inventory by classification view
 * ******************************************* */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: `${className} vehicles`,
        nav,
        grid,
    })
}

/* *******************************************
 * Build vehicle details view
 * ******************************************* */
invCont.buildVehicleDetailsView = async function(req, res, next) {
    const inventoryId = req.params.inventoryId
    const data = await invModel.getInventoryItemByInvId(inventoryId)
    const details = await utilities.buildVehicleDetailsView(data)
    let nav = await utilities.getNav()
    const vehicleMake = data.inv_make
    const vehicleModel = data.inv_model
    res.render("./inventory/details", {
        title: `${vehicleMake} ${vehicleModel} Details`,
        nav,
        details
    })
}

module.exports = invCont