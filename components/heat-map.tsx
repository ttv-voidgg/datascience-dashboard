"use client"

import { useMemo } from "react"

interface HeatMapProps {
    data: any[]
}

export function HeatMap({ data }: HeatMapProps) {
    const heatMapData = useMemo(() => {
        const locationCounts: Record<string, number> = {}

        // Count jobs per location
        data.forEach((job) => {
            if (job.location) {
                locationCounts[job.location] = (locationCounts[job.location] || 0) + 1
            }
        })

        // Convert to array and sort by count
        const sortedLocations = Object.entries(locationCounts)
            .map(([location, count]) => ({ location, count }))
            .sort((a, b) => b.count - a.count)

        // Calculate max count for intensity scaling
        const maxCount = Math.max(...Object.values(locationCounts))

        return {
            locations: sortedLocations,
            maxCount,
        }
    }, [data])

    // Function to determine cell color intensity based on job count
    const getColorIntensity = (count: number, maxCount: number) => {
        const intensity = Math.max(0.2, count / maxCount)
        return `rgba(52, 152, 219, ${intensity})`
    }

    return (
        <div className="w-full h-full">
            <h3 className="text-sm font-medium mb-2">Job Concentration Heat Map</h3>
            <div className="grid grid-cols-1 gap-2">
                {heatMapData.locations.map(({ location, count }) => (
                    <div key={location} className="flex items-center">
                        <div className="w-32 truncate text-sm">{location}</div>
                        <div
                            className="flex-1 h-8 rounded-md relative"
                            style={{
                                backgroundColor: getColorIntensity(count, heatMapData.maxCount),
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-end pr-2 text-white font-medium">{count}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
