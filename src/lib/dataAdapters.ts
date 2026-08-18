import { workspace } from '../data/demoData.ts'
import type { CampaignProfile, DataAdapter, WorkspaceProfile } from '../data/types.ts'

export class DemoDataAdapter implements DataAdapter {
  mode = 'Demo' as const

  async getWorkspace(): Promise<WorkspaceProfile> {
    return structuredClone(workspace)
  }

  async getCampaign(id: string): Promise<CampaignProfile> {
    const campaign = workspace.campaigns.find((item) => item.id === id)
    if (!campaign) throw new Error(`Campaign ${id} was not found in the demo fixture.`)
    return structuredClone(campaign)
  }
}

export class GoogleAdsDataAdapter implements DataAdapter {
  mode = 'Live' as const

  async getWorkspace(): Promise<WorkspaceProfile> {
    throw new Error('Live mode requires Google OAuth Client, Developer Token and Google Ads API credentials.')
  }

  async getCampaign(_id: string): Promise<CampaignProfile> {
    throw new Error('Live mode is not configured. See .env.example and README.md.')
  }
}

export const demoAdapter = new DemoDataAdapter()
