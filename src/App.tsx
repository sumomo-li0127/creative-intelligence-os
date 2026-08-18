import { useEffect, useMemo, useState } from 'react'
import { workspace } from './data/demoData.ts'
import type { CampaignProfile, Creative, Insight, PlacementName, WindowKey } from './data/types.ts'
import { cpaTrend, creativeScore, currency, delta, diagnosticTags, number, percent, performanceLabel, selectedCreatives, windows } from './lib/diagnostics.ts'

type Page = 'command' | 'setup' | 'generate' | 'creatives' | 'lab' | 'report' | 'case-study'

type IconName = 'grid' | 'plug' | 'spark' | 'film' | 'lab' | 'report' | 'case' | 'arrow' | 'check' | 'alert' | 'play' | 'external'

const iconPaths: Record<IconName, string> = {
  grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  plug: 'M8 3v4m8-4v4M6 7h12v3a6 6 0 0 1-12 0V7Zm6 9v5',
  spark: 'm12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z',
  film: 'M4 5h16v14H4V5Zm4 0v14m8-14v14M4 9h4m8 0h4M4 15h4m8 0h4',
  lab: 'M9 3h6m-5 0v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3m-6 12h8',
  report: 'M6 3h9l3 3v15H6V3Zm9 0v4h4M9 11h6m-6 4h6m-6 4h4',
  case: 'M4 6h16v14H4V6Zm4 0V4h8v2M4 11h16M10 11v2h4v-2',
  arrow: 'M5 12h14m-5-5 5 5-5 5',
  check: 'm5 12 4 4L19 6',
  alert: 'M12 3 2.5 20h19L12 3Zm0 6v5m0 3v.5',
  play: 'm9 7 8 5-8 5V7Z',
  external: 'M14 4h6v6m0-6-9 9M19 13v7H4V5h7',
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={iconPaths[name]} /></svg>
}

const navItems: { id: Page; label: string; icon: IconName; section?: string }[] = [
  { id: 'command', label: 'Command center', icon: 'grid', section: 'Workspace' },
  { id: 'setup', label: 'Data setup', icon: 'plug' },
  { id: 'generate', label: 'Generate insights', icon: 'spark' },
  { id: 'creatives', label: 'Creative diagnosis', icon: 'film', section: 'Analysis' },
  { id: 'lab', label: 'Creative lab', icon: 'lab' },
  { id: 'report', label: 'Insight report', icon: 'report', section: 'Output' },
  { id: 'case-study', label: 'Portfolio case study', icon: 'case' },
]

function Badge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function SparkBars({ campaign }: { campaign: CampaignProfile }) {
  const bars = cpaTrend(campaign)
  return <div className="spark-bars" aria-label="CPA trend">
    {bars.map((height, index) => <span key={windows[index]} style={{ height }} className={index === 2 ? 'is-current' : ''} />)}
  </div>
}

function WindowToggle({ value, onChange }: { value: WindowKey; onChange: (value: WindowKey) => void }) {
  return <div className="segmented">{windows.map((item) => <button className={value === item ? 'active' : ''} onClick={() => onChange(item)} key={item}>{item}</button>)}</div>
}

function StatusBadge({ status }: { status: Creative['status'] }) {
  const tone = status === 'Scale' ? 'positive' : status === 'Budget risk' ? 'critical' : status === 'Refresh' || status === 'Re-cut' ? 'warning' : 'neutral'
  return <Badge tone={tone}>{status}</Badge>
}

function ConfidenceBadge({ value }: { value: Creative['confidence'] }) {
  return <span className={`confidence confidence-${value.toLowerCase()}`}><span />{value}</span>
}

function MetricCard({ label, value, note, tone, children }: { label: string; value: string; note: string; tone?: string; children?: React.ReactNode }) {
  return <article className={`metric-card ${tone ? `metric-${tone}` : ''}`}>
    <div className="metric-top"><span>{label}</span>{children}</div>
    <strong>{value}</strong>
    <p>{note}</p>
  </article>
}

