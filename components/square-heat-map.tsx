"use client"

import { useMemo } from "react"

interface SquareHeatMapProps {
    data: any[]
}

export function SquareHeatMap({ data }: SquareHeatMapProps) {
    const heatMapData = useMemo(() => {
        // Define salary ranges
        const salaryRanges = [
            { min: 0, max: 60000, label: "<60K" },
            { min: 60000, max: 80000, label: "60-80K" },
            { min: 80000, max: 100000, label: "80-100K" },
            { min: 100000, max: Infinity, label: ">100K" },
        ]

        // Get unique locations
        const locations = Array.from(new Set(data.map((job) => job.location))).sort()

        // Create a grid of location x salary range
        const grid: { location: string; salaryRange: string; count: number }[] = []

        // Initialize grid with all combinations
        locations.forEach((location) => {
            salaryRanges.forEach((range) => {
                grid.push({
                    location: location as string,
                    salaryRange: range.label,
                    count: 0,
                })
            })
        })

        // Fill in the counts
        data.forEach((job) => {
            if (job.location && job.salary) {
                const avgSalary = ((job.salary.min || 0) + (job.salary.max || 0)) / 2
                const rangeIndex = salaryRanges.findIndex(
                    (range) => avgSalary >= range.min && avgSalary < range.max
                )

                if (rangeIndex !== -1) {
                    const gridIndex = grid.findIndex(
                        (cell) =>
                            cell.location === job.location &&
                            cell.salaryRange === salaryRanges[rangeIndex].label
                    )

                    if (gridIndex !== -1) {
                        grid[gridIndex].count++
                    }
                }
            }
        })

        // Calculate max count for color scaling
        const maxCount = Math.max(...grid.map((cell) => cell.count))

        return {
            grid,
            locations,
            salaryRanges: salaryRanges.map((range) => range.label),
            maxCount,
        }
    }, [data])

    // Function to determine cell color intensity based on count
    const getCellColor = (count: number, maxCount: number) => {
        if (count === 0) return "bg-gray-100"

        const intensity = Math.max(0.1, Math.min(1, count / maxCount))

        // Use a color scale from light blue to dark blue
        return `rgb(${Math.round(220 - 150 * intensity)}, ${Math.round(240 - 180 * intensity)}, ${Math.round(255 - 100 * intensity)})`
    }

    return (
        <div className="w-full h-full overflow-auto">
            <div className="min-w-[600px]">
                {/* Header row with salary ranges */}
                <div className="grid" style={{ gridTemplateColumns: `180px repeat(${heatMapData.salaryRanges.length}, 1fr)` }}>
                    <div className="p-2 font-medium">Location / Salary</div>
                    {heatMapData.salaryRanges.map((range) => (
                        <div key={range} className="p-2 text-center font-medium">
                            {range}
                        </div>
                    ))}
                </div>

                {/* Data rows */}
                {heatMapData.locations.map((location) => (
                    <div
                        key={location}
                        className="grid"
                        style={{ gridTemplateColumns: `180px repeat(${heatMapData.salaryRanges.length}, 1fr)` }}
                    >
                        <div className="p-2 font-medium truncate">{location}</div>
                        {heatMapData.salaryRanges.map((range) => {
                            const cell = heatMapData.grid.find(
                                (c) => c.location === location && c.salaryRange === range
                            )
                            const count = cell ? cell.count : 0

                            return (
                                <div
                                    key={`${location}-${range}`}
                                    className="aspect-square m-1 rounded flex items-center justify-center text-sm font-medium"
                                    style={{
                                        backgroundColor: getCellColor(count, heatMapData.maxCount),
                                        color: count > heatMapData.maxCount / 2 ? "white" : "black"
                                    }}
                                >
                                    {count > 0 ? count : ""}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center text-xs text-muted-foreground">
                <div className="mr-2">Job Count:</div>
                <div className="flex">
                    <div className="w-4 h-4 bg-gray-100 mr-1"></div>
                    <div className="mr-2">0</div>
                    <div className="w-4 h-4 mr-1" style={{ backgroundColor: "rgb(185, 210, 230)" }}></div>
                    <div className="mr-2">Low</div>
                    <div className="w-4 h-4 mr-1" style={{ backgroundColor: "rgb(130, 160, 205)" }}></div>
                    <div className="mr-2">Medium</div>
                    <div className="w-4 h-4 mr-1" style={{ backgroundColor: "rgb(70, 60, 155)" }}></div>
                    <div>High</div>
                </div>
            </div>
        </div>
    )
}
