"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CompanyChartProps {
    data: any[]
}

export function CompanyChart({ data }: CompanyChartProps) {
    const chartData = useMemo(() => {
        const companyCounts: Record<string, number> = {}
        const companySalaries: Record<string, number[]> = {}

        data.forEach((job) => {
            if (job.company) {
                // Clean company name (remove rating if present)
                const companyName = job.company.replace(/\d+\.\d+$/, "").trim()

                companyCounts[companyName] = (companyCounts[companyName] || 0) + 1

                if (job.salary) {
                    const avgSalary = ((job.salary.min || 0) + (job.salary.max || 0)) / 2
                    if (!companySalaries[companyName]) {
                        companySalaries[companyName] = []
                    }
                    companySalaries[companyName].push(avgSalary)
                }
            }
        })

        return Object.entries(companyCounts)
            .map(([company, count]) => {
                const salaries = companySalaries[company] || []
                const avgSalary = salaries.length ? salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length : 0

                return {
                    company,
                    count,
                    avgSalary: Math.round(avgSalary),
                }
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10 companies
    }, [data])

    return (
        <ChartContainer
            config={{
                count: {
                    label: "Job Count",
                    color: "hsl(var(--chart-1))",
                },
                avgSalary: {
                    label: "Avg Salary",
                    color: "hsl(var(--chart-3))",
                },
            }}
            className="h-dvh"
        >
            <BarChart
                accessibilityLayer
                data={chartData}
                layout="vertical"
                margin={{
                    left: 150,
                    right: 50,
                    top: 10,
                    bottom: 10,
                }}
            >
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="company" type="category" tickLine={false} axisLine={false} width={140} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}