function InsightCard({ insight, campaign, onOpen }: { insight: Insight; campaign: CampaignProfile; onOpen: () => void }) {
  const assets = insight.supportingCreativeIds.map((id) => campaign.creatives.find((item) => item.id === id)).filter(Boolean) as Creative[]
  return <article className={`insight-card insight-${insight.severity}`}>
    <div className="insight-head"><Badge tone={insight.severity}>{insight.label}</Badge><ConfidenceBadge value={insight.confidence} /></div>
    <h3>{insight.title}</h3>
    <p>{insight.summary}</p>
    <div className="impact-line"><span>Business impact</span><strong>{insight.businessImpact}</strong></div>
    <div className="support-stack">{assets.map((asset) => <span key={asset.id}>{asset.title.slice(0, 34)}{asset.title.length > 34 ? '…' : ''}</span>)}</div>
    <button className="text-button" onClick={onOpen}>View evidence <Icon name="arrow" size={16} /></button>
  </article>
}

function PlacementPanel({ campaign, windowKey }: { campaign: CampaignProfile; windowKey: WindowKey }) {
  const items = Object.entries(campaign.placements[windowKey]) as [PlacementName, CampaignProfile['placements'][WindowKey][PlacementName]][]
  const maxSpend = Math.max(...items.map(([, value]) => value.spend), 1)
  return <div className="placement-list">
    {items.map(([name, value]) => {
      const ratio = value.cpa ? value.cpa / campaign.targetCpa : 99
      const tone = ratio <= 1 ? 'positive' : ratio <= 1.7 ? 'warning' : 'critical'
      return <div className="placement-row" key={name}>
        <div className="placement-name"><span>{name}</span><small>{percent(value.share, 0)} spend share</small></div>
        <div className="placement-bar"><span style={{ width: `${Math.max(4, value.spend / maxSpend * 100)}%` }} /></div>
        <div className="placement-values"><strong>{currency(value.cpa)}</strong><Badge tone={tone}>{number(value.conversions, 1)} conv</Badge></div>
      </div>
    })}
  </div>
}

