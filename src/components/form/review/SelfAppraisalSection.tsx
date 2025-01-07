import { SelfAppraisalForm } from '@/types/form';

interface Props {
    data: SelfAppraisalForm;
}

export const SelfAppraisalSection = ({ data }: Props) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2">Significant Achievements</h3>
                <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {data.achievements}
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Areas of Improvement</h3>
                <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {data.areasOfImprovement}
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Future Plans</h3>
                <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {data.futurePlans}
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2">Support Required</h3>
                <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {data.supportRequired}
                </p>
            </div>

            {data.additionalComments && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Additional Comments</h3>
                    <p className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                        {data.additionalComments}
                    </p>
                </div>
            )}
        </div>
    );
}; 