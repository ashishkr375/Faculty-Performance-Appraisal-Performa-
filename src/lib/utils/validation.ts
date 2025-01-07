import { ZodError, ZodSchema } from 'zod';

export interface ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: Record<string, string>;
}

export async function validateFormData<T>(
    schema: ZodSchema,
    data: unknown
): Promise<ValidationResult<T>> {
    try {
        const validData = await schema.parseAsync(data);
        return {
            success: true,
            data: validData as T
        };
    } catch (error) {
        console.error('Validation error:', error);
        
        if (error instanceof ZodError) {
            const errors: Record<string, string> = {};
            error.errors.forEach((err) => {
                const path = err.path.join('.');
                errors[path] = err.message;
            });
            return {
                success: false,
                errors
            };
        }

        return {
            success: false,
            errors: {
                _form: 'An unexpected error occurred during validation'
            }
        };
    }
} 