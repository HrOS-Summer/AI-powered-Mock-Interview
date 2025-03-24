import { Controller, FieldValues } from "react-hook-form"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"


interface FormFieldProps<T extends FieldValues> {
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file'
}

const FormField = ({ control, name, label, placeholder, type="text"}: FormFieldProps<T>) => (
    <Controller 
        name={name} 
        control={control} 
        render={({ field }) => (
            <FormItem>
                <FormLabel className="label">Username</FormLabel>
                <FormControl>
                    <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                    This is your public display name.
                </FormDescription>
                <FormMessage />
            </FormItem>
        )}       
    />    
)

export default FormField