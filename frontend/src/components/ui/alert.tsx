import * as React from "react"
import { cn } from "../../lib/utils"

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "success" | "destructive"
}

export function Alert({ variant = "success", className, ...props }: AlertProps) {
    const variants = {
        success: "bg-green-50 text-green-700 border-green-200",
        destructive: "bg-red-50 text-red-700 border-red-200",
    }
    return (
        <div
            role="alert"
            className={cn("rounded-md border p-4 text-sm", variants[variant], className)}
            {...props}
        />
    )
}