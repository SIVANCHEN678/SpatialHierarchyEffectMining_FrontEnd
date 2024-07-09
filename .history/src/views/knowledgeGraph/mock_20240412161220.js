/**
 * 图谱数据源
 */
import { getRequest } from "@/api/user"; // 假设你的get请求函数已经封装在此处

// 初始化数据为空数组
let data = []

/**
 * 从后端获取数据并存储到data中
 */
export const fetchDataFromBackend = ()=> {
  return new Promise((resolve, reject) => {
    try {
      getRequest("/admin/knowledgeGraph/getKnowledgeGraph", {}).then((res) => {
        console.log("数据", res);
        // 将从后端获取的数据存储到data中
        data = res.data;
        resolve();
      }).catch(error => {
        reject(error);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      reject(error);
    }
  });
};

// 在页面加载时调用fetchDataFromBackend获取数据
fetchDataFromBackend().then(() => {
    console.log('数据加载成功');
  }).catch(error => {
    console.error('数据加载失败:', error);
  });

/**
 * 模糊查询大类
 * @param {*} name 
 */
export const search = (name)=>{
    return new Promise((resolve,reject)=>{
        // 在此处等待数据填充完毕
        waitForData(() => {
            console.log("!!!!!!",data)
            let result = []
            let list = data.filter(item => item.name.indexOf(name) >= 0)
            if (list && list.length > 0) {
                result = list || []
            }
            if (result.length > 0) {
                resolve(result)
            } else {
                reject()
            }
        });
    });
}

/**
 * 点击节点展开
 * @param {*} id 
 */
export const expendNodes = (id)=>{
    return new Promise((resolve,reject)=>{
        // 在此处等待数据填充完毕
        waitForData(() => {
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
export const categarys =  ["卒中","缺血性心脏病","慢性阻塞性肺疾病","糖尿病","高血压","血脂异常","慢性肾脏疾病","肺癌","胃癌","结直肠癌","乳腺癌","前列腺癌","阿尔兹海默症"];

/**
 * 等待数据填充完毕
 * @param {*} callback 
 */
function waitForData(callback) {
    // 如果data已经填充完毕，则直接执行回调函数
    if (data.length > 0) {
        callback();
    } else {
        // 否则等待一段时间后再尝试执行
        setTimeout(() => {
            waitForData(callback);
        }, 100);
    }
}


