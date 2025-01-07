export function OrganizationParticipation() {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-4">IV: ORGANIZATION/PARTICIPATION OF COURSES/CONFERENCES/SEMINAR/ WORKSHOP AND OTHER EXTENSION WORKS</h3>
      <h4 className="text-md font-medium mb-2">(a) Workshop or Faculty Development program or short-term courses</h4>
      <table className="w-full border-collapse border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">National/International</th>
            <th className="border p-2">Your role</th>
            <th className="border p-2">Name of the event</th>
            <th className="border p-2">Sponsored by</th>
            <th className="border p-2">Start Date</th>
            <th className="border p-2">End Date</th>
            <th className="border p-2">No. of participants</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((index) => (
            <tr key={index}>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="date" className="w-full" /></td>
              <td className="border p-2"><input type="date" className="w-full" /></td>
              <td className="border p-2"><input type="number" className="w-full" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add more tables for other sections like Continuing Education, MOOC courses, etc. */}
    </section>
  )
}

