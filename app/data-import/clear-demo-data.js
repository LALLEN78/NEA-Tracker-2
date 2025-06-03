// This script removes any demo data from localStorage

export function clearDemoData() {
  if (typeof window !== "undefined") {
    // Keys that might contain demo data
    const demoKeys = [
      "nea-tracker-demo-students",
      "demo-students",
      "nea-tracker-demo-scores",
      "demo-scores",
      "nea-tracker-demo-data",
      "demo-data",
    ]

    // Remove all demo data keys
    demoKeys.forEach((key) => {
      try {
        localStorage.removeItem(key)
      } catch (e) {
        console.error(`Error removing ${key}:`, e)
      }
    })

    // Check if there's demo data in the main storage keys
    const mainKeys = ["nea-tracker-students", "nea-tracker-nea-scores", "nea-tracker-mock-exam-scores"]

    mainKeys.forEach((key) => {
      try {
        const data = localStorage.getItem(key)
        if (data) {
          const parsedData = JSON.parse(data)
          // If there's a large amount of data (like 79 students) and user hasn't imported yet,
          // it's likely demo data - remove it
          if (key === "nea-tracker-students" && Array.isArray(parsedData) && parsedData.length > 50) {
            localStorage.removeItem(key)
          }
        }
      } catch (e) {
        console.error(`Error checking ${key}:`, e)
      }
    })
  }
}

// Run this immediately
clearDemoData()
