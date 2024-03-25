const dollarSmallNumberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2
})

//eslint-disable-next-line
const isIncorrectNumber = (num: number) => num === -0 || Number.isNaN(num)

export const formatPrice = (num: number): string => dollarSmallNumberFormatter.format(isIncorrectNumber(num) ? 0 : num)
