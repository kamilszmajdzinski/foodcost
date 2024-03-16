type FormType = {
  name: string
  weight: string
  unit: string
  price: string
}

export const mapFormToApi = ({ name, weight, unit, price }: FormType) => ({
  name,
  unit,
  price: (parseFloat(price) / parseFloat(weight)).toFixed(2),
})
