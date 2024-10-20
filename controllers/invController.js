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
    const vehicleYear = data.inv_year
    const vehicleMake = data.inv_make
    const vehicleModel = data.inv_model
    res.render("./inventory/details", {
        title: `${data.inv_year} ${vehicleMake} ${vehicleModel}`,
        nav,
        details
    })
}

/* *******************************************
 * Build management view
 * ******************************************* */
invCont.buildManagementView = async function(req, res, next) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: 'Vehicle Management',
        nav,
        classificationSelect
    })
}

/* *******************************************
 * Build add classification view
 * ******************************************* */
invCont.buildAddClassificationView = async function(req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: 'Add New Classification',
        nav,
        errors: null,
    })
}

/* *******************************************
 * Build add inventory view
 * ******************************************* */
invCont.buildAddInventoryView = async function(req, res, next) {
    let nav = await utilities.getNav()
    let classificationDropDown = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
        title: 'Add New Vehicle',
        nav,
        classificationDropDown,
        errors: null,
    })
}

/* *******************************************
 * Proccess add new classification
 * ******************************************* */
invCont.addNewClassification = async function(req, res) {
    const { classification_name }  = req.body

    const result = await invModel.insertClassificationItem(classification_name)

    if (result) {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            `The ${classification_name} classification was successfully added.`
        )
        const classificationSelect = await utilities.buildClassificationList()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationSelect
        })
    } else {
        let nav = await utilities.getNav()
        req.flash(
            "notice",
            "Sorry, adding new classification failed."
        )
        res.status(501).render("./inventory/add-classification", {
            title: "Add New Classification",
            nav,
            errors: null,
        })
    }
}

/* *******************************************
 * Proccess add new inventory
 * ******************************************* */
invCont.addNewInventory = async function(req, res) {
    let nav = await utilities.getNav()
    const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color }  = req.body

    const result = await invModel.insertInventoryItem(
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    )

    if (result) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully added.`
        )
        const classificationSelect = await utilities.buildClassificationList()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationSelect
        })
    } else {
        req.flash(
            "notice",
            "Sorry, adding new vehicle failed."
        )
        let classificationDropDown = await utilities.buildClassificationList(classification_id)
        res.status(501).render("./inventory/add-inventory", {
            title: "Add New Vehicle",
            classificationDropDown,
            nav,
            errors: null,
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data returned"))
    }
}

/* ***************************
 *  Build modify inventory view
 * ************************** */
invCont.modifyInventoryView = async (req, res, next) => {
    const inv_id = parseInt(req.params.inventory_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryItemByInvId(inv_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    let classificationDropDown = await utilities.buildClassificationList(itemData.classification_id)

    res.render("./inventory/edit-inventory", {
        title: `Edit ${itemName}`,
        nav,
        classificationDropDown,
        errors: null,
        inv_id: itemData.inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_description: itemData.inv_description,
        inv_image: itemData.inv_image,
        inv_thumbnail: itemData.inv_thumbnail,
        inv_price: itemData.inv_price,
        inv_miles: itemData.inv_miles,
        inv_color: itemData.inv_color,
        classification_id: itemData.classification_id
    })
}

/* *******************************************
 * Proccess modify inventory
 * ******************************************* */
invCont.updateInventory = async function(req, res) {
    let nav = await utilities.getNav()
    const { inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color }  = req.body

    const result = await invModel.updateInventory(
        inv_id,
        classification_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color
    )

    if (result) {
        req.flash(
            "notice",
            `The ${inv_make} ${inv_model} was successfully updated.`
        )
        const classificationSelect = await utilities.buildClassificationList()
        res.status(201).render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            classificationSelect
        })
    } else {
        req.flash(
            "notice",
            "Sorry, updating vehicle failed."
        )
        let classificationDropDown = await utilities.buildClassificationList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        res.status(501).render("./inventory/edit-inventory", {
            title: `Edit ${itemName}`,
            classificationDropDown,
            nav,
            errors: null,
            inv_id,
            classification_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color
        })
    }
}

module.exports = invCont