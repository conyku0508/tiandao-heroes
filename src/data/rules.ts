// All balance values are provisional original prototype values, not original-game formulas.
export const SIZE=64;
export const RULES={version:'prototype-2',dayTicks:240,tickMs:100,seasonDays:30,harvestDays:60,facilityLimit:60};
export const definitions={
 headquarters:{name:'聚義堂',cost:0,days:1,terrain:['plain'],description:'山寨議事與物資管理所在。'},
 housing:{name:'民居',cost:0,days:1,terrain:['plain'],description:'人口增長時自動生成，提供80人容量。'},
 farmland:{name:'耕地',cost:120,days:8,terrain:['plain','hill'],description:'村民適職。半年收成，鄰市場加成。'},
 fishery:{name:'漁場',cost:180,days:10,terrain:['plain'],description:'船夫適職，必須鄰水。每季收成。'},
 tavern:{name:'酒館',cost:240,days:12,terrain:['plain'],description:'酒商適職。每季收入，鄰道路加成。'},
 market:{name:'市場',cost:220,days:12,terrain:['plain'],description:'商人適職。增加附近耕地產量。'},
 barracks:{name:'軍營',cost:260,days:14,terrain:['plain'],description:'第一版僅供建造與規模成長，徵兵待後續。'},
 'training-ground':{name:'練兵場',cost:200,days:10,terrain:['plain'],description:'第一版僅供建造與規模成長，軍事訓練待後續。'},
 road:{name:'道路',cost:5,days:1,terrain:['plain','hill','forest'],description:'加快人物通行。'},
 fence:{name:'柵欄',cost:15,days:2,terrain:['plain','hill'],description:'阻擋陸地通行。'},
 bridge:{name:'橋梁',cost:60,days:4,terrain:['river'],description:'跨水通行，人物優先選擇橋梁。'}
} as const;
export type BuildingKind=keyof typeof definitions;
export const heroDefinitions=[
 {name:'沈青嶺',profession:'村民',strength:78,skill:65,intelligence:62,color:0},
 {name:'江映舟',profession:'船夫',strength:65,skill:86,intelligence:70,color:1},
 {name:'顧知秋',profession:'商人',strength:52,skill:74,intelligence:89,color:2},
 {name:'柳長風',profession:'村民',strength:83,skill:71,intelligence:56,color:3},
 {name:'蘇晚照',profession:'酒商',strength:55,skill:68,intelligence:85,color:4},
 {name:'陸石生',profession:'工匠',strength:88,skill:82,intelligence:60,color:5},
 {name:'孟松聲',profession:'山居者',strength:80,skill:76,intelligence:65,color:6},
 {name:'許觀瀾',profession:'學士',strength:58,skill:67,intelligence:91,color:7}
];
