
import { Calendar } from "./components/ui/calendar"
import React from "react"

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-lg border"
      captionLayout="dropdown"
    />
  )
}

export default function App() {
  return (

    <div className="flex justify-center items-center h-screen gap-2">
      <h1 className="text-shadow-black" >Here is Home page</h1>
      {/* <CardDemo /> */}
      {/* <CalendarDemo /> */}
    </div>
  )
}
