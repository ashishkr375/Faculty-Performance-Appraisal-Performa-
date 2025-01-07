interface Props {
    data: {
        areasOfImprovement: string;
        futurePlans: string;
        supportRequired: string;
        additionalComments?: string;
    };
}

export function CommentsForFutureWork({ data }: Props) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">VII. COMMENTS/ SUGGESTIONS FOR FUTURE WORK</h2>
            <p className="text-sm mb-4">
                (Including difficulties faced, if any, and suggestions for improvement, training, infrastructure etc. for professional growth and for achievement of excellence) [Max. 500 words]
            </p>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold mb-2">Areas of Improvement:</h3>
                    <div className="border p-4 rounded whitespace-pre-wrap">
                        {data.areasOfImprovement}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Future Plans:</h3>
                    <div className="border p-4 rounded whitespace-pre-wrap">
                        {data.futurePlans}
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Support Required:</h3>
                    <div className="border p-4 rounded whitespace-pre-wrap">
                        {data.supportRequired}
                    </div>
                </div>
                {data.additionalComments && (
                    <div>
                        <h3 className="font-semibold mb-2">Additional Comments:</h3>
                        <div className="border p-4 rounded whitespace-pre-wrap">
                            {data.additionalComments}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

