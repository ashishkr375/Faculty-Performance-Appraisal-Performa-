interface Props {
    items: Array<{
        title: string;
        details: Record<string, string | number | boolean>;
    }>;
}

export const ItemsList = ({ items }: Props) => {
    if (items.length === 0) {
        return <p className="text-gray-500 italic">No items to display</p>;
    }

    return (
        <div className="space-y-4">
            {items.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {Object.entries(item.details).map(([key, value]) => (
                            <div key={key}>
                                <p className="text-sm text-gray-600">{key}:</p>
                                <p>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}; 