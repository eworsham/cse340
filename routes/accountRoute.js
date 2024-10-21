const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const accountValidate = require("../utilities/account-validation")

// Route to account management view
router.get(
    "/",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildAccountManagement)
)

// Route to update account view
router.get(
    "/updateAccount",
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildUpdateAccount)
)

// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to logout
router.get(
    "/logout", 
    utilities.checkLogin,
    utilities.handleErrors(accountController.accountLogout)
)

// Route to build registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegistration))

// Post registration info
router.post(
    '/registration',
    accountValidate.registationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

// Process update account info
router.post(
    "/edit-account",
    accountValidate.editAccountInfoRules(),
    accountValidate.checkEditAccountInfoData,
    utilities.handleErrors(accountController.updateAccountInfo)
)

// Process update account password
router.post(
    "/update-password",
    accountValidate.updatePasswordRules(),
    accountValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)

)

module.exports = router