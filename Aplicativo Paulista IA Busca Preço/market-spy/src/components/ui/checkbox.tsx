import * as React from "react"
import { cn } from "@/lib/utils"
// Simplified checkbox without Radix for speed, using native input but styled
// If strict Shadcn needed, I would need @radix-ui/react-checkbox. 
// I'll stick to a native-like styled component for now to avoid specific radix install issues if they differ.
// Actually, I'll allow native checkbox style for simplicity or assume standard HTML input type="checkbox" in form. 
// Just wrapping it for standard feel.

const Checkbox = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <input
        type="checkbox"
        ref={ref}
        className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            className
        )}
        {...props}
    />
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
