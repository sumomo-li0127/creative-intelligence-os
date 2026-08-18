import type { CampaignProfile, Creative, MetricWindow, PlacementWindow, WorkspaceProfile } from './types.ts'

const metric = (
  spend: number,
  conversions: number,
  cpa: number | null,
  ctr: number,
  cpc: number,
  cvr: number,
  p50?: number,
): MetricWindow => {
  const clicks = cpc > 0 ? Math.round(spend / cpc) : 0
  const impressions = ctr > 0 ? Math.round(clicks / ctr) : 0
  return { spend, impressions, clicks, conversions, ctr, cpc, cvr, cpa, p50 }
}

const placement = (spend: number, conversions: number, cpa: number | null, share: number): PlacementWindow => ({
  spend,
  conversions,
  cpa,
  share,
})

const creative = (item: Creative): Creative => item

const developed: CampaignProfile = {
  id: '23384782490', market: 'EN', marketName: 'Developed EN', language: 'English', flag: 'EN',
  name: 'Demand Gen - Purchase - Developed', stage: 'Prospecting', targetCpa: 800, cutoff: '2026-07-20',
  dateRange: { L30: 'Jun 21 – Jul 20', L14: 'Jul 07 – Jul 20', L7: 'Jul 14 – Jul 20' },
  windows: {
    L30: metric(187173, 329.5, 568, .0138, 3.37, .0059),
    L14: metric(93978, 113.1, 831, .0066, 10.95, .0132),
    L7: metric(51921, 43.3, 1198, .0070, 10.79, .0090),
  },
  placements: {
    L30: { 'In-feed': placement(105000, 190, 553, .56), 'In-stream': placement(62000, 111, 559, .33), Shorts: placement(20173, 28.5, 708, .11) },
    L14: { 'In-feed': placement(55000, 51, 1078, .59), 'In-stream': placement(29000, 43, 674, .31), Shorts: placement(9978, 19.1, 522, .10) },
    L7: { 'In-feed': placement(27258, 14, 1947, .53), 'In-stream': placement(17798, 22.5, 791, .34), Shorts: placement(6865, 18.6, 369, .13) },
  },
  creatives: [
    creative({
      id: '197142417849', title: 'Meshy Hack: Turn 2D Sketch into 3D Model in Seconds', category: 'IH-功能演示',
      url: 'https://www.youtube.com/watch?v=PzvqDkUKvsM', primaryPlacement: 'In-feed', status: 'Scale', confidence: 'High',
      windows: { L30: metric(48551,119.5,412,.0065,12.77,.031,.289), L14: metric(12732,18.6,686,.0054,18.24,.027,.302), L7: metric(5893,6.9,854,.0055,17.75,.021,.312) },
      placements: { 'In-feed': placement(42016,101,416,.76), 'In-stream': placement(7448,19,392,.24) },
      evidence: { hook: 'Sketch → 3D，首屏直接建立输入与结果。', productAction: '上传草图并点击Generate，真实UI清晰可见。', result: '多个3D模型证明不是单一案例。', cta: '产品导向明确。', implication: '保留结构，用新输入和本地用途持续刷新。' },
      risks: ['L7 CPA高于Target CPA', 'p50来自父广告层'],
    }),
    creative({
      id: '389512799264', title: 'How to Split Any 3D Model into Printable Parts in One Click', category: 'IH-功能演示',
      url: 'https://www.youtube.com/watch?v=fy322el7aDo', primaryPlacement: 'In-stream', status: 'Restrict placement', confidence: 'Medium',
      windows: { L30: metric(9667,9,995,.008,17.78,.018,.289), L14: metric(8955,9,995,.008,17.78,.018,.302), L7: metric(5823,4.5,1294,.008,18.14,.014,.312) },
      placements: { 'In-stream': placement(560,4,140,.12), 'In-feed': placement(7920,5,1584,.88) },
      evidence: { hook: '模型无法直接打印的专业问题。', productAction: 'Meshy一键拆分。', result: '得到可打印部件。', cta: '导向具体功能。', implication: '优先In-stream；将Auto Split提前到前5秒。' },
      risks: ['专业需求受众较窄', 'In-feed效率弱'],
    }),
    creative({
      id: '278334053365', title: '4K-Meshy 5.mp4', category: 'IH-功能演示',
      url: 'https://www.youtube.com/watch?v=hmocpVt5f5M', primaryPlacement: 'In-feed', status: 'Refresh', confidence: 'High',
      windows: { L30: metric(11464,32.9,326,.0038,20.14,.058,.588), L14: metric(6529,10.9,599,.0032,26.62,.043,.588), L7: metric(2790,1.2,2325,.0031,21.28,.012,.588) },
      placements: { 'In-feed': placement(9400,27,348,.82), 'In-stream': placement(2064,5.9,350,.18) },
      evidence: { hook: '复杂高质量3D成品。', productAction: '多模块Feature Showreel。', result: '视觉品质高但用途分散。', cta: '行动理由不够集中。', implication: '用Showreel画质制作单问题、单Feature版本。' },
      risks: ['Meshy 5信息过时', '观看意愿未转化为Purchase'],
    }),
  ],
  insights: [
    { id:'en-1', label:'Purchase structure', title:'单一任务 + 可见变化，是当前最强的Purchase结构', summary:'明确输入、一个产品动作和前段可见结果，比完整介绍产品更容易形成行动理由。', businessImpact:'Meshy Hack贡献119.5次L30转化，CPA ¥412，远优于Campaign基准。', supportingCreativeIds:['197142417849','389512799264'], action:'复制因果结构，不复制旧案例；专业功能限制到高意向版位。', confidence:'High', severity:'positive' },
    { id:'en-2', label:'Role clarity', title:'Feature Showreel建立专业感，但不能独立承担Purchase', summary:'高p50只证明愿意观看；多卖点与抽象质量优势会延长购买路径。', businessImpact:'4K Meshy 5的L7 p50仍为58.8%，CPA却恶化至¥2,325。', supportingCreativeIds:['278334053365'], action:'拆成单Feature Before/After，并补充实际影响与CTA。', confidence:'High', severity:'warning' },
  ],
  limitations: ['p50来自父广告层，不能视为独立素材指标。','当前仅有General Ad Group，无法可靠拆到视频 × Audience。'],
}

