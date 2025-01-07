interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
    return (
        <button 
            {...props} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            {children}
        </button>
    );
} 