export function Forwarding() {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">IX. FORWARDING, APPRAISAL & FOLLOW UP</h2>
            
            {/* HOD Forwarding */}
            <div className="mb-8">
                <h3 className="font-semibold mb-4">A) Forwarded by Head of Department/ Centre:</h3>
                <p className="text-sm mb-4">(With comments, if necessary, about the information given)</p>
                <div className="border-b border-gray-400 h-24 mb-4"></div>
                <p className="text-right">(Signature of H.O.D. with date)</p>
            </div>

            {/* Appraisal Committee Comments */}
            <div className="mb-8">
                <h3 className="font-semibold mb-4">B) Comments of Appraisal Committee to be communicated to the faculty member</h3>
                <div className="border-b border-gray-400 h-24 mb-4"></div>
                <p className="text-right">(Counter sign of the faculty member with date)</p>
                <p className="mt-4">Signature of Appraisal Committee with date</p>
                <div className="grid grid-cols-3 gap-8 mt-4">
                    <div className="border-b border-gray-400"></div>
                    <div className="border-b border-gray-400"></div>
                    <div className="border-b border-gray-400"></div>
                </div>
            </div>

            {/* Follow up Action */}
            <div className="mb-8">
                <h3 className="font-semibold mb-4">C) Follow up Action:</h3>
                <div className="border-b border-gray-400 h-24"></div>
            </div>

            {/* External Expert Comments */}
            <div className="mb-8">
                <h3 className="font-semibold mb-4">D) Comments of external expert(s):</h3>
                <div className="border-b border-gray-400 h-24"></div>
            </div>

            {/* Director's Section */}
            <div className="mt-16 text-center">
                <p className="font-bold">DIRECTOR/ DIRECTOR'S NOMINEE</p>
            </div>
        </div>
    );
}

