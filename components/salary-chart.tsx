"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface SalaryChartProps {
    data: any[]
}

export function SalaryChart({ data }: SalaryChartProps) {
    const chartData = useMemo(() => {
        // Create salary ranges
        const ranges = [
            { min: 0, max: 50000, label: "0-50K" },
            { min: 50000, max: 70000, label: "50K-70K" },
            { min: 70000, max: 90000, label: "70K-90K" },
            { min: 90000, max: 110000, label: "90K-110K" },
            { min: 110000, max: 130000, label: "110K-130K" },
            { min: 130000, max: Number.POSITIVE_INFINITY, label: "130K+" },
        ]

        const salaryRangeCounts = ranges.map((range) => ({
            range: range.label,
            count: 0,
        }))

        data.forEach((job) => {
            if (job.salary) {
                // Use average of min and max salary
                const avgSalary = ((job.salary.min || 0) + (job.salary.max || 0)) / 2

                const rangeIndex = ranges.findIndex((range) => avgSalary >= range.min && avgSalary < range.max)

                if (rangeIndex !== -1) {
                    salaryRangeCounts[rangeIndex].count++
                }
            }
        })

        return salaryRangeCounts
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
                accessibilityLayer
                data={chartData}
                margin={{
                    left: 10,
                    right: 10,
                    top: 10,
                    bottom: 20,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis dataKey="range" tickLine={false} axisLine={false} />
                <YAxis />
                <ChartTooltip className="bg-white" content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
