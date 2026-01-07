// Scheduler utility to update rental statuses daily
// This should be called when the application starts

let updateScheduler = null;

export function startRentalStatusScheduler() {
  // Only start if not already running
  if (updateScheduler) {
    console.log('Rental status scheduler already running');
    return;
  }

  // Run update immediately on startup
  updateRentalStatuses();

  // Then run every 24 hours (86400000 milliseconds)
  updateScheduler = setInterval(() => {
    updateRentalStatuses();
  }, 86400000); // 24 hours

  console.log('Rental status scheduler started - runs daily at app startup and every 24 hours');
}

export function stopRentalStatusScheduler() {
  if (updateScheduler) {
    clearInterval(updateScheduler);
    updateScheduler = null;
    console.log('Rental status scheduler stopped');
  }
}

async function updateRentalStatuses() {
  try {
    // Get the base URL from environment or use a default
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/update-rental-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    if (data.success) {
      console.log(`[Rental Status Update] ${data.message}`);
    } else {
      console.error(`[Rental Status Update Error] ${data.error}`);
    }
  } catch (error) {
    console.error('Error updating rental statuses:', error);
  }
}
