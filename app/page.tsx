"use client"

import { useState } from "react"
import { BarChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileUploader } from "../components/file-uploader"
import { JobsTable } from "../components/jobs-table"
import { LocationChart } from "../components/location-chart"
import { SalaryChart } from "../components/salary-chart"
import { CompanyChart } from "../components/company-chart"
import { JobTitleChart } from "../components/job-title-chart"
import { DashboardFilters } from "../components/dashboard-filters"

export default function Dashboard() {
  const [jobData, setJobData] = useState<any[]>([])
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      const parsedData = Array.isArray(data) ? data : []
      setJobData(parsedData)
      setFilteredData(parsedData)
    } catch (error) {
      console.error("Error parsing JSON file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b px-5 bg-background bg-white">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <BarChart className="h-6 w-6" />
              <h1 className="text-xl font-bold">Job Data Dashboard</h1>
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="px-5 py-4">
            {jobData.length === 0 ? (
                <Card className="mx-auto max-w-md">
                  <CardHeader>
                    <CardTitle>Upload Job Data</CardTitle>
                    <CardDescription>Upload a JSON file containing job data to analyze.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
                  </CardContent>
                </Card>
            ) : (
                <>
                  {/*<Card className="mb-4">*/}
                  {/*  <CardHeader className="pb-2">*/}
                  {/*    <CardTitle>Filters</CardTitle>*/}
                  {/*    <CardDescription>Filter the job data by various criteria</CardDescription>*/}
                  {/*  </CardHeader>*/}
                  {/*  <CardContent>*/}
                  {/*    <DashboardFilters data={jobData} onFilterChange={setFilteredData} />*/}
                  {/*  </CardContent>*/}
                  {/*</Card>*/}

                  <Tabs defaultValue="overview">
                    <div className="flex items-center justify-between">
                      <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="location">Location</TabsTrigger>
                        <TabsTrigger value="salary">Salary</TabsTrigger>
                        <TabsTrigger value="companies">Companies</TabsTrigger>
                        <TabsTrigger value="jobs">Jobs</TabsTrigger>
                      </TabsList>
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-muted-foreground">
                          Showing {filteredData.length} of {jobData.length} jobs
                        </div>
                        <Button variant="outline" onClick={() => setJobData([])}>
                          Upload New Data
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-4 h-dvh">
                      <TabsContent value="overview" className="m-0">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle>Total Jobs</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-4xl font-bold">{filteredData.length}</div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle>Average Salary</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-4xl font-bold">
                                {filteredData.length > 0
                                    ? `$${Math.round(
                                        filteredData.reduce(
                                            (acc, job) => acc + ((job.salary?.min || 0) + (job.salary?.max || 0)) / 2,
                                            0,
                                        ) / filteredData.length,
                                    ).toLocaleString()}`
                                    : "N/A"}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle>Unique Locations</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-4xl font-bold">
                                {new Set(filteredData.map((job) => job.location)).size}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          <Card className="col-span-1">
                            <CardHeader>
                              <CardTitle>Jobs by Location</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <LocationChart data={filteredData} />
                            </CardContent>
                          </Card>
                          <Card className="col-span-1">
                            <CardHeader>
                              <CardTitle>Salary Distribution</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <SalaryChart data={filteredData} />
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      <TabsContent value="location" className="m-0">
                        <Card>
                          <CardHeader>
                            <CardTitle>Jobs by Location</CardTitle>
                            <CardDescription>Distribution of job postings across different locations</CardDescription>
                          </CardHeader>
                          <CardContent className="h-dvh">
                            <LocationChart data={filteredData} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="salary" className="m-0">
                        <Card>
                          <CardHeader>
                            <CardTitle>Salary Analysis</CardTitle>
                            <CardDescription>Salary distribution across job postings</CardDescription>
                          </CardHeader>
                          <CardContent className="h-dvh">
                            <SalaryChart data={filteredData} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="companies" className="m-0">
                        <Card>
                          <CardHeader>
                            <CardTitle>Company Analysis</CardTitle>
                            <CardDescription>Job postings by company</CardDescription>
                          </CardHeader>
                          <CardContent className="h-dvh">
                            <CompanyChart data={filteredData} />
                          </CardContent>
                        </Card>
                      </TabsContent>
                      <TabsContent value="jobs" className="m-0">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card className="md:col-span-1">
                            <CardHeader>
                              <CardTitle>Job Title Analysis</CardTitle>
                              <CardDescription>Salary by job title</CardDescription>
                            </CardHeader>
                            <CardContent className="h-dvh">
                              <JobTitleChart data={filteredData} />
                            </CardContent>
                          </Card>
                          <Card className="md:col-span-1">
                            <CardHeader>
                              <CardTitle>Job Listings</CardTitle>
                              <CardDescription>Detailed job information</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <JobsTable data={filteredData} />
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </>
            )}
          </div>
        </main>
      </div>
  )
}
