"use client"

import { useMemo } from "react"

interface SalaryHeatMapProps {
    data: any[]
}

export function SalaryHeatMap({ data }: SalaryHeatMapProps) {
    const heatMapData = useMemo(() => {
        // Group by location and calculate average salary
        const locationSalaries: Record<string, number[]> = {}

        data.forEach((job) => {
            if (job.location && job.salary) {
                const avgSalary = ((job.salary.min || 0) + (job.salary.max || 0)) / 2
                if (!locationSalaries[job.location]) {
                    locationSalaries[job.location] = []
                }
                locationSalaries[job.location].push(avgSalary)
            }
        })

        // Calculate average salary per location
        const locationAvgSalaries = Object.entries(locationSalaries)
            .map(([location, salaries]) => {
                const avgSalary = salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length
                return {
                    location,
                    avgSalary: Math.round(avgSalary),
                    count: salaries.length,
                }
            })
            .sort((a, b) => b.avgSalary - a.avgSalary)

        // Calculate max salary for intensity scaling
        const maxSalary = Math.max(...locationAvgSalaries.map((item) => item.avgSalary))
        const minSalary = Math.min(...locationAvgSalaries.map((item) => item.avgSalary))

        return {
            locations: locationAvgSalaries,
            maxSalary,
            minSalary,
        }
    }, [data])

    // Function to determine cell color intensity based on salary
    const getSalaryColor = (salary: number, minSalary: number, maxSalary: number) => {
        // Normalize salary between 0 and 1
        const normalized = (salary - minSalary) / (maxSalary - minSalary)

        // Use a gradient from blue (low) to green (medium) to red (high)
        if (normalized < 0.33) {
            // Blue to green (0-0.33)
            const intensity = normalized * 3
            return `rgba(52, 152, 219, ${1 - intensity}) rgba(46, 204, 113, ${intensity})`
        } else if (normalized < 0.66) {
            // Green to yellow (0.33-0.66)
            const intensity = (normalized - 0.33) * 3
            return `rgba(46, 204, 113, ${1 - intensity}) rgba(241, 196, 15, ${intensity})`
        } else {
            // Yellow to red (0.66-1)
            const intensity = (normalized - 0.66) * 3
            return `rgba(241, 196, 15, ${1 - intensity}) rgba(231, 76, 60, ${intensity})`
        }
    }

    return (
        <div className="w-full h-full">
            <h3 className="text-sm font-medium mb-2">Salary Heat Map by Location</h3>
            <div className="grid grid-cols-1 gap-2">
                {heatMapData.locations.map(({ location, avgSalary, count }) => (
                    <div key={location} className="flex items-center">
                        <div className="w-32 truncate text-sm">{location}</div>
                        <div
                            className="flex-1 h-8 rounded-md relative"
                            style={{
                                background: `linear-gradient(to right, ${getSalaryColor(
                                    avgSalary,
                                    heatMapData.minSalary,
                                    heatMapData.maxSalary,
                                )})`,
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-between px-2">
                                <span className="text-white text-xs font-medium">${avgSalary.toLocaleString()}</span>
                                <span className="text-white text-xs">{count} jobs</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                <span>Lower Salary</span>
                <span>Higher Salary</span>
            </div>
        </div>
    )
}
