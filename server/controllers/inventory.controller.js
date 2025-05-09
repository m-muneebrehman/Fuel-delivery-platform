// controllers/inventory.controller.js
const inventoryService = require("../services/inventory.service")

/**
 * Controller for handling inventory-related HTTP requests
 */
class InventoryController {
  /**
   * Create a new inventory item
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async createInventoryItem(req, res) {
    try {
      const newItem = await inventoryService.createInventoryItem(req.body);
      res.status(201).json({
        success: true,
        data: newItem,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create inventory item",
        error: error.name === "ValidationError" ? error.errors : undefined,
      });
    }
  }

  async getAllInventoryItems(req, res) {
    try {
      // Extract query parameters
      const {
        page = 1, // Default to page 1 if not provided
        limit = 10, // Default page size
        sortBy = "name",
        sortOrder = "asc",
        category,
        manufacturer,
        isActive,
        minPrice,
        maxPrice,
      } = req.query;

      // Convert page and limit to integers
      const pageNum = parseInt(page);
      const pageSize = parseInt(limit);
      const skip = (pageNum - 1) * pageSize;

      // Build filter
      const filter = {};

      if (category) filter.category = category;
      if (manufacturer) filter.manufacturer = manufacturer;
      if (isActive !== undefined) filter.isActive = isActive === "true";

      if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
      }

      // Get items
      const items = await inventoryService.getAllInventoryItems(filter, {
        skip,
        limit: pageSize,
        sortBy,
        sortOrder,
      });

      // Get total count for pagination
      const total = await inventoryService.getInventoryCount(filter);

      res.status(200).json({
        success: true,
        data: items,
        pagination: {
          total,
          page: pageNum,
          limit: pageSize,
          pages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve inventory items",
      });
    }
  }

  async getInventoryItemById(req, res) {
    try {
      const item = await inventoryService.getInventoryItemById(req.params.id);
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      res
        .status(error.message === "Inventory item not found" ? 404 : 500)
        .json({
          success: false,
          message: error.message || "Failed to retrieve inventory item",
        });
    }
  }

  async getInventoryItemBySku(req, res) {
    try {
      const item = await inventoryService.getInventoryItemBySku(req.params.sku);
      res.status(200).json({
        success: true,
        data: item,
      });
    } catch (error) {
      res
        .status(error.message === "Inventory item not found" ? 404 : 500)
        .json({
          success: false,
          message: error.message || "Failed to retrieve inventory item",
        });
    }
  }

  /**
   * Update inventory item by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateInventoryItem(req, res) {
  try {
    const itemId = req.query.itemId;

    const updatedItem = await inventoryService.updateInventoryItem(
      itemId,
      req.body
    );

    res.status(200).json({
      success: true,
      data: updatedItem,
    });
  } catch (error) {
    const statusCode =
      error.message === "Inventory item not found"
        ? 404
        : error.name === "ValidationError"
        ? 400
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update inventory item",
      error: error.name === "ValidationError" ? error.errors : undefined,
    });
  }
}


  async updateInventoryQuantity(req, res) {
    try {
      const { quantityChange } = req.body;

      if (quantityChange === undefined) {
        return res.status(400).json({
          success: false,
          message: "quantityChange is required in request body",
        });
      }

      const updatedItem = await inventoryService.updateInventoryQuantity(
        req.params.id,
        parseInt(quantityChange)
      );

      res.status(200).json({
        success: true,
        data: updatedItem,
      });
    } catch (error) {
      const statusCode =
        error.message === "Inventory item not found"
          ? 404
          : error.message === "Insufficient inventory quantity"
          ? 400
          : 500;

      res.status(statusCode).json({
        success: false,
        message: error.message || "Failed to update inventory quantity",
      });
    }
  }

  async deleteInventoryItem(req, res) {
    try {
      await inventoryService.deleteInventoryItem(req.query.itemId);

      res.status(200).json({
        success: true,
        message: "Inventory item deleted successfully",
      });
    } catch (error) {
      res
        .status(error.message === "Inventory item not found" ? 404 : 500)
        .json({
          success: false,
          message: error.message || "Failed to delete inventory item",
        });
    }
  }

  async getInventoryItemsByCategory(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "name",
        sortOrder = "asc",
      } = req.query;

      const items = await inventoryService.getInventoryItemsByCategory(
        req.params.category,
        { page: parseInt(page), limit: parseInt(limit), sortBy, sortOrder }
      );

      const total = await inventoryService.getInventoryCount({
        category: req.params.category,
      });

      res.status(200).json({
        success: true,
        data: items,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve inventory items",
      });
    }
  }

  async getInventoryItemsByManufacturer(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "name",
        sortOrder = "asc",
      } = req.query;

      const items = await inventoryService.getInventoryItemsByManufacturer(
        req.params.manufacturer,
        { page: parseInt(page), limit: parseInt(limit), sortBy, sortOrder }
      );

      const total = await inventoryService.getInventoryCount({
        manufacturer: req.params.manufacturer,
      });

      res.status(200).json({
        success: true,
        data: items,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve inventory items",
      });
    }
  }

  async searchByCompatibleVehicle(req, res) {
    try {
      const { make, model, year } = req.query;
      const {
        page = 1,
        limit = 10,
        sortBy = "name",
        sortOrder = "asc",
      } = req.query;

      const vehicle = { make, model, year: year ? parseInt(year) : undefined };

      const items = await inventoryService.searchByCompatibleVehicle(vehicle, {
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder,
      });

      // For compatible vehicle search, we need to construct the filter for count
      const filter = {};
      if (make) filter["compatibleVehicles.make"] = make;
      if (model) filter["compatibleVehicles.model"] = model;
      if (year) filter["compatibleVehicles.year"] = parseInt(year);

      const total = await inventoryService.getInventoryCount(filter);

      res.status(200).json({
        success: true,
        data: items,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to search inventory items",
      });
    }
  }
}

module.exports = new InventoryController();
