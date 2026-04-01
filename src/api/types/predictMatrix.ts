export type PredictMatrixPoint = {
  date: string
  predicted_price: number
}

export type PredictMatrixRequest = {
  location: string
  car_category: string
  start_date: string
  end_date: string
  competitors: string[]
}

export type PredictMatrixResponse = {
  location: string
  car_category: string
  start_date: string
  end_date: string
  total_days: number
  currency: string
  model_used: string
  competitors: string[]
  matrix: Record<string, PredictMatrixPoint[]>
  cheapest_per_day?: Array<{
    date: string
    cheapest_company: string
    cheapest_price: number
  }>
}