function CommandPage({ campaign, setPage }: { campaign: CampaignProfile; setPage: (page: Page) => void }) {
  const status = performanceLabel(campaign)
  const cpaChange = delta(campaign.windows.L7.cpa, campaign.windows.L30.cpa)
  const risks = campaign.creatives.filter((item) => item.status === 'Budget risk' || item.status === 'Refresh').length
  const opportunities = campaign.creatives.filter((item) => item.status === 'Scale').length
  const [windowKey, setWindowKey] = useState<WindowKey>('L7')
  const topCreatives = selectedCreatives(campaign)
  return <>
    <section className="page-heading">
      <div><div className="eyebrow">Decision workspace / {campaign.marketName}</div><h1>Turn signals into <em>creative decisions.</em></h1><p>Business-aware diagnosis across performance, placement and video content.</p></div>
      <button className="primary-button" onClick={() => setPage('generate')}><Icon name="spark" /> Generate latest insights</button>
    </section>

    <div className="context-strip">
      <div><span className="live-dot" /> Demo data verified</div><div>Last complete date <strong>{campaign.cutoff}</strong></div><div>{campaign.stage}</div><div>Target CPA <strong>{currency(campaign.targetCpa)}</strong></div>
    </div>

    <section className="metric-grid">
      <MetricCard label="L7 CPA" value={currency(campaign.windows.L7.cpa)} note={`${cpaChange && cpaChange > 0 ? '+' : ''}${cpaChange ? percent(cpaChange, 0) : '—'} vs L30`} tone={status.tone}><SparkBars campaign={campaign} /></MetricCard>
      <MetricCard label="L7 conversions" value={number(campaign.windows.L7.conversions, 1)} note={`${currency(campaign.windows.L7.spend)} spend`} />
      <MetricCard label="Decision risks" value={String(risks)} note="Creative or allocation risks"><span className="metric-icon critical"><Icon name="alert" /></span></MetricCard>
      <MetricCard label="Scale signals" value={String(opportunities)} note="Evidence-backed opportunities"><span className="metric-icon positive"><Icon name="check" /></span></MetricCard>
    </section>

    <section className="dashboard-grid">
      <article className="panel panel-wide">
        <div className="panel-head"><div><span className="panel-kicker">Campaign health</span><h2>CPA rises faster than purchase intent</h2></div><WindowToggle value={windowKey} onChange={setWindowKey} /></div>
        <div className="trend-layout">
          <div className="trend-chart">
            {windows.map((key) => {
              const item = campaign.windows[key]
              const max = Math.max(...windows.map((window) => campaign.windows[window].cpa ?? 0), 1)
              return <div className="trend-column" key={key}><div className="trend-value">{currency(item.cpa)}</div><div className="trend-track"><span style={{ height: `${Math.max(10, (item.cpa ?? 0) / max * 100)}%` }} className={(item.cpa ?? 0) > campaign.targetCpa ? 'over-target' : ''} /></div><strong>{key}</strong><small>{number(item.conversions, 1)} conv</small></div>
            })}
            <div className="target-line" style={{ bottom: `${Math.min(82, campaign.targetCpa / Math.max(...windows.map((key) => campaign.windows[key].cpa ?? 0), 1) * 100)}%` }}><span>Target {currency(campaign.targetCpa)}</span></div>
          </div>
          <div className="diagnosis-note"><Badge tone={status.tone}>{status.label}</Badge><h3>{campaign.insights[0].title}</h3><p>{campaign.insights[0].businessImpact}</p><button className="secondary-button" onClick={() => setPage('report')}>Open full diagnosis</button></div>
        </div>
      </article>
      <article className="panel">
        <div className="panel-head"><div><span className="panel-kicker">Placement fit</span><h2>{windowKey} allocation</h2></div></div>
        <PlacementPanel campaign={campaign} windowKey={windowKey} />
      </article>
    </section>

    <section className="section-block">
      <div className="section-head"><div><span className="panel-kicker">Decision feed</span><h2>What needs action now</h2></div><button className="text-button" onClick={() => setPage('report')}>Full report <Icon name="arrow" size={16} /></button></div>
      <div className="insight-grid">{campaign.insights.map((insight) => <InsightCard insight={insight} campaign={campaign} onOpen={() => setPage('report')} key={insight.id} />)}</div>
    </section>

    <section className="panel creative-preview-panel">
      <div className="section-head"><div><span className="panel-kicker">Creative triage</span><h2>Evidence-backed priorities</h2></div><button className="text-button" onClick={() => setPage('creatives')}>All creatives <Icon name="arrow" size={16} /></button></div>
      <div className="creative-preview-list">{topCreatives.map((item) => <div className="creative-preview-row" key={item.id}><div className="rank-score">{creativeScore(item, campaign.targetCpa)}</div><div className="creative-title-cell"><strong>{item.title}</strong><small>Asset {item.id} · {item.primaryPlacement}</small></div><StatusBadge status={item.status} /><div><small>L30 spend</small><strong>{currency(item.windows.L30.spend)}</strong></div><div><small>L30 conv</small><strong>{number(item.windows.L30.conversions, 1)}</strong></div><div><small>L7 CPA</small><strong>{currency(item.windows.L7.cpa)}</strong></div><ConfidenceBadge value={item.confidence} /></div>)}</div>
    </section>
  </>
}

