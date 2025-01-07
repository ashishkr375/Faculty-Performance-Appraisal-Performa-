import { ItemsList } from './ItemsList';
import { OrganizationParticipation } from '@/types/form';

interface Props {
    data: OrganizationParticipation;
}

export const OrganizationSection = ({ data }: Props) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-3">Events & Conferences</h3>
                <ItemsList
                    items={data.events.map(event => ({
                        title: event.name,
                        details: {
                            'Type': event.type,
                            'Role': event.role,
                            'Sponsor': event.sponsor,
                            'Duration': `${event.startDate} to ${event.endDate}`,
                            'Participants': event.participants
                        }
                    }))}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Lectures Delivered</h3>
                <ItemsList
                    items={data.lectures.map(lecture => ({
                        title: lecture.title,
                        details: {
                            'Details': lecture.details
                        }
                    }))}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Online Courses</h3>
                <ItemsList
                    items={data.onlineCourses.map(course => ({
                        title: course.title,
                        details: {
                            'Type': course.type,
                            'L-T-P': course.ltp,
                            'Level': course.level,
                            'Duration (weeks)': course.duration,
                            'Completed': course.completed
                        }
                    }))}
                />
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-3">Outreach Activities</h3>
                <ul className="list-disc pl-5 space-y-2">
                    {data.outreachActivities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                    ))}
                </ul>
            </div>

            <div className="mt-4 text-right">
                <p className="font-semibold">Section Marks: {data.calculatedMarks}/6</p>
            </div>
        </div>
    );
}; 