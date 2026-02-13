import { APIResponse } from "."

type OHCLData = {
  timestamp: number[]
  close: (number | null)[]
  high: (number | null)[]
  low: (number | null)[]
  open: (number | null)[]
  volume: (number | null)[]
}

export type OHCLResponse = APIResponse<OHCLData>
