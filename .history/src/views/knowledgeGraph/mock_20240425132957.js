/**
 * 模糊查询大类
 * 
 * 
 * @param {*} name 
 */
// export const search = (name, data)=>{
//     return new Promise((resolve,reject)=>{

//         console.log("DDDDDDDDDD",data)
//         // 在此处等待数据填充完毕
//         waitForData(data,() => {
//             console.log("XXXXXXXXXX",data)
//             let result = []
//             let list = data.filter(item => item.name.indexOf(name) >= 0)
//             if (list && list.length > 0) {
//                 result = list || []
//             }
//             if (result.length > 0) {
//                 resolve(result)
//             } else {
//                 reject()
//             }
//         });
//     });
// }


export const daa = [
    {
    "id": 60000,
    "name": "慢性阻塞性肺病",
    "children": [
        {
            "id": 600001,
            "name": "PassiveSmoker",
            "categary": "导致",
            "children": [
                {
                    "id": 600002,
                    "name": "Smoking",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600002,
            "name": "Smoking",
            "categary": "导致"
        },
        {
            "id": 600003,
            "name": "Obesity",
            "categary": "导致"
        },
        {
            "id": 600004,
            "name": "AlcoholUse",
            "categary": "导致",
            "children": [
                {
                    "id": 600014,
                    "name": "OccuPationalHazards",
                    "categary": "导致"
                },
                {
                    "id": 600020,
                    "name": "DustAllergy",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600005,
            "name": "WeightLoss",
            "categary": "导致"
        },
        {
            "id": 600006,
            "name": "AirPollution",
            "categary": "导致",
            "children": [
                {
                    "id": 600004,
                    "name": "AlcoholUse",
                    "categary": "导致"
                },
                {
                    "id": 600016,
                    "name": "Gender",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600007,
            "name": "GeneticRisk",
            "categary": "导致",
            "children": [
                {
                    "id": 600010,
                    "name": "chronicLungDisease",
                    "categary": "导致"
                },
                {
                    "id": 600014,
                    "name": "OccuPationalHazards",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600008,
            "name": "BalancedDiet",
            "categary": "导致",
            "children": [
                {
                    "id": 600014,
                    "name": "OccuPationalHazards",
                    "categary": "导致"
                },
                {
                    "id": 600003,
                    "name": "Obesity",
                    "categary": "导致"
                },
                {
                    "id": 600001,
                    "name": "PassiveSmoker",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600009,
            "name": "FrequentCold",
            "categary": "导致"
        },
        {
            "id": 600010,
            "name": "chronicLungDisease",
            "categary": "导致"
        },
        {
            "id": 600011,
            "name": "ChestPain",
            "categary": "导致",
            "children": [
                {
                    "id": 600001,
                    "name": "PassiveSmoker",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600012,
            "name": "Fatigue",
            "categary": "导致",
            "children": [
                {
                    "id": 600018,
                    "name": "Snoring",
                    "categary": "导致"
                },
                {
                    "id": 600019,
                    "name": "ShortnessofBreath",
                    "categary": "导致"
                },
                {
                    "id": 600005,
                    "name": "WeightLoss",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600013,
            "name": "Wheezing",
            "categary": "导致"
        },
        {
            "id": 600014,
            "name": "OccuPationalHazards",
            "categary": "导致"
        },
        {
            "id": 600015,
            "name": "DryCough",
            "categary": "导致",
            "children": [
                {
                    "id": 600009,
                    "name": "FrequentCold",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600016,
            "name": "Gender",
            "categary": "导致"
        },
        {
            "id": 600017,
            "name": "SwallowingDifficulty",
            "categary": "导致",
            "children": [
                {
                    "id": 600013,
                    "name": "Wheezing",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600018,
            "name": "Snoring",
            "categary": "导致"
        },
        {
            "id": 600019,
            "name": "ShortnessofBreath",
            "categary": "导致"
        },
        {
            "id": 600020,
            "name": "DustAllergy",
            "categary": "导致"
        },
        {
            "id": 600021,
            "name": "CoughingofBlood",
            "categary": "导致",
            "children": [
                {
                    "id": 600019,
                    "name": "ShortnessofBreath",
                    "categary": "导致"
                },
                {
                    "id": 600007,
                    "name": "GeneticRisk",
                    "categary": "导致"
                },
                {
                    "id": 600013,
                    "name": "Wheezing",
                    "categary": "导致"
                }
            ]
        },
        {
            "id": 600022,
            "name": "ClubbingofFingerNails",
            "categary": "导致",
            "children": [
                {
                    "id": 600009,
                    "name": "FrequentCold",
                    "categary": "导致"
                },
                {
                    "id": 600019,
                    "name": "ShortnessofBreath",
                    "categary": "导致"
                }
            ]
        }
    ]
}]

export const search = (name, data)=>{
    return new Promise((resolve,reject)=>{

        console.log("DDDDDDDDDD",data)
        // 在此处等待数据填充完毕
        let result = []
        let list = data.filter(item => item.name.indexOf(name) >= 0)
        console.log("LLLLLLL", list)
        if (list && list.length > 0) {
            result = list || []
        }
        if (result.length > 0) {
            resolve(result)
        } else {
            reject()
        }
    });
}

/**
 * 点击节点展开
 * @param {*} id 
 */
export const expendNodes = (id, data)=>{
    return new Promise((resolve,reject)=>{

        console.log("xxxxxxxxx",data)
        // 在此处等待数据填充完毕
            let totalList = []
            //拆除来所有的children到第一层
            data.forEach(item=>{
                getDeepChildrens(totalList,item,0)
            })

            let list = []
            for(let item of totalList){
                if(item.parentId.toString() === id){
                    const {children,...reset} = item
                    list.push({
                        ...reset
                    })
                }
            }
            if(list.length>0){
                resolve(list)
            }else{
                reject()
            }
    });
}

/**
 * 递归数组,把所有children都拆出来到第一层
 * @param {*} list 
 * @param {*} item 
 */
function getDeepChildrens(list,item,parentId){
    const {children,...reset} =  item
    list.push(
        {
            ...reset,
            parentId,
        }
    )
    if(children&&children.length>0){
        children.forEach(child=>{
            getDeepChildrens(list,child,item.id)
        })
    }
}

/**
 * 分类数据
 */
export const categarys =  ["卒中","缺血性心脏病","慢性阻塞性肺病","糖尿病","高血压","血脂异常","慢性肾脏疾病","肺癌","胃癌","结直肠癌","乳腺癌","前列腺癌","阿尔兹海默症"];