function SetupPage({ selectedIds, setSelectedIds, targets, setTargets, setPage }: { selectedIds: string[]; setSelectedIds: (ids: string[]) => void; targets: Record<string, number>; setTargets: (value: Record<string, number>) => void; setPage: (page: Page) => void }) {
  const [showLive, setShowLive] = useState(false)
  const toggle = (id: string) => setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id])
  return <>
    <section className="page-heading compact"><div><div className="eyebrow">One-time configuration</div><h1>Three inputs. <em>One repeatable workflow.</em></h1><p>Connect an account, select campaigns and define the business guardrail.</p></div></section>
    <div className="setup-steps">
      <article className="setup-card complete"><span className="step-index">01</span><div><Badge tone="positive">Demo connected</Badge><h2>Google Ads account</h2><p>{workspace.name}<br />{workspace.customerId} · {workspace.currency} · {workspace.timezone}</p></div><button className="secondary-button" onClick={() => setShowLive(!showLive)}>Configure live</button></article>
      {showLive && <article className="credential-panel"><Icon name="plug" size={22} /><div><strong>Live mode prerequisites</strong><p>Google OAuth Client ID, Client Secret, Developer Token and login customer ID. The app never presents Demo data as a live connection.</p><code>GOOGLE_ADS_DEVELOPER_TOKEN=••••••••</code></div></article>}
      <article className="setup-card"><span className="step-index">02</span><div className="setup-content"><Badge tone="neutral">{selectedIds.length} selected</Badge><h2>Campaign scope</h2><p>Confirm market and funnel stage once. The mapping is reused every reporting cycle.</p><div className="campaign-check-grid">{workspace.campaigns.map((campaign) => <label className={selectedIds.includes(campaign.id) ? 'campaign-check selected' : 'campaign-check'} key={campaign.id}><input type="checkbox" checked={selectedIds.includes(campaign.id)} onChange={() => toggle(campaign.id)} /><span className="market-avatar">{campaign.flag}</span><span><strong>{campaign.marketName}</strong><small>{campaign.stage}</small></span><Icon name="check" /></label>)}</div></div></article>
      <article className="setup-card"><span className="step-index">03</span><div className="setup-content"><Badge tone="warning">Business guardrail</Badge><h2>Target CPA</h2><p>Without a Target CPA the system can only rank relative performance, not judge business viability.</p><div className="target-grid">{workspace.campaigns.filter((campaign) => selectedIds.includes(campaign.id)).map((campaign) => <label key={campaign.id}><span>{campaign.flag} · {campaign.marketName}</span><div><small>¥</small><input type="number" value={targets[campaign.id]} onChange={(event) => setTargets({...targets,[campaign.id]:Number(event.target.value)})} /></div></label>)}</div></div></article>
    </div>
    <div className="sticky-action"><div><strong>Yuelin DG Purchase template</strong><span>CPA + conversion volume · L30/L14/L7 · 3 placements · Completed days only</span></div><button className="primary-button" onClick={() => setPage('generate')}>Save & continue <Icon name="arrow" /></button></div>
  </>
}

const generationSteps = ['Validate campaign scope', 'Pull L30 / L14 / L7', 'Normalize placement & asset data', 'Run deterministic diagnostics', 'Assemble evidence-backed report']

function GeneratePage({ selectedIds, setPage }: { selectedIds: string[]; setPage: (page: Page) => void }) {
  const [progress, setProgress] = useState(-1)
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (progress < 0 || progress >= generationSteps.length) return
    const timer = window.setTimeout(() => {
      if (progress === generationSteps.length - 1) setDone(true)
      else setProgress(progress + 1)
    }, 520)
    return () => window.clearTimeout(timer)
  }, [progress])
  const start = () => { setDone(false); setProgress(0) }
  return <>
    <section className="page-heading compact"><div><div className="eyebrow">One-click recurring workflow</div><h1>Generate the <em>latest complete signal.</em></h1><p>Live mode would end on Jul 29, 2026. Demo mode preserves each verified case-study cutoff.</p></div></section>
    <div className="generate-layout">
      <article className="generate-card">
        <div className="generate-orbit"><div><Icon name="spark" size={30} /></div><span /><span /><span /></div>
        <Badge tone="positive">Ready</Badge><h2>{selectedIds.length} campaigns · 6 markets</h2><p>Nested L30/L14/L7 windows, Campaign → Placement → Asset evidence, no partial-day data.</p>
        <div className="generate-summary"><div><span>North stars</span><strong>CPA + Conversion volume</strong></div><div><span>Explain with</span><strong>Spend · CTR · CPC · CvR · p50</strong></div><div><span>Placements</span><strong>In-feed · In-stream · Shorts</strong></div></div>
        <button className="primary-button large" onClick={start} disabled={progress >= 0 && !done}>{done ? 'Generate again' : progress >= 0 ? 'Generating…' : 'Generate latest insights'} <Icon name="spark" /></button>
      </article>
      <article className="generation-log panel">
        <div className="panel-head"><div><span className="panel-kicker">Evidence pipeline</span><h2>Generation log</h2></div><Badge tone={done ? 'positive' : 'neutral'}>{done ? 'Complete' : progress >= 0 ? 'Running' : 'Waiting'}</Badge></div>
        <div className="step-list">{generationSteps.map((step, index) => <div className={done || index < progress ? 'step done' : index === progress ? 'step active' : 'step'} key={step}><span>{done || index < progress ? <Icon name="check" size={15} /> : index + 1}</span><div><strong>{step}</strong><small>{index === 3 ? 'Rules first. Language model only structures evidence.' : index === 4 ? 'Conclusion → data → content evidence → action.' : 'Traceable structured data.'}</small></div></div>)}</div>
        {done && <div className="generation-result"><Icon name="check" /><div><strong>Report ready</strong><p>12 decision cards · 18 supporting creatives · 14 explicit limitations</p></div><button className="secondary-button" onClick={() => setPage('command')}>Open workspace</button></div>}
      </article>
    </div>
  </>
}

