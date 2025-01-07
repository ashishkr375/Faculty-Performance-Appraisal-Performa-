interface Props {
    message: string;
}

export const FormError = ({ message }: Props) => {
    return (
        <p className="text-sm text-red-500 mt-1">
            {message}
        </p>
    );
}; 