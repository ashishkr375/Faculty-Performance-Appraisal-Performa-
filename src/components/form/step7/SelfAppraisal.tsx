import type { SelfAppraisal } from '@/types/form';

interface Props {
    formData: SelfAppraisal;
    setFormData: (data: SelfAppraisal) => void;
}

export const SelfAppraisalForm = ({ formData, setFormData }: Props) => {
    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-xl font-semibold mb-4">Self Appraisal</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Please provide your self-assessment and future plans
                </p>
            </div>

            <div>
                <label className="block mb-2">
                    Significant Achievements During the Assessment Period
                </label>
                <textarea
                    value={formData?.achievements}
                    onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="List your major achievements..."
                    
                />
            </div>

            <div>
                <label className="block mb-2">
                    Areas Where You Need to Improve
                </label>
                <textarea
                    value={formData?.areasOfImprovement}
                    onChange={(e) => setFormData({ ...formData, areasOfImprovement: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="Identify areas for improvement..."
                    
                />
            </div>

            <div>
                <label className="block mb-2">
                    Future Plans for Professional Development
                </label>
                <textarea
                    value={formData?.futurePlans}
                    onChange={(e) => setFormData({ ...formData, futurePlans: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="Describe your plans for professional growth..."
                    
                />
            </div>

            <div>
                <label className="block mb-2">
                    Support Required from the Institute
                </label>
                <textarea
                    value={formData?.supportRequired}
                    onChange={(e) => setFormData({ ...formData, supportRequired: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="What support do you need from the institute?"
                    
                />
            </div>

            <div>
                <label className="block mb-2">
                    Additional Comments
                </label>
                <textarea
                    value={formData?.additionalComments}
                    onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="Any other comments or remarks..."
                />
            </div>
        </section>
    );
}; 