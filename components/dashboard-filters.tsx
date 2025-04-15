"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

interface DashboardFiltersProps {
    data: any[]
    onFilterChange: (filteredData: any[]) => void
}

export function DashboardFilters({ data, onFilterChange }: DashboardFiltersProps) {
    // Extract unique values for filters
    const locations = [...new Set(data.map((job) => job.location))].sort()
    const companies = [
        ...new Set(
            data.map((job) => {
                // Clean company name (remove rating if present)
                return job.company?.replace(/\d+\.\d+$/, "").trim()
            }),
        ),
    ].sort()

    // Calculate min and max salary from data
    const salaries = data.filter((job) => job.salary).map((job) => (job.salary.min + job.salary.max) / 2)
    const minSalary = Math.floor(Math.min(...salaries) / 1000) * 1000
    const maxSalary = Math.ceil(Math.max(...salaries) / 1000) * 1000

    // Filter states
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
    const [salaryRange, setSalaryRange] = useState<[number, number]>([minSalary, maxSalary])
    const [titleSearch, setTitleSearch] = useState("")
    const [companySearch, setCompanySearch] = useState("")
    const [filteredCompanies, setFilteredCompanies] = useState(companies)

    // Apply filters
    useEffect(() => {
        const filtered = data.filter((job) => {
            // Location filter
            if (selectedLocations.length > 0 && !selectedLocations.includes(job.location)) {
                return false
            }

            // Company filter
            if (selectedCompanies.length > 0) {
                const cleanCompany = job.company?.replace(/\d+\.\d+$/, "").trim()
                if (!selectedCompanies.includes(cleanCompany)) {
                    return false
                }
            }

            // Salary filter
            if (job.salary) {
                const avgSalary = (job.salary.min + job.salary.max) / 2
                if (avgSalary < salaryRange[0] || avgSalary > salaryRange[1]) {
                    return false
                }
            }

            // Title filter
            if (titleSearch && !job.title.toLowerCase().includes(titleSearch.toLowerCase())) {
                return false
            }

            return true
        })

        onFilterChange(filtered)
    }, [data, selectedLocations, selectedCompanies, salaryRange, titleSearch, onFilterChange])

    // Filter companies based on search
    useEffect(() => {
        if (companySearch) {
            setFilteredCompanies(companies.filter((company) => company.toLowerCase().includes(companySearch.toLowerCase())))
        } else {
            setFilteredCompanies(companies)
        }
    }, [companySearch, companies])

    // Reset all filters
    const resetFilters = () => {
        setSelectedLocations([])
        setSelectedCompanies([])
        setSalaryRange([minSalary, maxSalary])
        setTitleSearch("")
        setCompanySearch("")
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center">
                {/* Location Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                            Location
                            {selectedLocations.length > 0 && (
                                <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                                    {selectedLocations.length}
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-4 border-b">
                            <div className="font-medium">Filter by location</div>
                            <div className="text-sm text-muted-foreground">Select the locations you want to include</div>
                        </div>
                        <ScrollArea className="h-80">
                            <div className="p-4 space-y-2">
                                {locations.map((location) => (
                                    <div key={location} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`location-${location}`}
                                            checked={selectedLocations.includes(location)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedLocations([...selectedLocations, location])
                                                } else {
                                                    setSelectedLocations(selectedLocations.filter((l) => l !== location))
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`location-${location}`}>{location}</Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </PopoverContent>
                </Popover>

                {/* Company Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                            Company
                            {selectedCompanies.length > 0 && (
                                <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                                    {selectedCompanies.length}
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-0" align="start">
                        <div className="p-4 border-b">
                            <div className="font-medium">Filter by company</div>
                            <div className="text-sm text-muted-foreground">Select the companies you want to include</div>
                            <Input
                                placeholder="Search companies..."
                                value={companySearch}
                                onChange={(e) => setCompanySearch(e.target.value)}
                                className="mt-2"
                            />
                        </div>
                        <ScrollArea className="h-80">
                            <div className="p-4 space-y-2">
                                {filteredCompanies.map((company) => (
                                    <div key={company} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`company-${company}`}
                                            checked={selectedCompanies.includes(company)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedCompanies([...selectedCompanies, company])
                                                } else {
                                                    setSelectedCompanies(selectedCompanies.filter((c) => c !== company))
                                                }
                                            }}
                                        />
                                        <Label htmlFor={`company-${company}`}>{company}</Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </PopoverContent>
                </Popover>

                {/* Salary Range Filter */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                            Salary Range
                            {(salaryRange[0] > minSalary || salaryRange[1] < maxSalary) && (
                                <Badge variant="secondary" className="ml-2 rounded-sm px-1">
                                    Active
                                </Badge>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="start">
                        <div className="space-y-4">
                            <div>
                                <div className="font-medium">Salary range</div>
                                <div className="text-sm text-muted-foreground">Filter jobs by salary range</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>${salaryRange[0].toLocaleString()}</span>
                                    <span>${salaryRange[1].toLocaleString()}</span>
                                </div>
                                <Slider
                                    min={minSalary}
                                    max={maxSalary}
                                    step={5000}
                                    value={salaryRange}
                                    onValueChange={(value) => setSalaryRange(value as [number, number])}
                                />
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {/* Job Title Filter */}
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search job titles..."
                        value={titleSearch}
                        onChange={(e) => setTitleSearch(e.target.value)}
                        className="h-8 w-[200px]"
                    />
                    {titleSearch && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setTitleSearch("")}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* Reset Filters */}
                <Button variant="ghost" size="sm" className="h-8 ml-auto" onClick={resetFilters}>
                    Reset Filters
                </Button>
            </div>

            {/* Active Filters Display */}
            {(selectedLocations.length > 0 ||
                selectedCompanies.length > 0 ||
                salaryRange[0] > minSalary ||
                salaryRange[1] < maxSalary ||
                titleSearch) && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedLocations.map((location) => (
                        <Badge key={location} variant="secondary" className="flex items-center gap-1">
                            {location}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setSelectedLocations(selectedLocations.filter((l) => l !== location))}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                    {selectedCompanies.map((company) => (
                        <Badge key={company} variant="secondary" className="flex items-center gap-1">
                            {company}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setSelectedCompanies(selectedCompanies.filter((c) => c !== company))}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                    {(salaryRange[0] > minSalary || salaryRange[1] < maxSalary) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            ${salaryRange[0].toLocaleString()} - ${salaryRange[1].toLocaleString()}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 ml-1"
                                onClick={() => setSalaryRange([minSalary, maxSalary])}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                    {titleSearch && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                            "{titleSearch}"
                            <Button variant="ghost" size="icon" className="h-4 w-4 p-0 ml-1" onClick={() => setTitleSearch("")}>
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )
}
