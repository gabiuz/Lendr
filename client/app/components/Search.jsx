import Input from "./Input"

const formFields = {
  search : [
    { label: "Search", type: "text", id: 'search', placeholder: "What are you looking for?"},
    { label: "Search", type: "text", id: 'search', placeholder: "What are you looking for?"}
  ],
}

export default function Search() {
  return (
    <>
      {formFields.search.map((field) => (
      <Input
        key={field.id}
        label={field.label}
        type="text"
        placeholder={field.placeholder}
        name={field.id}
        id={field.id}
        required={true}
        containerClassName="w-auto font-semibold"
      ></Input>
    ))}
    </>
  )
}
