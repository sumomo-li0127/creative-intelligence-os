export type WindowKey = 'L30' | 'L14' | 'L7'
export type PlacementName = 'In-feed' | 'In-stream' | 'Shorts'
export type Confidence = 'High' | 'Medium' | 'Directional'
export type ActionStatus = 'Scale' | 'Refresh' | 'Re-cut' | 'Restrict placement' | 'Observe' | 'Budget risk'

export interface MetricWindow {
  spend: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  cvr: number
  cpa: number | null
  p50?: number
}

export interface PlacementWindow {
  spend: number
  conversions: number
  cpa: number | null
  share: number
}

export interface CreativeEvidence {
  hook: string
  productAction: string
  result: string
  cta: string
  implication: string
}

export interface Creative {
  id: string
  title: string
  category: 'IH-功能演示' | 'IH-KOL/UGC'
  url: string
  primaryPlacement: PlacementName
  status: ActionStatus
  confidence: Confidence
  windows: Record<WindowKey, MetricWindow>
  placements: Partial<Record<PlacementName, PlacementWindow>>
  evidence: CreativeEvidence
  risks: string[]
}

export interface Insight {
  id: string
  label: string
  title: string
  summary: string
  businessImpact: string
  supportingCreativeIds: string[]
  action: string
  confidence: Confidence
  severity: 'positive' | 'warning' | 'critical' | 'neutral'
}

export interface CampaignProfile {
  id: string
  market: string
  marketName: string
  language: string
  flag: string
  name: string
  stage: 'Prospecting' | 'Retargeting'
  targetCpa: number
  cutoff: string
  dateRange: Record<WindowKey, string>
  windows: Record<WindowKey, MetricWindow>
  placements: Record<WindowKey, Record<PlacementName, PlacementWindow>>
  creatives: Creative[]
  insights: Insight[]
  limitations: string[]
}

export interface WorkspaceProfile {
  name: string
  customerId: string
  currency: 'CNY'
  timezone: string
  mode: 'Demo' | 'Live'
  campaigns: CampaignProfile[]
}

export interface DataAdapter {
  mode: 'Demo' | 'Live'
  getWorkspace(): Promise<WorkspaceProfile>
  getCampaign(id: string): Promise<CampaignProfile>
}
