export function MarksClaimed() {
  return (
    <section className="mb-8">
      <h3 className="text-lg font-semibold mb-4">VIII MARKS CLAIMED BY FACULTY MEMBER</h3>
      <table className="w-full border-collapse border mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">S. No.</th>
            <th className="border p-2">Component</th>
            <th className="border p-2">Max. marks</th>
            <th className="border p-2">Marks claimed</th>
          </tr>
        </thead>
        <tbody>
          {[
            { id: 1, component: "INSTRUCTIONAL ELEMENT", maxMarks: 25 },
            { id: 2, component: "RESEARCH PAPERS/PUBLICATIONS", maxMarks: 40 },
            { id: 3, component: "SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS", maxMarks: 14 },
            { id: 4, component: "ORGANIZATION/PARTICIPATION OF COURSES/CONFERENCES/SEMINAR/ WORKSHOP AND OTHER EXTENSION WORKS", maxMarks: 6 },
            { id: 5, component: "MANAGEMENT & INSTITUTIONAL DEVELOPMENT ELEMENTS", maxMarks: 15 },
          ].map((item) => (
            <tr key={item.id}>
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.component}</td>
              <td className="border p-2">{item.maxMarks}</td>
              <td className="border p-2"><input type="number" className="w-full" /></td>
            </tr>
          ))}
          <tr>
            <td className="border p-2" colSpan={2}>GRAND TOTAL</td>
            <td className="border p-2">100</td>
            <td className="border p-2"><input type="number" className="w-full" /></td>
          </tr>
        </tbody>
      </table>
      <div className="text-right">
        <p>(Signature of faculty member with date)</p>
        <input type="text" className="border p-1 mt-2" placeholder="Signature" />
        <input type="date" className="border p-1 mt-2 ml-2" />
      </div>
    </section>
  )
}

