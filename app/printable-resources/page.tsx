"use client"

const PrintableResourcesPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Printable Resources for NEA</h1>
      <p className="mb-4">
        Welcome to the printable resources page! Here you'll find helpful documents to guide you through each stage of
        your NEA project. Each resource includes clear instructions on how and when to use it effectively.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Planning & Brainstorming</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceCard
            title="Comprehensive Project Planner"
            description="A single, comprehensive sheet to plan your entire project, including problem definition, solution design, implementation, testing, and evaluation. Use this from the very beginning to keep your project on track."
            downloadLink="#" // Replace with actual link
          />
          <ResourceCard
            title="Problem Definition Worksheet"
            description="Helps you clearly define the problem your project addresses. Use this early in the process to ensure a focused and relevant project."
            downloadLink="#" // Replace with actual link
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Design & Implementation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceCard
            title="Solution Design Template"
            description="A template to structure your solution design, including algorithms, data structures, and user interface considerations. Use this before you start coding."
            downloadLink="#" // Replace with actual link
          />
          <ResourceCard
            title="Implementation Checklist"
            description="A checklist to ensure you cover all aspects of implementation, including coding standards, version control, and documentation. Use this during the coding phase."
            downloadLink="#" // Replace with actual link
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Testing & Evaluation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceCard
            title="Testing Plan Template"
            description="A template to create a comprehensive testing plan, including test cases, expected results, and evaluation criteria. Use this before you start testing."
            downloadLink="#" // Replace with actual link
          />
          <ResourceCard
            title="Evaluation Rubric"
            description="A rubric to evaluate your project based on key criteria, such as functionality, usability, and efficiency. Use this during the evaluation phase."
            downloadLink="#" // Replace with actual link
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Documentation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ResourceCard
            title="Documentation Checklist"
            description="A checklist to ensure you include all necessary documentation, such as user manuals, technical specifications, and code comments. Use this throughout the project."
            downloadLink="#" // Replace with actual link
          />
        </div>
      </section>
    </div>
  )
}

const ResourceCard = ({
  title,
  description,
  downloadLink,
}: { title: string; description: string; downloadLink: string }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>
      <a
        href={downloadLink}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        download
      >
        Download
      </a>
    </div>
  )
}

export default PrintableResourcesPage
