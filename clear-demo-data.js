// Script to completely clear all demo data from NEA Tracker
console.log("🧹 Clearing all demo data from NEA Tracker...")

// List of all localStorage keys that might contain demo data
const keysToCheck = [
  "nea-tracker-students",
  "nea-tracker-scores",
  "nea-tracker-nea-scores",
  "nea-tracker-mock-exam-scores",
  "nea-tracker-analytics",
  "nea-tracker-deadlines",
  "nea-tracker-settings",
  "nea-tracker-rewards",
  "nea-tracker-contextual-challenges",
  "nea-tracker-saved-classes",
  "students",
  "scores",
  "deadlines",
]

// Clear each key
keysToCheck.forEach((key) => {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(key)
    console.log(`✅ Cleared: ${key}`)
  }
})

// Set empty arrays/objects for required keys
const emptyData = {
  "nea-tracker-students": [],
  "nea-tracker-nea-scores": {},
  "nea-tracker-mock-exam-scores": {},
  "nea-tracker-analytics": {
    totalStudents: 0,
    importDate: new Date().toISOString(),
  },
}

Object.entries(emptyData).forEach(([key, value]) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value))
    console.log(`📝 Set empty data for: ${key}`)
  }
})

console.log("✨ Demo data cleared! Dashboard should now show zero values.")
console.log("🔄 Please refresh your browser to see the changes.")
