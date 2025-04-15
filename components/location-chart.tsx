"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface LocationChartProps {
    data: any[]
}

export function LocationChart({ data }: LocationChartProps) {
    const chartData = useMemo(() => {
        const locationCounts: Record<string, number> = {}

        data.forEach((job) => {
            if (job.location) {
                locationCounts[job.location] = (locationCounts[job.location] || 0) + 1
            }
        })

        return Object.entries(locationCounts)
            .map(([location, count]) => ({ location, count }))
            .sort((a, b) => b.count - a.count)
    }, [data])

    return (
        <ChartContainer
            config={{
                count: {
                    label: "Job Count",
                    color: "hsl(var(--chart-1))",
                },
            }}
            className="h-dvh w-full"
        >
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                    left: 80,
                    right: 10,
                    top: 10,
                    bottom: 10,
                }}
            >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="location" type="category" tickLine={false} axisLine={false} width={70} />
                <ChartTooltip className="bg-white" content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
