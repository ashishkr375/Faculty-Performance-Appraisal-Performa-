interface Props {
    instructionalMarks: number;
    researchMarks: number;
    sponsoredMarks: number;
    organizationMarks: number;
    managementMarks: number;
}

export function MarksClaimed({
    instructionalMarks,
    researchMarks,
    sponsoredMarks,
    organizationMarks,
    managementMarks
}: Props) {
    const totalMarks = instructionalMarks + researchMarks + sponsoredMarks + 
                      organizationMarks + managementMarks;

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">VIII. MARKS CLAIMED BY FACULTY MEMBER</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="border p-2 text-left">S. No.</th>
                        <th className="border p-2 text-left">Component</th>
                        <th className="border p-2 text-center">Max. marks</th>
                        <th className="border p-2 text-center">Marks claimed</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border p-2">1</td>
                        <td className="border p-2">INSTRUCTIONAL ELEMENT</td>
                        <td className="border p-2 text-center">25</td>
                        <td className="border p-2 text-center">{instructionalMarks}</td>
                    </tr>
                    <tr>
                        <td className="border p-2">2</td>
                        <td className="border p-2">RESEARCH PAPERS/PUBLICATIONS</td>
                        <td className="border p-2 text-center">40</td>
                        <td className="border p-2 text-center">{researchMarks}</td>
                    </tr>
                    <tr>
                        <td className="border p-2">3</td>
                        <td className="border p-2">SPONSORED R & D CONSULTANCY & EXTENSION ELEMENTS</td>
                        <td className="border p-2 text-center">14</td>
                        <td className="border p-2 text-center">{sponsoredMarks}</td>
                    </tr>
                    <tr>
                        <td className="border p-2">4</td>
                        <td className="border p-2">ORGANIZATION/PARTICIPATION OF COURSES/CONFERENCES/SEMINAR/WORKSHOP AND OTHER EXTENSION WORKS</td>
                        <td className="border p-2 text-center">06</td>
                        <td className="border p-2 text-center">{organizationMarks}</td>
                    </tr>
                    <tr>
                        <td className="border p-2">5</td>
                        <td className="border p-2">MANAGEMENT & INSTITUTIONAL DEVELOPMENT ELEMENTS</td>
                        <td className="border p-2 text-center">15</td>
                        <td className="border p-2 text-center">{managementMarks}</td>
                    </tr>
                    <tr className="font-bold">
                        <td className="border p-2" colSpan={2}>GRAND TOTAL</td>
                        <td className="border p-2 text-center">100</td>
                        <td className="border p-2 text-center">{totalMarks}</td>
                    </tr>
                </tbody>
            </table>
            <div className="mt-8 text-right">
                <p>(Signature of faculty member with date)</p>
            </div>
        </div>
    );
}

