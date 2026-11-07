import mongoose from 'mongoose';
import Inventory from '../models/Inventory.js';
import StockReservation from '../models/StockReservation.js';
import InventoryAlert from '../models/InventoryAlert.js';
import emailService from './emailService.js';

class InventoryService {
  /**
   * Phase 1: Two-Phase Atomic Stock Reservation
   */
  async reserveStock(requiredItems, orderId, session = null) {
    const reservedItemsTracker = [];

    try {
      for (const item of requiredItems) {
        const { ingredientId, quantity } = item;

        // Atomic conditional reservation: checks availableQuantity >= quantity
        const updatedInventory = await Inventory.findOneAndUpdate(
          {
            ingredientId,
            $expr: {
              $gte: [{ $subtract: ['$quantity', '$reservedQuantity'] }, quantity],
            },
          },
          {
            $inc: { reservedQuantity: quantity },
          },
          {
            new: true,
            ...(session && { session }),
          }
        );

        if (!updatedInventory) {
          const invItem = await Inventory.findOne({ ingredientId });
          const name = invItem ? invItem.name : 'Selected ingredient';
          throw new Error(`Insufficient stock for "${name}". Please choose an alternative or adjust your quantity.`);
        }

        reservedItemsTracker.push({ ingredientId, quantity });
      }

      // Create reservation record
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
      const reservation = await StockReservation.create(
        [
          {
            orderId,
            items: reservedItemsTracker,
            status: 'PENDING',
            expiresAt,
          },
        ],
        { ...(session && { session }) }
      );

      return reservation[0] || reservation;
    } catch (error) {
      // Rollback any partially reserved items in this batch if one failed
      for (const item of reservedItemsTracker) {
        await Inventory.updateOne(
          { ingredientId: item.ingredientId },
          { $inc: { reservedQuantity: -item.quantity } },
          { ...(session && { session }) }
        );
      }
      throw error;
    }
  }

  /**
   * Phase 2: Commit Reservation upon Payment Verification
   */
  async commitReservation(orderId, session = null) {
    const reservation = await StockReservation.findOne({
      orderId,
      status: 'PENDING',
    }).session(session);

    if (!reservation) {
      return { committed: false, reason: 'No pending reservation found' };
    }

    for (const item of reservation.items) {
      await Inventory.updateOne(
        { ingredientId: item.ingredientId },
        {
          $inc: {
            quantity: -item.quantity,
            reservedQuantity: -item.quantity,
          },
        },
        { ...(session && { session }) }
      );
    }

    reservation.status = 'COMMITTED';
    await reservation.save({ ...(session && { session }) });

    // Trigger asynchronous threshold inspection
    setTimeout(() => {
      this.checkLowStockAlerts().catch((err) =>
        console.error('Error during low-stock alert check:', err)
      );
    }, 100);

    return { committed: true };
  }

  /**
   * Phase 3: Release Reservation on Failure or Cancellation
   */
  async releaseReservation(orderId, session = null) {
    const reservation = await StockReservation.findOne({
      orderId,
      status: 'PENDING',
    }).session(session);

    if (!reservation) {
      return { released: false, reason: 'No pending reservation found' };
    }

    for (const item of reservation.items) {
      await Inventory.updateOne(
        { ingredientId: item.ingredientId },
        {
          $inc: { reservedQuantity: -item.quantity },
        },
        { ...(session && { session }) }
      );
    }

    reservation.status = 'RELEASED';
    await reservation.save({ ...(session && { session }) });

    return { released: true };
  }

  /**
   * Release all expired reservations (called by cron)
   */
  async releaseExpiredReservations() {
    const expiredReservations = await StockReservation.find({
      status: 'PENDING',
      expiresAt: { $lt: new Date() },
    });

    let count = 0;
    for (const res of expiredReservations) {
      await this.releaseReservation(res.orderId);
      count++;
    }

    return count;
  }

  /**
   * Low-Stock Alert System with Rearm Protection
   */
  async checkLowStockAlerts() {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$quantity', '$lowStockThreshold'] },
    });

    const activeAlertsToNotify = [];

    for (const item of lowStockItems) {
      const existingAlert = await InventoryAlert.findOne({
        ingredientId: item.ingredientId,
      });

      if (!existingAlert || existingAlert.alertStatus === 'RESOLVED') {
        // Trigger alert and save record
        await InventoryAlert.findOneAndUpdate(
          { ingredientId: item.ingredientId },
          {
            ingredientName: item.name,
            category: item.category,
            alertStatus: 'ACTIVE',
            thresholdSnapshot: item.lowStockThreshold,
            stockSnapshot: item.quantity,
            lastNotifiedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        activeAlertsToNotify.push({
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          lowStockThreshold: item.lowStockThreshold,
        });
      }
    }

    // Check items that recovered above threshold and rearm them
    const recoveredItems = await Inventory.find({
      $expr: { $gt: ['$quantity', '$lowStockThreshold'] },
    });

    for (const item of recoveredItems) {
      await InventoryAlert.updateOne(
        { ingredientId: item.ingredientId, alertStatus: 'ACTIVE' },
        { alertStatus: 'RESOLVED' }
      );
    }

    // Send single consolidated email to admin if new alerts triggered
    if (activeAlertsToNotify.length > 0) {
      const adminEmail = process.env.ADMIN_ALERT_EMAIL || 'admin@sliceflow.com';
      await emailService.sendLowStockAlert(adminEmail, activeAlertsToNotify);
    }

    return activeAlertsToNotify;
  }
}

export default new InventoryService();