function CreativesPage({ campaign, onSelect }: { campaign: CampaignProfile; onSelect: (creative: Creative) => void }) {
  const [windowKey, setWindowKey] = useState<WindowKey>('L7')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const rows = selectedCreatives(campaign).filter((item) => (status === 'All' || item.status === status) && item.title.toLowerCase().includes(query.toLowerCase()))
  return <>
    <section className="page-heading compact"><div><div className="eyebrow">Campaign → Placement → Asset</div><h1>Creative <em>diagnosis.</em></h1><p>Rank by business evidence, not vanity metrics.</p></div><WindowToggle value={windowKey} onChange={setWindowKey} /></section>
    <div className="filter-bar"><div className="search-box">⌕<input placeholder="Search title or asset ID" value={query} onChange={(event) => setQuery(event.target.value)} /></div><div className="filter-pills">{['All','Scale','Refresh','Re-cut','Restrict placement','Budget risk'].map((item) => <button className={status === item ? 'active' : ''} onClick={() => setStatus(item)} key={item}>{item}</button>)}</div><Badge tone="neutral">{rows.length} assets</Badge></div>
    <article className="creative-table panel"><div className="table-row table-header"><div>Score / creative</div><div>Status</div><div>{windowKey} spend</div><div>{windowKey} conv</div><div>{windowKey} CPA</div><div>CTR / CvR</div><div>Confidence</div><div /></div>{rows.map((item) => {
      const metric = item.windows[windowKey]
      return <button className="table-row" key={item.id} onClick={() => onSelect(item)}><div className="creative-name"><span className="score-ring">{creativeScore(item,campaign.targetCpa)}</span><span><strong>{item.title}</strong><small>{item.category} · {item.primaryPlacement} · {item.id}</small><span className="mini-tags">{diagnosticTags(item,campaign.targetCpa).slice(0,2).map((tag) => <em key={tag}>{tag}</em>)}</span></span></div><div><StatusBadge status={item.status} /></div><div><strong>{currency(metric.spend)}</strong></div><div><strong>{number(metric.conversions,1)}</strong></div><div><strong className={metric.cpa && metric.cpa > campaign.targetCpa * 1.5 ? 'danger-text' : ''}>{currency(metric.cpa)}</strong></div><div><strong>{percent(metric.ctr)}</strong><small>{percent(metric.cvr)} CvR</small></div><div><ConfidenceBadge value={item.confidence} /></div><div><Icon name="arrow" /></div></button>})}</article>
  </>
}

function youtubeId(url: string) { return new URL(url).searchParams.get('v') ?? '' }

