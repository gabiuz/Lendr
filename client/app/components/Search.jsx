import { fileURLToPath } from "url"
import Input from "./Input"

const formFields = {
  search : [
    { label: "Search", type: "text", id: 'search', placeholder: "What are you looking for?"},
    { label: "location", type: "text", id: 'location', placeholder: "What are you looking for?"},
    { label: "Start Date", type: "date", id: 'startDate', placeholder: "Add Date"},
    { label: "End Date", type: "date", id: 'endDate', placeholder: "Add Date"},
  ],
}

export default function Search() {
  return (
    <>
      {formFields.search.map((field) => (
      <Input
        key={field.id}
        label={field.label}
        type={field.type}
        placeholder={field.placeholder}
        name={field.id}
        id={field.id}
        required={false}
        containerClassName="font-semibold w-full lg:w-auto"
        className="w-full lg:w-48 xl:w-56 "
      ></Input>
    ))}
    </>
  )
}
