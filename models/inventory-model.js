const pool = require('../database/')

/* *****************************
 * Get all classification data
 * ***************************** */
async function getClassifications() {
    return await pool.query(
            `SELECT *
            FROM public.classification
            ORDER BY classification_name`
        )
}

/* ******************************
 * Get all inventory items and classification_name by classification_id
 * ****************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT *
            FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error(`getClassificationById error ${error}`)
    }
}

/* ******************************
 * Get an inventory item by inv_id
 * ****************************** */
async function getInventoryItemByInvId(inventoryId) {
    try {
        const data = await pool.query(
            `SELECT *
            FROM public.inventory
            WHERE inv_id = $1`,
            [inventoryId]
        )
        return data.rows[0]
    } catch (error) {
        console.error(`getInventoryItemByInvId error ${error}`)
    }
}

/* ******************************
 * Insert a new classification item
 * ****************************** */
async function insertClassificationItem(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1)"
        return await pool.query(sql, [classification_name])
    } catch (error) {
        return error.message
    }
}

/* ******************************
 * Insert a new inventory item
 * ****************************** */
async function insertInventoryItem(
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
    ) {
    try {
        const sql = `
            INSERT INTO inventory 
            (
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `
        return await pool.query(sql, [
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
        ])
    } catch (error) {
        return error.message
    }
}

/* ******************************
 * Update inventory item
 * ****************************** */
async function updateInventory(
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
        inv_color,
    ) {
    try {
        const sql = `
            UPDATE inventory SET 
                classification_id = $1,
                inv_make = $2,
                inv_model = $3,
                inv_description = $4,
                inv_image = $5,
                inv_thumbnail = $6,
                inv_price = $7,
                inv_year = $8,
                inv_miles = $9,
                inv_color = $10
            WHERE inv_id = $11
            RETURNING *
        `
        const data = await pool.query(sql, [
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        return error.message
    }
}

/* ******************************
 * Delete inventory item
 * ****************************** */
async function deleteInventory(inv_id) {
    try {
        const sql = 'DELETE FROM inventory WHERE inv_id = $1'
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        return error.message
    }
}

module.exports = { 
    getClassifications,
    getInventoryByClassificationId,
    getInventoryItemByInvId,
    insertClassificationItem,
    insertInventoryItem,
    updateInventory,
    deleteInventory
}