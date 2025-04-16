"use client"

import { useMemo } from "react"
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Cell,
} from "recharts"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface SalaryChartProps {
    data: {
        salary: { min: number; max: number }
        location: string
    }[]
}

export function SalaryChart({ data }: SalaryChartProps) {
    const { chartData, locationKeys, maxCount } = useMemo(() => {
        const ranges = [
            { min: 0, max: 50000, label: "0-50K" },
            { min: 50000, max: 70000, label: "50K-70K" },
            { min: 70000, max: 90000, label: "70K-90K" },
            { min: 90000, max: 110000, label: "90K-110K" },
            { min: 110000, max: 130000, label: "110K-130K" },
            { min: 130000, max: Number.POSITIVE_INFINITY, label: "130K+" },
        ]

        const chartData: Record<string, any>[] = []
        const allLocationKeys = new Set<string>()
        let globalMax = 0

        for (const range of ranges) {
            const locationCounts: Record<string, number> = {}

            // Gather counts per location for this range
            for (const job of data) {
                if (!job.salary || !job.location) continue

                const avgSalary = ((job.salary.min || 0) + (job.salary.max || 0)) / 2
                if (avgSalary >= range.min && avgSalary < range.max) {
                    const loc = job.location
                    locationCounts[loc] = (locationCounts[loc] || 0) + 1
                }
            }

            // Group low-count locations into "Other"
            const reduced: Record<string, number> = {}
            let otherTotal = 0

            for (const [loc, count] of Object.entries(locationCounts)) {
                if (count >= 10) {
                    reduced[loc] = count
                    allLocationKeys.add(loc)
                    if (count > globalMax) globalMax = count
                } else {
                    otherTotal += count
                }
            }

            if (otherTotal > 0) {
                reduced["Other"] = otherTotal
                allLocationKeys.add("Other")
                if (otherTotal > globalMax) globalMax = otherTotal
            }

            chartData.push({
                range: range.label,
                ...reduced,
            })
        }

        return {
            chartData,
            locationKeys: Array.from(allLocationKeys),
            maxCount: globalMax,
        }
    }, [data])

    return (
        <ChartContainer
            config={{
                count: {
                    label: "Job Count",
                    color: "hsl(var(--chart-2))",
                },
            }}
            className="h-dvh w-full"
        >
            <BarChart
                data={chartData}
                margin={{ left: 10, right: 10, top: 10, bottom: 20 }}
            >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartTooltip className="bg-white" content={<ChartTooltipContent />} />

                {locationKeys.map((location) => (
                    <Bar
                        key={location}
                        dataKey={location}
                        stackId="a"
                        radius={[4, 4, 0, 0]}
                    >
                        {chartData.map((entry, index) => {
                            const count = entry[location] || 0
                            const intensity = count / maxCount
                            const color = `rgba(59, 130, 246, ${intensity})`
                            return (
                                <Cell
                                    key={`cell-${index}-${location}`}
                                    fill={color}
                                />
                            )
                        })}
                    </Bar>
                ))}
            </BarChart>
        </ChartContainer>
    )
}
