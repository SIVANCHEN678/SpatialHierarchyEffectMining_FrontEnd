/**
 * 模糊查询大类
 * 
 * 
 * @param {*} name 
 */

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