const korea: CampaignProfile = {
  id:'23965976042', market:'KR', marketName:'Korea', language:'Korean', flag:'KR', name:'Demand Gen - Purchase - SK', stage:'Prospecting', targetCpa:900, cutoff:'2026-07-22',
  dateRange:{L30:'Jun 23 – Jul 22',L14:'Jul 09 – Jul 22',L7:'Jul 16 – Jul 22'},
  windows:{L30:metric(56150,62.6,898,.0073,2.24,.0025),L14:metric(30020,22.7,1324,.0059,3.40,.0026),L7:metric(14819,9,1654,.0050,4.33,.0026)},
  placements:{
    L30:{'In-feed':placement(19489,13.5,1440,.35),'In-stream':placement(25655,27.2,943,.46),Shorts:placement(11005,21.8,504,.19)},
    L14:{'In-feed':placement(12485,6.2,2007,.42),'In-stream':placement(12078,10.6,1138,.40),Shorts:placement(5457,5.8,934,.18)},
    L7:{'In-feed':placement(5365,0,null,.36),'In-stream':placement(6451,6.4,1004,.44),Shorts:placement(3003,2.5,1187,.20)},
  },
  creatives:[
    creative({id:'378041212304',title:'video_IH-Ads-KR_251010@the3deguy_Caption-Dubbed_P.mp4',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=XBZ5pn4HJ5w',primaryPlacement:'Shorts',status:'Scale',confidence:'Medium',windows:{L30:metric(1558,3.7,421,.002,11,.013,.30),L14:metric(716,2,358,.002,12,.020,.34),L7:metric(414,1,414,.002,13,.028,.36)},placements:{Shorts:placement(1200,3,400,.77)},evidence:{hook:'一张图片快速变成高细节3D。',productAction:'Upload → Generate。',result:'皱纹、肌肉和表面细节证明质量。',cta:'免费试用。',implication:'保留直给结构，用韩国本地使用案例重拍。'},risks:['转化量较小'] }),
    creative({id:'378143742211',title:'video_IH-Media-KR_Quality-Meshy6-Texture-Screen_L.mp4',category:'IH-功能演示',url:'https://www.youtube.com/watch?v=X9FVngSdV3M',primaryPlacement:'In-feed',status:'Observe',confidence:'Medium',windows:{L30:metric(7302,8.6,846,.004,16,.021,.334),L14:metric(3953,2.7,1464,.004,16,.011,.388),L7:metric(1788,2,894,.004,16,.018,.428)},placements:{'In-feed':placement(2261,3.6,628,.58),'In-stream':placement(5020,5,1004,.42)},evidence:{hook:'第一屏直接给出高质量结果。',productAction:'围绕Texture质量，表达集中。',result:'静音也能获取产品价值。',cta:'产品感明确。',implication:'继续测试单Feature高质量画面。'},risks:['样本中等','p50不可独立归因'] }),
    creative({id:'378699737612',title:'요즘 공포게임들이 고퀄인 이유..ㄷㄷ',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=hAW7U8xUgro',primaryPlacement:'Shorts',status:'Refresh',confidence:'High',windows:{L30:metric(5445,11,495,.009,2.8,.005,.22),L14:metric(2100,.1,21000,.007,4,.0002,.18),L7:metric(900,0,null,.006,5,0,.17)},placements:{Shorts:placement(5200,10.5,495,.95)},evidence:{hook:'恐怖游戏娱乐Hook。',productAction:'约13秒才进入Meshy。',result:'3D道具进入游戏。',cta:'结尾导向游戏而非Meshy。',implication:'将Meshy前置，并增加专属产品CTA。'},risks:['娱乐兴趣稀释购买意图','近期0转化'] }),
  ],
  insights:[
    {id:'kr-1',label:'Placement risk',title:'近期恶化集中在In-feed，而不是所有版位同步失效',summary:'L7 In-feed消耗¥5,365但0转化；In-stream和Shorts仍贡献转化。',businessImpact:'若不限制In-feed，预算会继续流向低购买意图点击。',supportingCreativeIds:['378143742211'],action:'按素材限制版位，不做Campaign级一刀切。',confidence:'High',severity:'critical'},
    {id:'kr-2',label:'Creative structure',title:'直给型产品演示比故事优先结构更可靠',summary:'产品价值出现得越早，越容易筛选真正需要Image-to-3D的用户。',businessImpact:'251010 L7 CPA ¥414，显著优于Campaign ¥1,654。',supportingCreativeIds:['378041212304','378699737612'],action:'结果/问题 → 产品动作 → 细节证明 → 产品CTA。',confidence:'Medium',severity:'positive'},
  ],
  limitations:['Audience最低可靠粒度为Ad Group。','部分素材近期转化量较小。'],
}

const turkey: CampaignProfile = {
  id:'23968024485',market:'TR',marketName:'Turkey',language:'Turkish',flag:'TR',name:'Demand Gen - Purchase - TR',stage:'Prospecting',targetCpa:800,cutoff:'2026-07-26',
  dateRange:{L30:'Jun 27 – Jul 26',L14:'Jul 13 – Jul 26',L7:'Jul 20 – Jul 26'},
  windows:{L30:metric(30891,45.1,684,.0112,1.20,.0018),L14:metric(11585,10.5,1100,.008,3.22,.0029),L7:metric(1986,5,395,.006,4.25,.0107)},
  placements:{L30:{'In-feed':placement(21000,28,750,.68),'In-stream':placement(6500,12,542,.21),Shorts:placement(3391,5.1,665,.11)},L14:{'In-feed':placement(7800,4,1950,.67),'In-stream':placement(2600,4.5,578,.23),Shorts:placement(1185,2,593,.10)},L7:{'In-feed':placement(900,1,900,.45),'In-stream':placement(650,2,325,.33),Shorts:placement(436,2,218,.22)},},
  creatives:[
    creative({id:'394512358597',title:'SÜPER AYI TAM 50 KİŞİYLE SAKLAMBAÇ OYNADI!',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=ysDbP457HNc',primaryPlacement:'In-feed',status:'Refresh',confidence:'High',windows:{L30:metric(8238,10,820,.0206,.66,.0008,.169),L14:metric(2650,1.7,1559,.0107,2.63,.0017,.12),L7:metric(800,0,null,.0098,3.37,0,.089)},placements:{'In-feed':placement(7038,9,782,.935)},evidence:{hook:'本地Creator多人挑战。',productAction:'Meshy是可移除的Sponsor段。',result:'故事结果强于产品结果。',cta:'Creator互动优先。',implication:'保留本地相关性，重做为Meshy前置的必要任务。'},risks:['CTR下降','CPC升至约5倍','CvR归零'] }),
    creative({id:'texture-tr',title:'video_IH-Media-TK_Quality-Meshy6-Texture-Screen_L.mp4',category:'IH-功能演示',url:'https://www.youtube.com/watch?v=YP1C2H07TJk',primaryPlacement:'In-stream',status:'Scale',confidence:'Medium',windows:{L30:metric(1656,5.4,308,.004,8,.026,.304),L14:metric(1271,1.2,1059,.004,9,.008,.313),L7:metric(934,1,934,.004,10,.011,.316)},placements:{'In-stream':placement(934,5.4,173,.90)},evidence:{hook:'第一屏高质量3D结果。',productAction:'围绕Texture质量。',result:'结果直接可见，静音成立。',cta:'产品展示集中。',implication:'复制单卖点Showreel，不增加娱乐铺垫。'},risks:['转化量中等'] }),
    creative({id:'bedava-tr',title:'BEDAVAYA GÖRSELDEN 3D Model ÜRETMEK',category:'IH-功能演示',url:'https://www.youtube.com/watch?v=M7vpJIep7B8',primaryPlacement:'In-stream',status:'Scale',confidence:'Medium',windows:{L30:metric(4205,5,841,.005,6,.007,.19),L14:metric(1659,3,553,.005,6,.011,.21),L7:metric(930,2,465,.005,6,.013,.226)},placements:{'In-stream':placement(2300,4,575,.55),'In-feed':placement(1905,1,1905,.45)},evidence:{hook:'令人羡慕的3D模型。',productAction:'约4秒进入Meshy，图片→Create。',result:'3D模型与后续用途。',cta:'直接要求访问Meshy。',implication:'沿用清晰主线，减少动画、打印等延伸信息。'},risks:['延伸功能略多'] }),
  ],
  insights:[
    {id:'tr-1',label:'Framework fatigue',title:'本地娱乐内容贡献历史规模，但同一框架已双重疲劳',summary:'本地Creator能拉量；当Meshy只是后置Sponsor时，兴趣停留在娱乐内容。',businessImpact:'三条主要娱乐资产L30花费约¥19.2k，L7均为0转化。',supportingCreativeIds:['394512358597'],action:'停止复制“娱乐故事＋后置Sponsor”，让Meshy成为本地任务的必要步骤。',confidence:'High',severity:'critical'},
    {id:'tr-2',label:'Reliable structure',title:'单一任务 + 可见结果，是近期更可靠的Purchase结构',summary:'Image-to-3D与集中Texture证明近期仍能转化。',businessImpact:'BEDAVAYA L7 CPA ¥465；Texture Screen L30 CPA ¥308。',supportingCreativeIds:['texture-tr','bedava-tr'],action:'优先In-stream验证，使用原创本地案例。',confidence:'Medium',severity:'positive'},
  ],
  limitations:['Campaign窗口为asset-view汇总fixture，Live API将使用Campaign资源校验。','低Spend结果只作为方向信号。'],
}

const portuguese: CampaignProfile = {
  id:'23967609246',market:'PT',marketName:'Portuguese',language:'Portuguese',flag:'PT',name:'Demand Gen - Purchase - PT',stage:'Prospecting',targetCpa:800,cutoff:'2026-07-26',
  dateRange:{L30:'Jun 27 – Jul 26',L14:'Jul 13 – Jul 26',L7:'Jul 20 – Jul 26'},
  windows:{L30:metric(119207,207.7,574,.00676,3.03,.00527),L14:metric(82359,93.2,884,.00671,3.26,.00369),L7:metric(45386,28.3,1602,.00638,4.19,.00262)},
  placements:{L30:{'In-feed':placement(62862,73.9,850,.53),'In-stream':placement(40601,84.7,480,.34),Shorts:placement(15744,49.1,321,.13)},L14:{'In-feed':placement(44848,29.1,1539,.54),'In-stream':placement(27866,49,569,.34),Shorts:placement(9645,15.1,639,.12)},L7:{'In-feed':placement(25300,9,2811,.56),'In-stream':placement(13736,17,808,.30),Shorts:placement(6350,2.1,3015,.14)}},
  creatives:[
    creative({id:'pt-anything',title:'Agora qualquer coisa pode virar 3D.',category:'IH-功能演示',url:'https://www.youtube.com/watch?v=CUJnqKu4YPE',primaryPlacement:'In-stream',status:'Refresh',confidence:'High',windows:{L30:metric(14500,38.9,373,.005,4,.011,.31),L14:metric(9600,15,640,.005,5,.008,.30),L7:metric(5200,3,1733,.005,6,.0035,.29)},placements:{'In-stream':placement(9000,28,321,.62),Shorts:placement(4000,8,500,.28)},evidence:{hook:'孩子画一张图。',productAction:'8秒进入Meshy。',result:'18秒完成草图→3D。',cta:'补充打印与姿势证明。',implication:'刷新输入案例，保留因果链。'},risks:['近期效率下降'] }),
    creative({id:'pt-character',title:'Faça seus personagens em 3D facilmente…',category:'IH-功能演示',url:'https://www.youtube.com/watch?v=8QocqdGisbM',primaryPlacement:'Shorts',status:'Scale',confidence:'High',windows:{L30:metric(10230,30,341,.004,4,.012,.28),L14:metric(6200,12,517,.004,5,.010,.29),L7:metric(2600,2,1300,.004,6,.0046,.27)},placements:{Shorts:placement(7500,24,313,.73)},evidence:{hook:'3D成品前置。',productAction:'Image-to-3D上传与Generate。',result:'纹理与最终模型。',cta:'免费开始入口清楚。',implication:'复制为新的本地Maker/角色任务。'},risks:['L7样本较小'] }),
    creative({id:'pt-saveiro',title:'Montei uma SAVEIRO de controle remoto…',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=VRi-pIv0u5I',primaryPlacement:'Shorts',status:'Observe',confidence:'Directional',windows:{L30:metric(2300,6.6,349,.006,3,.008,.30),L14:metric(1500,3.5,429,.006,3.5,.008,.29),L7:metric(566,1,566,.006,4,.007,.28)},placements:{Shorts:placement(1637,6.6,248,.71)},evidence:{hook:'巴西辨识度高的Saveiro遥控车。',productAction:'Meshy生成RC配件。',result:'打印、安装并真实运行。',cta:'产品是完成任务的必要步骤。',implication:'扩展到RC、桌游和家居小工具。'},risks:['L30 Spend仅约¥2.3k'] }),
  ],
  insights:[
    {id:'pt-1',label:'Campaign decay',title:'Purchase intent正在下降，In-feed是近期主要拖累',summary:'Campaign CPA从¥574恶化至¥1,602，L7 In-feed CPA ¥2,811。',businessImpact:'继续沿用长篇故事会放大内容兴趣与购买意图错配。',supportingCreativeIds:['pt-anything'],action:'优先In-stream验证新结构，限制高花费低CvR的In-feed。',confidence:'High',severity:'critical'},
    {id:'pt-2',label:'Local use',title:'值得复制的是本地任务 → Meshy → 可见结果 → 实际使用',summary:'不是语言替换，而是让Meshy成为本地Maker任务不可缺少的一步。',businessImpact:'Saveiro L30 CPA ¥349，Shorts CPA ¥248，但样本仍小。',supportingCreativeIds:['pt-character','pt-saveiro'],action:'扩展新的原创Maker/Game用途并控制样本预算。',confidence:'Medium',severity:'positive'},
  ],
  limitations:['Saveiro样本较小，不能宣布稳定赢家。','长视频表现受版位与叙事长度共同影响。'],
}

const spanish: CampaignProfile = {
  id:'23973542780',market:'ES',marketName:'Spanish',language:'Spanish',flag:'ES',name:'Demand Gen - Purchase - ES',stage:'Prospecting',targetCpa:800,cutoff:'2026-07-26',
  dateRange:{L30:'Jun 27 – Jul 26',L14:'Jul 13 – Jul 26',L7:'Jul 20 – Jul 26'},
  windows:{L30:metric(97139,149,652,.00840,1.82,.00279),L14:metric(63838,68.2,936,.00773,2.07,.00221),L7:metric(46347,28.1,1647,.00761,2.10,.00128)},
  placements:{L30:{'In-feed':placement(51617,76.3,676,.53),'In-stream':placement(41136,64.7,635,.42),Shorts:placement(4387,7.9,554,.05)},L14:{'In-feed':placement(28648,24.9,1150,.45),'In-stream':placement(31257,36.6,854,.49),Shorts:placement(3932,6.7,590,.06)},L7:{'In-feed':placement(25218,9,2802,.54),'In-stream':placement(18410,14,1315,.40),Shorts:placement(2719,2.4,1141,.06)}},
  creatives:[
    creative({id:'es-fortnite',title:'ChatGPT y Gemini TRABAJAN JUNTOS para crear Fortnite desde CERO',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=oUhKBOSCkUo',primaryPlacement:'In-stream',status:'Observe',confidence:'High',windows:{L30:metric(13283,28.8,461,.009,2,.0043,.35),L14:metric(9000,13,692,.009,2.1,.0030,.36),L7:metric(5495,7,785,.009,2.2,.0028,.36)},placements:{'In-stream':placement(9000,21,429,.68),'In-feed':placement(4283,7.8,549,.32)},evidence:{hook:'ChatGPT与Gemini从零做Fortnite。',productAction:'Meshy补齐树木、岩石等3D资产。',result:'资产立即进入完整游戏。',cta:'免费开始后回到游戏结果。',implication:'Meshy只解决一个必要工作缺口。'},risks:['知名IP风险','产品进入较晚'] }),
    creative({id:'es-followers',title:'Imprimiendo seguidores en 3D',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=7q_nqQNJFn0',primaryPlacement:'Shorts',status:'Scale',confidence:'Medium',windows:{L30:metric(4200,7.6,553,.004,4.63,.0084,.27),L14:metric(2500,4,625,.004,5,.008,.26),L7:metric(900,1,900,.004,6,.0067,.25)},placements:{Shorts:placement(3100,6,517,.74)},evidence:{hook:'0秒提出把粉丝画成3D。',productAction:'不会建模 → Meshy 6上传手绘图。',result:'27秒展示全部打印成品。',cta:'41秒折扣CTA。',implication:'扩展宠物、徽章和商业订单场景。'},risks:['CPC为Campaign的2.54倍','样本中等'] }),
    creative({id:'es-print-order',title:'Así puedes convertir imágenes a modelos 3D para imprimir…',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=WGOCWt-tQXE',primaryPlacement:'In-stream',status:'Scale',confidence:'Medium',windows:{L30:metric(3500,5.8,603,.004,3.79,.0063,.31),L14:metric(1900,3,633,.004,4,.006,.30),L7:metric(700,1,700,.004,5,.007,.29)},placements:{'In-stream':placement(2600,4.5,578,.74)},evidence:{hook:'3D打印商家的客户订单与报价障碍。',productAction:'上传、Generate、下载STL。',result:'打印、后处理与40cm成品。',cta:'降低建模成本并完成订单。',implication:'将商业价值和节省时间量化。'},risks:['CPC为Campaign的2.08倍','样本中等'] }),
  ],
  insights:[
    {id:'es-1',label:'Necessary task',title:'Game/AI挑战能带来规模，但Purchase取决于Meshy是否必要',summary:'当Meshy只补齐一个明确资产缺口并立即回到游戏结果，购买理由更清楚。',businessImpact:'Fortnite资产L30 28.8 Conv / CPA ¥461，L7仍为¥785。',supportingCreativeIds:['es-fortnite'],action:'复制“世界已有 → 缺3D资产 → Meshy → 导入 → 游戏完整”。',confidence:'High',severity:'positive'},
    {id:'es-2',label:'High intent',title:'直接3D打印流量更贵，但Purchase意图更集中',summary:'高CPC不一定是坏流量，需要同时看点击后的CvR。',businessImpact:'两条打印素材CvR 0.84%/0.63%，高于Campaign 0.28%。',supportingCreativeIds:['es-followers','es-print-order'],action:'测试商业订单、个性化商品和数字资产到实物。',confidence:'Medium',severity:'positive'},
  ],
  limitations:['IP素材高CTR不代表高购买意图。','Shorts L7仅约2.4次转化，版位结论需谨慎。'],
}

const french: CampaignProfile = {
  id:'23971533307',market:'FR',marketName:'France',language:'French',flag:'FR',name:'Demand Gen - Purchase - Retargeting FR',stage:'Retargeting',targetCpa:1000,cutoff:'2026-07-26',
  dateRange:{L30:'Jun 27 – Jul 26',L14:'Jul 13 – Jul 26',L7:'Jul 20 – Jul 26'},
  windows:{L30:metric(59637,62,961,.00473,4.36,.00453),L14:metric(27659,12.8,2163,.00472,4.95,.00229),L7:metric(11240,3.2,3552,.00513,9.66,.00272)},
  placements:{L30:{'In-feed':placement(24631,18.9,1300,.41),'In-stream':placement(12847,9,1421,.22),Shorts:placement(22159,34,651,.37)},L14:{'In-feed':placement(13725,2.8,4910,.50),'In-stream':placement(5899,.7,8836,.21),Shorts:placement(8035,9.3,862,.29)},L7:{'In-feed':placement(6393,.18,35260,.57),'In-stream':placement(2953,.02,138635,.26),Shorts:placement(1894,2.96,640,.17)}},
  creatives:[
    creative({id:'fr-site',title:'Un site pour la modélisation 3D que tu dois connaître ! Meshy.AI',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=vZzbkNoXw-I',primaryPlacement:'Shorts',status:'Refresh',confidence:'High',windows:{L30:metric(11077,16.5,670,.003,6,.009,.08),L14:metric(3000,2,1500,.003,8,.005,.09),L7:metric(554,0,null,.003,10,0,.10)},placements:{Shorts:placement(9000,15,600,.81)},evidence:{hook:'0秒图片拖入网站。',productAction:'Image/Text-to-3D与多格式导出。',result:'5秒内展示可见价值。',cta:'22秒访问Meshy。',implication:'保留简单承诺，用新的法国用途刷新。'},risks:['近期0转化','历史素材疲劳'] }),
    creative({id:'379383927259',title:'Essaye ce site : Meshy.AI',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=16PCbO1UvQc',primaryPlacement:'Shorts',status:'Re-cut',confidence:'Medium',windows:{L30:metric(3593,5.2,689,.00297,6.68,.00969,.072),L14:metric(922,3.1,298,.00281,7.26,.0244,.079),L7:metric(223,.02,10930,.00366,14.85,.00136,.117)},placements:{Shorts:placement(2488,5.19,480,.86),'In-stream':placement(1095,.03,39855,.14)},evidence:{hook:'5分钟把想法做成3D并打印。',productAction:'上传图片→带纹理模型。',result:'31–37秒导出、打印、成品。',cta:'后半段又增加多项功能。',implication:'重剪20–30秒，只保留前37秒的核心链路。'},risks:['L7仅15次点击','CPC升至¥14.85'] }),
    creative({id:'fr-review',title:'J’ai testé Meshy V6 : créer des modèles 3D avec l’IA…',category:'IH-KOL/UGC',url:'https://www.youtube.com/watch?v=S9bIZvSIX2E',primaryPlacement:'In-feed',status:'Budget risk',confidence:'High',windows:{L30:metric(11232,4.5,2499,.006,5,.002,.18),L14:metric(8000,1,8000,.006,6,.0008,.19),L7:metric(5987,0,null,.006,7,0,.20)},placements:{'In-feed':placement(9000,4,2250,.80)},evidence:{hook:'产品地位、社区和优惠。',productAction:'覆盖大量功能与集成。',result:'信息专业但没有单一用户任务。',cta:'30秒已有链接，之后仍继续评测。',implication:'拆成图片→3D、模型→打印、角色→动画独立广告。'},risks:['L7占Campaign Spend约53%','L7零转化'] }),
  ],
  insights:[
    {id:'fr-1',label:'Budget allocation',title:'近期恶化主要来自预算与有效版位错配',summary:'L7 Shorts只占17% Spend，却贡献约94% Conversion。',businessImpact:'In-feed与In-stream合计花费约¥9,346，只产生约0.2次转化。',supportingCreativeIds:['fr-site'],action:'限制高花费低转化版位，为新Shorts任务素材保留验证预算。',confidence:'High',severity:'critical'},
    {id:'fr-2',label:'Information scope',title:'产品教育应压缩为一个清楚用途',summary:'中等长度本身不是问题，问题是后半段继续增加功能导致购买理由分散。',businessImpact:'单用途素材L30 CPA ¥670–¥689，完整评测为¥2,499。',supportingCreativeIds:['379383927259','fr-review'],action:'将Essaye前37秒重剪成20–30秒；拆分完整评测。',confidence:'High',severity:'warning'},
  ],
  limitations:['该Campaign为Retargeting，不与Prospecting市场机械横比。','Essaye L7样本不足，不能直接判定结构失败。'],
}

export const workspace: WorkspaceProfile = {
  name:'Meshy Global Creative Intelligence',
  customerId:'226-141-8946',
  currency:'CNY',
  timezone:'Asia/Shanghai',
  mode:'Demo',
  campaigns:[developed,korea,turkey,portuguese,spanish,french],
}
