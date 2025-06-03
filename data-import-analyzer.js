// Fetch and analyze the CSV data
const csvUrl =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Marksheet%20Unformatted-76ZqieT3ru3ejrAXJS4GGLehYlFiQe.csv"

async function fetchAndAnalyzeCSV() {
  try {
    console.log("Fetching CSV data...")
    const response = await fetch(csvUrl)
    const csvText = await response.text()

    console.log("CSV Content Preview:")
    console.log(csvText.substring(0, 500) + "...")

    // Parse CSV manually (simple parser)
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("\nHeaders found:")
    headers.forEach((header, index) => {
      console.log(`${index + 1}. "${header}"`)
    })

    // Parse first few data rows
    console.log("\nFirst 3 data rows:")
    for (let i = 1; i <= Math.min(3, lines.length - 1); i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        console.log(`\nRow ${i}:`)
        headers.forEach((header, index) => {
          if (values[index]) {
            console.log(`  ${header}: ${values[index]}`)
          }
        })
      }
    }

    // Count total students
    const dataRows = lines.slice(1).filter((line) => line.trim() && !line.includes("Template Notes"))
    console.log(`\nTotal students found: ${dataRows.length}`)

    // Analyze key fields
    console.log("\nKey field analysis:")

    // Sex distribution
    const sexCounts = {}
    const fsmCounts = {}
    const senCounts = {}
    const priorAttainmentCounts = {}

    dataRows.forEach((line) => {
      const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))

      // Sex (index 2)
      if (values[2]) {
        sexCounts[values[2]] = (sexCounts[values[2]] || 0) + 1
      }

      // FSM (index 3)
      if (values[3]) {
        fsmCounts[values[3]] = (fsmCounts[values[3]] || 0) + 1
      }

      // SEN Status (index 5)
      if (values[5]) {
        senCounts[values[5]] = (senCounts[values[5]] || 0) + 1
      }

      // Prior Attainment (index 9)
      if (values[9]) {
        priorAttainmentCounts[values[9]] = (priorAttainmentCounts[values[9]] || 0) + 1
      }
    })

    console.log("Sex distribution:", sexCounts)
    console.log("FSM distribution:", fsmCounts)
    console.log("SEN Status distribution:", senCounts)
    console.log("Prior Attainment distribution:", priorAttainmentCounts)

    return {
      headers,
      totalStudents: dataRows.length,
      sampleData: dataRows.slice(0, 3),
    }
  } catch (error) {
    console.error("Error fetching/analyzing CSV:", error)
  }
}

// Run the analysis
fetchAndAnalyzeCSV()
