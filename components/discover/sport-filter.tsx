"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const SPORTS = [
  "All Sports",
  "Football",
  "Basketball",
  "Tennis",
  "Baseball",
  "Formula 1",
  "MMA",
  "Boxing"
]

interface SportFilterProps {
  value: string
  onChange: (value: string) => void
}

export function SportFilter({ value, onChange }: SportFilterProps) {
  return (
    <div className="w-[180px]">
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-background">
          <SelectValue placeholder="Select Sport" />
        </SelectTrigger>
        <SelectContent>
          {SPORTS.map((sport) => (
            <SelectItem key={sport} value={sport.toLowerCase()}>
              {sport}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}