function CreativeLabPage({ campaign, creative }: { campaign: CampaignProfile; creative: Creative }) {
  const [windowKey, setWindowKey] = useState<WindowKey>('L7')
  const item = creative.windows[windowKey]
  const videoId = youtubeId(creative.url)
  return <>
    <section className="page-heading compact"><div><div className="eyebrow">Creative lab / Asset {creative.id}</div><h1>Content evidence, <em>not title inference.</em></h1><p>{creative.title}</p></div><div className="heading-actions"><StatusBadge status={creative.status} /><WindowToggle value={windowKey} onChange={setWindowKey} /></div></section>
    <div className="lab-grid">
      <article className="video-card"><div className="video-frame" style={{backgroundImage:`linear-gradient(180deg,transparent 42%,rgba(4,6,8,.92)), url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`}}><a href={creative.url} target="_blank" rel="noreferrer" className="play-button"><Icon name="play" size={28} /></a><div className="video-label"><Badge tone="neutral">{creative.primaryPlacement}</Badge><strong>{creative.title}</strong><span>Open verified YouTube asset <Icon name="external" size={14} /></span></div></div><div className="video-meta"><span>Source <strong>Google Ads asset</strong></span><span>Content review <strong>Transcript + keyframes</strong></span><span>Format <strong>Placement-aware</strong></span></div></article>
      <article className="panel lab-metrics"><div className="panel-head"><div><span className="panel-kicker">Performance context</span><h2>{windowKey} evidence</h2></div><ConfidenceBadge value={creative.confidence} /></div><div className="lab-metric-grid"><div><span>Spend</span><strong>{currency(item.spend)}</strong></div><div><span>Conversions</span><strong>{number(item.conversions,1)}</strong></div><div><span>CPA</span><strong>{currency(item.cpa)}</strong></div><div><span>CvR</span><strong>{percent(item.cvr,2)}</strong></div><div><span>CPC</span><strong>{currency(item.cpc,2)}</strong></div><div><span>p50</span><strong>{item.p50 ? percent(item.p50) : '—'}</strong></div></div><div className="target-comparison"><span>vs target CPA</span><div><i style={{width:`${Math.min(100,(item.cpa ?? campaign.targetCpa*3)/(campaign.targetCpa*3)*100)}%`}} /></div><strong>{item.cpa ? `${Math.round(item.cpa/campaign.targetCpa*100)}%` : 'No stable signal'}</strong></div></article>
    </div>
    <article className="panel evidence-panel"><div className="panel-head"><div><span className="panel-kicker">Hook / Meat / CTA</span><h2>Evidence timeline</h2></div><Badge tone="positive">Human-reviewable</Badge></div><div className="evidence-timeline"><div><span>01</span><small>HOOK</small><strong>{creative.evidence.hook}</strong></div><div><span>02</span><small>PRODUCT ACTION</small><strong>{creative.evidence.productAction}</strong></div><div><span>03</span><small>VISIBLE RESULT</small><strong>{creative.evidence.result}</strong></div><div><span>04</span><small>CTA</small><strong>{creative.evidence.cta}</strong></div></div></article>
    <div className="decision-grid"><article className="panel action-card"><span className="panel-kicker">Creative implication</span><h2>{creative.evidence.implication}</h2><p>Action status</p><StatusBadge status={creative.status} /></article><article className="panel risk-card"><span className="panel-kicker">Risks & limitations</span><h2>Do not over-claim the signal.</h2>{creative.risks.map((risk) => <div key={risk}><Icon name="alert" size={16} />{risk}</div>)}</article></div>
  </>
}

function ReportPage({ campaign, onSelect }: { campaign: CampaignProfile; onSelect: (creative: Creative) => void }) {
  return <>
    <section className="page-heading compact"><div><div className="eyebrow">Meeting-ready output</div><h1>Insight report / <em>{campaign.marketName}</em></h1><p>{campaign.name} · Data through {campaign.cutoff}</p></div><button className="secondary-button" onClick={() => window.print()}>Export / Print</button></section>
    <article className="report-cover"><div><span>GLOBAL CREATIVE INTELLIGENCE</span><h2>{campaign.marketName}<br />Demand Gen Creative Learnings</h2><p>CPA + Conversion Volume · Placement-aware · Evidence-backed</p></div><div className="report-meta"><span>Campaign<strong>{campaign.id}</strong></span><span>Funnel<strong>{campaign.stage}</strong></span><span>Target CPA<strong>{currency(campaign.targetCpa)}</strong></span><span>Data through<strong>{campaign.cutoff}</strong></span></div></article>
    <article className="report-general panel"><span className="panel-kicker">General insights</span><div className="general-grid"><p>单条只传达一个问题、一个产品动作、一个结果和一个CTA。</p><p>CPA与Conversion Volume是North Star；CTR、CPC、CvR和p50用于解释。</p><p>本地相关性有效，但Meshy必须成为完成任务的必要步骤。</p><p>稳定出单优先于短期爆量；明确标记样本、疲劳、IP与预算风险。</p></div></article>
    {campaign.insights.map((insight,index) => {
      const assets = insight.supportingCreativeIds.map((id) => campaign.creatives.find((creative) => creative.id === id)).filter(Boolean) as Creative[]
      return <article className="report-section" key={insight.id}><div className="report-index">0{index+1}</div><div className="report-section-main"><Badge tone={insight.severity}>{insight.label}</Badge><h2>{insight.title}</h2><p className="report-summary">{insight.summary}</p><div className="report-impact"><span>Business impact</span><strong>{insight.businessImpact}</strong></div><h3>Supporting data</h3><div className="support-table"><div className="support-row support-head"><span>Creative</span><span>L30 spend</span><span>L30 conv / CPA</span><span>L7 conv / CPA</span><span>Decision</span></div>{assets.map((creative) => <button className="support-row" key={creative.id} onClick={() => onSelect(creative)}><span><strong>{creative.title}</strong><small>Asset {creative.id}</small></span><span>{currency(creative.windows.L30.spend)}</span><span>{number(creative.windows.L30.conversions,1)} / {currency(creative.windows.L30.cpa)}</span><span>{number(creative.windows.L7.conversions,1)} / {currency(creative.windows.L7.cpa)}</span><span><StatusBadge status={creative.status} /></span></button>)}</div><div className="report-evidence"><div><span>Content evidence</span>{assets.map((creative) => <p key={creative.id}><strong>{creative.title.slice(0,28)}:</strong> {creative.evidence.hook} {creative.evidence.productAction} {creative.evidence.result}</p>)}</div><div><span>Creative implication</span><h3>{insight.action}</h3><ConfidenceBadge value={insight.confidence} /></div></div></div></article>
    })}
    <article className="panel limitations"><span className="panel-kicker">Confidence & limitations</span>{campaign.limitations.map((item) => <p key={item}><Icon name="alert" size={16} />{item}</p>)}</article>
  </>
}

