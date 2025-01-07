export function SponsoredRD() {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-4">III SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS</h3>
      <h4 className="text-md font-medium mb-2">(a) Sponsored Research Projects from any Govt. agency/industry/institute:</h4>
      <table className="w-full border-collapse border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">S.No.</th>
            <th className="border p-2">Title of Project</th>
            <th className="border p-2">Funding Agency</th>
            <th className="border p-2">Financial Outlay</th>
            <th className="border p-2">Start date</th>
            <th className="border p-2">End date</th>
            <th className="border p-2">Name of P.I and other Investigators</th>
            <th className="border p-2">PI institute name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Did NIT Patna received any fund</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((index) => (
            <tr key={index}>
              <td className="border p-2">{index}</td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="date" className="w-full" /></td>
              <td className="border p-2"><input type="date" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
              <td className="border p-2"><input type="text" className="w-full" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Add more tables for other sections like Consultancy Projects, IPR, etc. */}
    </section>
  )
}

