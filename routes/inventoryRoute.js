const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const inventoryValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId))

// Route to build vehicle details view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleDetailsView))

// Route to build management view
router.get("/", utilities.handleErrors(invController.buildManagementView))

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView))

// Route to build add inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView))

// Process adding a new classification
router.post(
    "/add-classification",
    inventoryValidate.newClassificationRules(),
    inventoryValidate.checkNewClassificationData,
    utilities.handleErrors(invController.addNewClassification)
)

module.exports = router