function CaseStudyPage() {
  const capabilities = [
    ['懂生意','Business Context把Target CPA、漏斗阶段和市场约束放在分析之前。'],['强数据归因','Campaign → Placement → Asset，规则优先并公开归因边界。'],['素材洞察','把Hook / 产品动作 / 可见结果 / CTA与表现证据放在同一页。'],['落地能力','每条结论输出Scale、Refresh、Re-cut或Placement动作。'],['风险控制','区分高Spend零转化与低样本，标记疲劳、IP和预算风险。'],['跨文化认知','六市场共用框架，但保留本地Creator、用途和漏斗差异。'],
  ]
  return <>
    <section className="case-hero"><Badge tone="positive">Portfolio case study</Badge><h1>From ad metrics to<br /><em>creative decisions.</em></h1><p>I designed and vibe-coded a decision system that connects Google Ads performance, placement behavior, video content and business guardrails—turning fragmented analysis into a repeatable global creative workflow.</p><div className="case-stats"><div><strong>6</strong><span>Markets</span></div><div><strong>3</strong><span>Placement contexts</span></div><div><strong>3</strong><span>Decision windows</span></div><div><strong>1</strong><span>Repeatable system</span></div></div></section>
    <section className="case-section"><div className="case-label">01 / Challenge</div><div><h2>The problem was not a lack of dashboards.</h2><p>Creative analysis lived across Google Ads exports, YouTube videos, subtitles and market context. Surface metrics could not answer whether a decline came from attention decay, purchase-intent loss, placement mismatch or insufficient evidence.</p><blockquote>How might we turn performance data and content evidence into an action a creative team can actually produce?</blockquote></div></section>
    <section className="case-section"><div className="case-label">02 / System</div><div><h2>A closed decision loop—not an AI report wrapper.</h2><div className="process-flow">{['Business context','Google Ads data','Rule diagnosis','Content evidence','Creative action'].map((item,index) => <div key={item}><span>0{index+1}</span><strong>{item}</strong>{index<4 && <Icon name="arrow" />}</div>)}</div><p>Deterministic rules produce the diagnosis. The language layer is only allowed to structure conclusions from traceable metrics and reviewed video evidence.</p></div></section>
    <section className="case-section"><div className="case-label">03 / Capability proof</div><div><h2>Commercial thinking made visible in the product.</h2><div className="capability-grid">{capabilities.map(([title,text]) => <article key={title}><span>{title}</span><p>{text}</p></article>)}</div></div></section>
    <section className="case-section"><div className="case-label">04 / Architecture</div><div><h2>Demo-ready today. Live-data ready by design.</h2><div className="architecture"><div><small>INPUT</small><strong>Google Ads OAuth / Demo fixture</strong><span>Business profile · Campaign scope</span></div><Icon name="arrow" /><div><small>ENGINE</small><strong>Normalization + deterministic rules</strong><span>Sample · fatigue · placement · risk</span></div><Icon name="arrow" /><div><small>OUTPUT</small><strong>Decision workspace</strong><span>Report · creative brief · experiment</span></div></div><p className="case-note">Live mode requires OAuth credentials and a Google Ads Developer Token. Demo mode is explicitly labelled and uses the verified six-market case data.</p></div></section>
    <section className="case-section"><div className="case-label">05 / Integrity</div><div><h2>What the system refuses to pretend it knows.</h2><div className="integrity-list"><p><Icon name="check" /> p50 may be inherited from a parent ad; it is explanatory, not an asset-level north star.</p><p><Icon name="check" /> Audience cannot reliably be attributed to video × audience below Ad Group.</p><p><Icon name="check" /> A recent zero conversion with low spend is not automatically creative fatigue.</p><p><Icon name="check" /> Without GA4/CRM data, landing-page and backend causes remain hypotheses.</p></div></div></section>
  </>
}

