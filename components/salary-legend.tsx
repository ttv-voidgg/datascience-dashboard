interface SalaryLegendProps {
    hasData: boolean
}

export function SalaryLegend({ hasData = true }: SalaryLegendProps) {
    if (!hasData) {
        return null
    }

    return (
        <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#3b82f6] mr-1"></div>
                <span className="mr-3">Lower</span>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#60a5fa] mr-1"></div>
                <span className="mr-3">Below Average</span>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#34d399] mr-1"></div>
                <span className="mr-3">Average</span>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#fbbf24] mr-1"></div>
                <span className="mr-3">Above Average</span>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#ef4444] mr-1"></div>
                <span>Higher</span>
            </div>
        </div>
    )
}
