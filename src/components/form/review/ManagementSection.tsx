import { ItemsList } from './ItemsList';
import { ManagementDevelopment } from '@/types/form';

interface Props {
    data: ManagementDevelopment;
}

export const ManagementSection = ({ data }: Props) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">Institute Level Activities</h3>
                <ItemsList
                    items={data.instituteLevelActivities.map(activity => ({
                        title: activity.role,
                        details: {
                            'Duration': activity.duration,
                            'Marks Claimed': activity.marks
                        }
                    }))}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Department Level Activities</h3>
                <ItemsList
                    items={data.departmentLevelActivities.map(activity => ({
                        title: activity.activity,
                        details: {
                            'Duration': activity.duration,
                            'Marks': activity.marks
                        }
                    }))}
                />
            </div>

            <div className="mt-4 text-right">
                <p className="font-semibold">Section Marks: {data.calculatedMarks}/15</p>
            </div>
        </div>
    );
}; 