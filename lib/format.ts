export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency", // Specifies the number format as currency
    currency: "USD", // Specifies the currency as USD
  }).format(price); // Formats the provided price value into USD currency
}
