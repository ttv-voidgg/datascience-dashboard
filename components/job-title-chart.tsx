"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface JobTitleChartProps {
    data: any[]
}

export function JobTitleChart({ data }: JobTitleChartProps) {
    const chartData = useMemo(() => {
        const titleSalaries: Record<string, number[]> = {}

        data.forEach((job) => {
            if (job.title && job.salary) {
                // Simplify job titles to group similar ones
                let simplifiedTitle = job.title
                    .replace(/(Senior|Jr\.|Junior|Lead)/gi, "")
                    .replace(/(Developer|Engineer|Programmer)/gi, "Developer")
                    .replace(/\s+/g, " ")
                    .trim()

                // If title is too long, truncate it
                if (simplifiedTitle.length > 20) {
                    simplifiedTitle = simplifiedTitle.substring(0, 20) + "..."
                }

                if (!titleSalaries[simplifiedTitle]) {
                    titleSalaries[simplifiedTitle] = []
                }

                const avgSalary = ((job.salary.min || 0) + (job.salary.max || 0)) / 2
                titleSalaries[simplifiedTitle].push(avgSalary)
            }
        })

        return Object.entries(titleSalaries)
            .map(([title, salaries]) => {
                const avgSalary = salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length

                return {
                    title,
                    avgSalary: Math.round(avgSalary),
                    count: salaries.length,
                }
            })
            .sort((a, b) => b.avgSalary - a.avgSalary)
            .slice(0, 8) // Top 8 highest paying job titles
    }, [data])

    return (
        <ChartContainer
            config={{
                avgSalary: {
                    label: "Avg Salary ($)",
                    color: "hsl(var(--chart-3))",
                },
            }}
            className="h-dvh w-full"
        >
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                    left: 120,
                    right: 20,
                    top: 10,
                    bottom: 10,
                }}
            >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" tickLine={false} axisLine={false} width={110} />
                <ChartTooltip className="bg-white" content={<ChartTooltipContent />} />
                <Bar dataKey="avgSalary" fill="var(--color-avgSalary)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
