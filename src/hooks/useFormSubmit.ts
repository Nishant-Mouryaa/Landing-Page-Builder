// hooks/useFormSubmit.ts
import { useState } from 'react';
import { toast } from 'sonner';

export function useFormSubmit() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (
        submitFn: () => Promise<void>,
        successMessage: string = "Changes saved successfully!"
    ) => {
        try {
            setIsLoading(true);
            await submitFn();
            toast.success(successMessage);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, handleSubmit };
}