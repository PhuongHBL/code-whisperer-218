/** Response shape from `GET /options` — see `src/docs/apiResponse/options.md`. */
export interface FleetOptionsPayload {
  location: string[]
  competitor: string[]
  car_category: string[]
  car_brand: string[]
  fuel_type: string[]
  transmission: string[]
  mileage_type: string[]
  pay_when: string[]
  rental_duration: {
    min: number
    max: number
    default: number
  }
}

export interface FleetOptionsApiResponse {
  status: string
  options: FleetOptionsPayload
}
