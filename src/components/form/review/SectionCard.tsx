interface Props {
    title: string;
    children: React.ReactNode;
}

export const SectionCard = ({ title, children }: Props) => {
    return (
        <div className="border rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            {children}
        </div>
    );
}; 