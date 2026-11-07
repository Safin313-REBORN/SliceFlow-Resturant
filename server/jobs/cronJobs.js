import cron from 'node-cron';
import inventoryService from '../services/inventoryService.js';

export const initCronJobs = () => {
  // Job 1: Every 2 minutes, release stale unconfirmed stock reservations
  cron.schedule('*/2 * * * *', async () => {
    try {
      const releasedCount = await inventoryService.releaseExpiredReservations();
      if (releasedCount > 0) {
        console.log(`🧹 Cron: Released ${releasedCount} expired stock reservation(s).`);
      }
    } catch (error) {
      console.error('Error running reservation cleanup cron:', error);
    }
  });

  // Run initial low-stock audit on startup
  setTimeout(() => {
    inventoryService.checkLowStockAlerts().catch(console.error);
  }, 2000);

  // Job 2: Every hour, perform automated low-stock scan
  cron.schedule('0 * * * *', async () => {
    try {
      const alerts = await inventoryService.checkLowStockAlerts();
      if (alerts && alerts.length > 0) {
        console.log(`🚨 Cron: Low-stock alert triggered for ${alerts.length} item(s).`);
      }
    } catch (error) {
      console.error('Error running low-stock alert cron:', error);
    }
  });

  console.log('⏰ Background Cron Jobs initialized.');
};

