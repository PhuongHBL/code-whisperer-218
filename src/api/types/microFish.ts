/** POST `/api/v1/miroshark/chat` — see `src/docs/apiResponse/microFish.md`. */
export interface MicroFishChatRequest {
  category: string
  company: string
  /** Calendar date as `yyyy-MM-dd` string in the JSON body (coerced before send). */
  selected_date: string
  location: string
}

export interface MicroFishChatResponse {
  response: string
  sources: unknown[]
  tool_calls: unknown[]
}
