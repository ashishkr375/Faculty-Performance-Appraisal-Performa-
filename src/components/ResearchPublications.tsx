export function ResearchPublications() {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-4">II. RESEARCH PAPERS/PUBLICATIONS [Max. marks: 40]</h3>
      <h4 className="text-md font-medium mb-2">(a) Ph.D Research Supervision</h4>
      <table className="w-full border-collapse border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Sr. NO.</th>
            <th className="border p-2">Name of Student & Roll No.</th>
            <th className="border p-2">Registration Year and Status</th>
            <th className="border p-2">Area of research/Title of thesis undertaken</th>
            <th className="border p-2">Other supervisor(s)</th>
            <th className="border p-2">No. of SCI publications</th>
            <th className="border p-2">No. of Scopus publications</th>
            <th className="border p-2">Current status</th>
            <th className="border p-2">Date of latest status</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((index) => (
            <tr key={index}>
              <td className="border p-2">{index}</td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="number" className="w-full" /></td>
              <td className="border p-2"><input type="number" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="date" className="w-full" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add more tables for other sections like journal papers, conference papers, etc. */}
    </section>
  )
}