function App() {
  const [page, setPage] = useState<Page>('command')
  const [campaignId, setCampaignId] = useState(workspace.campaigns[0].id)
  const campaign = useMemo(() => workspace.campaigns.find((item) => item.id === campaignId) ?? workspace.campaigns[0], [campaignId])
  const [selectedCreativeId, setSelectedCreativeId] = useState(campaign.creatives[0].id)
  const selectedCreative = campaign.creatives.find((item) => item.id === selectedCreativeId) ?? campaign.creatives[0]
  const [selectedIds, setSelectedIds] = useState(workspace.campaigns.map((item) => item.id))
  const [targets, setTargets] = useState<Record<string,number>>(Object.fromEntries(workspace.campaigns.map((item) => [item.id,item.targetCpa])))
  const selectCreative = (creative: Creative) => { setSelectedCreativeId(creative.id); setPage('lab') }
  const changeCampaign = (id: string) => { setCampaignId(id); const next = workspace.campaigns.find((item) => item.id === id); if (next) setSelectedCreativeId(next.creatives[0].id) }
  return <div className="app-shell">
    <aside className="sidebar">
      <button className="brand" onClick={() => setPage('command')}><span>CI</span><div><strong>Creative Intelligence</strong><small>GLOBAL OPERATING SYSTEM</small></div></button>
      <nav>{navItems.map((item) => <div key={item.id}>{item.section && <span className="nav-section">{item.section}</span>}<button className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)}><Icon name={item.icon} /><span>{item.label}</span>{item.id === 'generate' && <i />}</button></div>)}</nav>
      <div className="sidebar-foot"><div className="user-avatar">YL</div><div><strong>Yuelin Li</strong><small>Portfolio workspace</small></div><button>•••</button></div>
    </aside>
    <main>
      <header className="topbar"><div className="crumb"><span>{workspace.name}</span><b>/</b><strong>{campaign.marketName}</strong></div><div className="top-actions"><Badge tone="warning">DEMO MODE</Badge><label className="campaign-select"><span className="market-avatar small">{campaign.flag}</span><select value={campaignId} onChange={(event) => changeCampaign(event.target.value)}>{workspace.campaigns.map((item) => <option value={item.id} key={item.id}>{item.marketName} · {item.stage}</option>)}</select></label></div></header>
      <div className="page-wrap">
        {page === 'command' && <CommandPage campaign={campaign} setPage={setPage} />}
        {page === 'setup' && <SetupPage selectedIds={selectedIds} setSelectedIds={setSelectedIds} targets={targets} setTargets={setTargets} setPage={setPage} />}
        {page === 'generate' && <GeneratePage selectedIds={selectedIds} setPage={setPage} />}
        {page === 'creatives' && <CreativesPage campaign={campaign} onSelect={selectCreative} />}
        {page === 'lab' && <CreativeLabPage campaign={campaign} creative={selectedCreative} />}
        {page === 'report' && <ReportPage campaign={campaign} onSelect={selectCreative} />}
        {page === 'case-study' && <CaseStudyPage />}
      </div>
    </main>
  </div>
}

export default App
