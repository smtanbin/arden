export const formatDateString = (input: string | number | Date) =>
  formatDate(new Date(input))

export const formatDate = (input: string | number | Date) => {
  const date = new Date(input)
  const day = date.getDate()
  const month = date.toLocaleString("default", { month: "short" })
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

// Account Number format
export const checkAccountNumber = (str: string) =>
  str.startsWith("108") ? str : alert("Please enter a valid account number")
