import { ReactNode } from "react"

type ErrorMessageProps = {
    children: ReactNode
}

export default function ErrorMessage({ children }: ErrorMessageProps) {
    return (
        <div className="bg-red-600 p-2 text-white font-bold text-sm text-center">
            {children}
        </div>
    )
}
