import type { CampaignProfile, Creative, WindowKey } from '../data/types.ts'

export const windows: WindowKey[] = ['L30', 'L14', 'L7']

export const currency = (value: number | null, digits = 0) => {
  if (value === null || !Number.isFinite(value)) return '—'
  return `¥${value.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })}`
}

export const number = (value: number, digits = 0) => {
  if (value > 0 && value < 0.1) return '<0.1'
  return value.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits })
}

export const percent = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`

export const delta = (current: number | null, base: number | null) => {
  if (!current || !base) return null
  return (current - base) / base
}

export const performanceLabel = (campaign: CampaignProfile) => {
  const recent = campaign.windows.L7.cpa
  if (!recent) return { label: 'No stable signal', tone: 'neutral' }
  const ratio = recent / campaign.targetCpa
  if (ratio <= .85) return { label: 'Above target', tone: 'positive' }
  if (ratio <= 1.15) return { label: 'Near target', tone: 'neutral' }
  if (ratio <= 1.8) return { label: 'Needs attention', tone: 'warning' }
  return { label: 'Critical gap', tone: 'critical' }
}

export const cpaTrend = (campaign: CampaignProfile) => {
  const values = windows.map((key) => campaign.windows[key].cpa ?? 0)
  const max = Math.max(...values, 1)
  return values.map((value) => Math.max(8, (value / max) * 52))
}

export const creativeScore = (creative: Creative, targetCpa: number) => {
  const recent = creative.windows.L7
  const long = creative.windows.L30
  const effectiveCpa = recent.conversions >= 1 && recent.cpa ? recent.cpa : long.cpa ?? targetCpa * 3
  const efficiency = Math.max(0, Math.min(100, 100 - (effectiveCpa / targetCpa - .5) * 55))
  const volume = Math.min(100, Math.log10(long.conversions + 1) * 52)
  const confidence = creative.confidence === 'High' ? 100 : creative.confidence === 'Medium' ? 68 : 38
  return Math.round(efficiency * .5 + volume * .3 + confidence * .2)
}

export const diagnosticTags = (creative: Creative, targetCpa: number) => {
  const tags: string[] = []
  const l30 = creative.windows.L30
  const l7 = creative.windows.L7
  if (l7.cpa && l7.cpa <= targetCpa) tags.push('Efficient L7')
  if (l30.conversions >= 10) tags.push('Proven volume')
  if (l7.spend >= targetCpa * 2 && l7.conversions < .1) tags.push('High-spend zero-conv')
  if (l7.cpc > l30.cpc * 1.7 && l7.cvr < l30.cvr * .45) tags.push('Dual fatigue signal')
  if (l30.p50 && l7.p50 && l7.p50 >= l30.p50 && l7.cvr < l30.cvr * .4) tags.push('Watch ≠ purchase')
  if (l30.conversions < 3) tags.push('Low sample')
  return tags
}

export const selectedCreatives = (campaign: CampaignProfile) => {
  return [...campaign.creatives].sort((a, b) => creativeScore(b, campaign.targetCpa) - creativeScore(a, campaign.targetCpa))
}
