import { APIResponse } from "."

type FNGData = {
  value: string
  value_classification: string
  timestamp: string
  time_until_update: string
}

export type FNGResponse = APIResponse<FNGData>
