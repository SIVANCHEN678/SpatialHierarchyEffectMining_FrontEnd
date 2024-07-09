/**
 * 图谱数据源
 */
import { getRequest } from "@/api/user"; // 假设你的get请求函数已经封装在此处

// 首先，你需要从后端获取数据并存储起来
let data = []; // 初始化为空数组，稍后填充从后端获取的数据
console.log("！！！！是否加载进", data)

export const fetchDataFromBackend = async () => {
  try {
    getRequest("/admin/knowledgeGraph/getKnowledgeGraph", {
        
    }).then((res) => {
      console.log("数据",res);
      
      data=res.data
      console.log(data)
     // this.dialogFormVisible = false;
    });


    // const response = await getRequest('/admin/knowledgeGraph/getKnowledgeGrap');
    // data = response.data; // 将后端返回的数据赋值给data
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// 确保在调用search和expendNodes之前已经执行了fetchDataFromBackend
fetchDataFromBackend();

/**
 * 模糊查询大类
 * @param {*} name 
 */
export const search = (name) => {
    fetchDataFromBackend();
  return new Promise((resolve, reject) => {
    let result = [];
    console.log(data);
    let list = data.filter(item => {console.log(name);name.indexOf(name) >= 0});
    console.log(list)
    if (list && list.length > 0) {
      result = list || [];
    }
    if (result.length > 0) {
      resolve(result);
    } else {
      reject();
    }
  });
};

/**
 * 点击节点展开
 * @param {*} id 
 */
export const expendNodes = (id) => {
    fetchDataFromBackend();
  return new Promise((resolve, reject) => {
    let totalList = [];
    // 拆除来所有的children到第一层
    data.forEach(item => {
      getDeepChildrens(totalList, item, 0);
    });

    let list = [];
    for (let item of totalList) {
      if (item.parentId.toString() === id) {
        const { children, ...reset } = item;
        list.push({
          ...reset,
        });
      }
    }
    if (list.length > 0) {
      resolve(list);
    } else {
      reject();
    }
  });
};

/**
 * 递归数组,把所有children都拆出来到第一层
 * @param {*} list 
 * @param {*} item 
 */
function getDeepChildrens(list, item, parentId) {
  const { children, ...reset } = item;
  list.push({
    ...reset,
    parentId,
  });
  if (children && children.length > 0) {
    children.forEach(child => {
      getDeepChildrens(list, child, item.id);
    });
  }
}

/**
 * 分类数据
 */
export const categarys =  ['卒中','缺血性心脏病','慢性阻塞性肺疾病','糖尿病','高血压','血脂异常','慢性肾脏疾病','肺癌','胃癌','结直肠癌','乳腺癌','前列腺癌','阿尔兹海默症']