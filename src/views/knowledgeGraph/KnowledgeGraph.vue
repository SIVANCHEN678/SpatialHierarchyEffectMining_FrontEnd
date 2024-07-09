<template>
	<div class="container">
        <div class="center">
           
            <div class="parent" style="font-size: 25px; ;">
                <p>因果关系图谱展示</p></div>
           
            <div class="header">
                <input
                    type="text"
                    class="ipt"
                    v-model="searchContent"
                    @keydown.enter="search()"
                    placeholder="搜索肺癌试试"
                />
                <p class="tips">
                    <span>搜索示例:肺癌</span>
                </p>
            </div>
            <div class="canvas">
                <Keywords v-show="type === 1" @searchData="search" @windowResize="windowResize"></Keywords>
                <Charts style="width: 100%;height: 100%;" ref="charts" v-show="type === 2" :chartList="searchList" :data="knowledgeGraph"/>
                
            </div>
        </div>
	</div>
</template>
<script>
import Keywords from "./Keywords";
import Charts from "./Charts";
import{
    search,
} from './mock'
import { postRequest, getRequest } from "@/utils/api";
export default {
	name: "KnowledgeGraph",
	components: {
		Keywords,
		Charts,
	},
    mixins: [],
	props: {},
	data() {
		return {

            knowledgeGraph: [],
   
			searchContent: "",
			type: 1,
			searchList: [],
		};
	},
	computed: {},
	methods: {

        /**
         * 得到知识图谱数据
         */
        getKnowledgeGraph(){
            const userId = sessionStorage.getItem("userid")
            console.log("UUUUU", userId)
            getRequest(`api/knowledgeGraph/getKnowledgeGraph/${userId}`).then(response => {
                if(response.code === 200){
                    this.$message.success("获取数据成功")
                    console.log("知识图谱", response.data)
                    this.knowledgeGraph=response.data
                }else(
                    this.$message.error("获取数据失败")
                )
            })
        },

        /**
         * 搜索方法,text为空则为点击类别操作,不为空则为输入框搜索
         */
		async search(text) {
			text || (text = this.searchContent);
            console.log("sss", text, this.searchContent);
            if(!text){
                this.type = 1
                return
            }
            try {
                let result = await search(text, this.knowledgeGraph);
                this.type = 2
                this.searchList = [].concat(result)
            } catch (error) {
                // alert('未查询到数据,请更改查询条件')
                this.$message.error("该疾病暂时无知识图谱数据，请搜索已挖掘病种")
            }
			
        },
        /**
         * 窗体大小变化回调
         */
        windowResize(){
            const charts = this.$refs.charts
            charts&&charts.myChart&&charts.myChart.resize()
        }
	},
	created() {
        this.getKnowledgeGraph()
    },
	mounted() {
		this.type = 1;
	},
	beforeDestroy() {},
};
</script>
<style scoped>
html, body {
    margin: 0; /* 移除浏览器默认的边距 */
    height: 100%;
    width: 100%;
    overflow: hidden; /* 如果需要隐藏溢出内容，可以保留这条 */
    padding: 0; /* 为了防止内边距影响全屏布局，也可以移除内边距 */
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    
    overflow: hidden;
    position: relative;
    min-height: 100vh; /* 已经正确设置了占据视口高度 */
    width: 100%; /* 添加这一行以确保宽度占满整个屏幕 */
}
.canvas {
    margin-top: 10px;
	height: calc(100vh - 110px);
}
.center {
	position: relative;
	min-width: 1200px;
	margin: 0 auto;
    width: 100%;
}
.header {
    display: flex;
    justify-content: center;
    align-items: center;
	padding-top: 30px;
}
.ipt {
    /* display: flex;
    justify-content: center;
    align-items: center; */
	border: 1px solid #9093c7;
	border-radius: 20px;
	width: 374px;
	height: 44px;
	line-height: 44px;
	box-sizing: border-box;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    justify-content: center
}
.parent {
    text-align: center;
}
.tips {
	font-size: 14px;
	color: #ccc;
	line-height: 17px;
	margin-top: 5px;
}
</style>