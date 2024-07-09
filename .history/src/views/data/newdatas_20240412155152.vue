<template>
  <div>
    <div class="left_tree">
      <div slot="header" class="clearfix" style=" margin-left: 30%;font-size: 20px;">
          <span class="lineStyle" ></span><span><b>可选数据</b></span>
          
           
          <!-- <el-popover placement="right" trigger="hover">
                    <div>
                     用户可根据需求从专病数据中按需纳排，可在公共数据集上传数据表
                    </div>
                    <el-icon
                      slot="reference"
                      class="el-icon-warning-outline" 
                    ></el-icon>
                  </el-popover> -->
        </div>
        <p style="margin-left: 10%;">总共有{{deleteIconCount }}个一级病种,{{totalDatasets }}个数据集</p>
         <hr class="horizontal-line">
      <!-- <el-button type="success" class="add_button" @click="dialogDiseaseVisible2 = true">添加病种</el-button> -->
      <div style="margin-top: 5%;">
      <b >专病数据集            </b>  <el-button
               
                icon="el-icon-folder-add"
                size="mini"
                type="text"
                slot="reference"
                @click="dialogDiseaseVisible2 = true"
                style="margin-left: 60%;"
                ></el-button>
      <el-dialog
        title="提示"
        :visible.sync="dialogDiseaseVisible2"
        width="30%">
        <span>
          请输入新病种名称：<el-input placeholder="请输入内容" v-model="diseaseName" class="nameInput"></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cleanInput()">取 消</el-button>
          <el-button type="primary" @click="addDisease()">确 定</el-button>
        </span>
      </el-dialog>
      <el-tree
        ref="tree"
        :data="treeData"
        
        :show-checkbox="false"
        node-key="id"
        default-expand-all
        
        :expand-on-click-node="false"
        :check-on-click-node="true"
        :highlight-current="true"
        @node-click="changeData"
        @check-change="handleCheckChange">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <!--公共数据集confirm-->
            <el-popconfirm
           
              v-if="data.isCommon"
              confirm-button-text='新病种'
              cancel-button-text='数据集'
              title="请选择添加的文件"
              cancel-button-type="primary"
              @confirm="dialogDiseaseVisible=true;"
              @cancel="dialogFormVisible=true">
              <el-button
                v-if="!data.isLeafs"
                icon="el-icon-folder-add"
                size="mini"
                type="text"
                slot="reference"
                @click="markNode(data)"
                >
              </el-button>
            </el-popconfirm>
            <!--非公共数据集confirm-->
           
   
            <el-popconfirm
                  v-else
                  confirm-button-text='新病种'
                  cancel-button-text='数据集'
                  title="请选择添加的文件"
                  cancel-button-type="primary"
                  @confirm="dialogDiseaseVisible=true"
                  @cancel="openAddDataForm(data.path)">
              <el-button
                      v-if="!data.isLeafs"
                      icon="el-icon-folder-add"
                      size="mini"
                      type="text"
                      slot="reference"
                      @click="markNode(data)">
              </el-button>
            </el-popconfirm>
            
            <el-popconfirm
              title="删除后无法恢复"
              icon="el-icon-warning"
              icon-color="red"
              confirm-button-text='确认'
              cancel-button-text='取消'
              @confirm="() => remove(node, data)"
            >
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="text"
              slot="reference"
             >
            </el-button>
            </el-popconfirm>

            
           

          </span>
        </span>
      </el-tree>
        <el-dialog
          title="提示"
          :visible.sync="dialogDiseaseVisible"
          width="30%">
          <span>
            请输入新病种名称（a）：<el-input placeholder="请输入内容" v-model="diseaseName" class="nameInput"></el-input>
          </span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cleanInput()">取 消</el-button>
            <el-button type="primary" @click="() => append(0)">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <el-dialog
              title="新增数据集"
              :visible.sync="dialogDataVisible"
              width="60%">
          <div class="addDataClass">
            
              <i style="margin-left: 10px" class="el-icon-s-data"></i>&nbsp;&nbsp;&nbsp;数据集：<el-input v-model="addDataForm.dataName" placeholder="请输入数据集名称"></el-input>
              <span class="addDataBaseInfo">
                <i class="el-icon-user-solid"></i>&nbsp;&nbsp;&nbsp;创建人：<el-input v-model="addDataForm.createUser" placeholder="请输入创建人姓名" disabled></el-input>
              </span>
              <span class="addDataBaseInfo">
                <i class="el-icon-time"></i>&nbsp;&nbsp;&nbsp;创建时间：<span>{{ showFeatureDataForm.createTime }}</span>
              </span>
              <span class="addDataBaseInfo">
                <i class="el-icon-pie-chart"></i>&nbsp;&nbsp;&nbsp;所属类别：<span>{{ showFeatureDataForm.classPath }}</span>
             </span>
          </div>
          <div class="addDataClass" style="margin-top: 20px">
              <div class="addDataTitle"><i class="el-icon-connection"></i>&nbsp;&nbsp;特征选择</div>
              <div style="margin-top: 20px;">
                  <el-button type="primary" plain icon="el-icon-plus" style="margin-right: 8px" @click="putToAddDataForm">添加新条件</el-button>
                  <el-button @click="chooseCharacter(addDataForm.characterList[0])" style="width: 130px;margin-right: 8px;margin-left: 0px">{{ addDataForm.characterList[0].button }}</el-button>
                  <span v-if="addDataForm.characterList[0].type==='discrete'">
                    <el-select :value="'='" slot="prepend" placeholder="运算符" style="width: 90px;margin-right: 8px" disabled>
                      <el-option label="=" value="="></el-option>
                  </el-select>
                  <el-select  v-model="addDataForm.characterList[0].value" placeholder="请选择特征取值" style="width: 300px">
                    <el-option
                      v-for="item in addDataForm.characterList[0].range"
                      :key="item"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                  </span>
                  <span v-else>
                    <el-select v-model="addDataForm.characterList[0].computeOpt" slot="prepend" placeholder="运算符" style="width: 90px;margin-right: 8px">
                        <el-option label=">" value=">"></el-option>
                        <el-option label="<" value="<"></el-option>
                        <el-option label="=" value="="></el-option>
                    </el-select>
                    <el-input  v-model="addDataForm.characterList[0].value" placeholder="请输入特征取值" style="width: 300px" ></el-input>
                    <el-button disabled style="width: 200px;background-color:#f5f7fa;">单位：{{ addDataForm.characterList[0].unit }}</el-button>
                  </span>
              </div>
              <div style="margin-top: 20px;" v-for="(characterItem,index) in addDataForm.characterList.slice(1)" :key="index">
                  <el-select v-model="characterItem.opt" slot="prepend" placeholder="条件选择" style="width: 130px;margin-right: 8px">
                      <el-option label="AND" value="0"></el-option>
                      <el-option label="OR" value="1"></el-option>
                      <el-option label="NOT" value="2"></el-option>
                  </el-select>
                  <el-button @click="chooseCharacter(characterItem)" style="width: 130px;margin-right: 8px;">{{ characterItem.button }}</el-button>
                  <span v-if="characterItem.type==='discrete'">
                    <el-select :value="'='" slot="prepend" placeholder="运算符" style="width: 90px;margin-right: 8px" disabled>
                        <el-option label="=" value="="></el-option>
                    </el-select>
                    <el-select  v-model="characterItem.value" placeholder="请选择特征取值" style="width: 300px">
                      <el-option
                              v-for="item in characterItem.range"
                              :key="item"
                              :label="item"
                              :value="item">
                      </el-option>
                    </el-select>
                  </span>
                  <span v-else>
                    <el-select v-model="characterItem.computeOpt" slot="prepend" placeholder="运算符" style="width: 90px;margin-right: 8px">
                        <el-option label=">" value=">"></el-option>
                        <el-option label="<" value="<"></el-option>
                        <el-option label="=" value="="></el-option>
                    </el-select>
                    <el-input  v-model="characterItem.value" placeholder="请输入特征取值" style="width: 300px" ></el-input>
                    <el-button disabled style="width: 115px;background-color:#f5f7fa;">单位：{{ characterItem.unit }}</el-button>
                </span>
                  <el-button type="primary" plain icon="el-icon-delete" style="margin-left: 10px" @click="deleteToAddDataForm(characterItem)">删除</el-button>
              </div>
              <div style="margin-top: 20px;margin-bottom:10px;display: flex;justify-content: center">
                  <button class="cool-button" @click="submitCharacterCondition">筛选病例</button>
              </div>
                <!-- 显示筛选出来的表数据 -->
            <el-table :data="addTableData" stripe style="width: 100%" height="450" v-show="showAddTableData">
              <el-table-column v-for="(value, key) in addTableData[0]" :key="key" :prop="key" :label="key" width="80">
              <template slot-scope="{ row }">
                <div class="truncate-text">{{ row[key] }}</div>
              </template>
            </el-table-column>
            </el-table>

          </div>


          <span slot="footer" class="dialog-footer">
            <el-button @click="cleanDataInput()">取 消</el-button>
            <el-button type="primary" @click="addTable()">新建表</el-button>
          </span>
          <el-dialog
                  title="特征选择"
                  :visible.sync="characterVisible"
                  width="50%"
                  append-to-body>
              <el-container>
                  <el-aside width="180px">
                      <el-menu
                              default-active="1"
                              class="el-menu-vertical-demo">
                          <el-menu-item index="1" @click="exchangeCharacterList(0)">
                              <span slot="title">人口学</span>
                          </el-menu-item>
                          <el-menu-item index="3" @click="exchangeCharacterList(2)">
                              <span slot="title">生理指标</span>
                          </el-menu-item>
                          <el-menu-item index="4" @click="exchangeCharacterList(3)">
                              <span slot="title">行为学</span>
                          </el-menu-item>
                      </el-menu>
                  </el-aside>
                  <el-main>
                      <el-radio-group v-model="characterId">
                          <el-radio v-for="optItem in characterOptList" :key="optItem.characterId" :label="optItem.characterId" border style="margin-bottom: 10px">{{ optItem.chName }}</el-radio>
                      </el-radio-group>
                  </el-main>
              </el-container>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="confirmCharacter()">确 定</el-button>
              </span>
          </el-dialog>
      </el-dialog>
      <!--===============================     导入数据表单   ===================================================================-->
      <el-dialog
              v-loading="loading"
              :element-loading-text="loadText"
              id="importDataTable"
              title="导入数据表"
              :visible.sync="dialogFormVisible"
              
              width="40%"
      >
          <el-form
                  :model="dialogForm"
                  ref="dialogFormRef"
                  :rules="dialogForm.rules"
                  label-width="110px"
          >
              <el-form-item label="选择数据表" prop="filesInfo">
                  <el-upload
                          action=""
                          class="upload"
                          ref="uploadRef"
                          :on-preview="handlePreview"
                          :on-remove="handleRemove"
                          :on-change="changeFile"
                          :auto-upload="false"
                          accept=".csv"
                          :limit="1"
                          :multiple="false"
                          :file-list="dialogForm.filesInfo"
                          :http-request="
                        (data) => {
                          upRequest(data);
                        }
                      "
                  >
                      <el-button slot="trigger" size="small" type="success"
                      >选取文件</el-button
                      >
                      <div slot="tip" class="el-upload__tip">只能上传csv文件</div>
                  </el-upload>
              </el-form-item>

              <el-form-item label="数据表名称" prop="tableName">
                  <el-input
                          v-model="dialogForm.tableName"
                          placeholder="请输入数据表名称"
                  ></el-input>
              </el-form-item>
              <el-form-item label="涉及疾病" prop="dataDisease">
                  <el-select
                          v-model="dialogForm.dataDisease"
                          filterable
                          placeholder="请选择"
                  >
                      <el-option
                              v-for="item in disOptions"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name"
                      >
                      </el-option>
                  </el-select>

            
              </el-form-item>


              <el-form-item label="数据类型" prop="datatype">
              <el-select
                          v-model="dialogForm.datatype"
                          filterable
                          placeholder="请选择"
                  >
                      <el-option
                              v-for="item in datatypes"
                              :key="item.name"
                              :label="item.name"
                              :value="item.name"
                      >
                      </el-option>
                  </el-select>  </el-form-item>

          </el-form>
          <div slot="footer" class="dialog-footer">
              <el-button
                      @click="
                      dialogFormVisible = false;
                      resetForm();
                    "
              >取消</el-button
              >
              <el-button @click="resetForm('dialogFormRef')">重置</el-button>
              <el-button type="primary" @click="uploadFile">下一步</el-button>
          </div>

          <el-dialog
                  v-loading="loading2"
                  :element-loading-text="loadText2"
                  append-to-body
                  title="请选择特征类型"
                  :visible.sync="featuresVision"
          >
              <el-form class="featureLabel" label-width="auto">
                  <el-form-item
                          v-for="(name, index) in Object.keys(featuresMap)"
                          :key="index"
                          :label="name"
                  >
                      <el-select
                              v-model="featuresMap[name]"
                              placeholder="请选择特征类型"
                              @change="changeLabel(name, featuresMap[name])"
                      >
                          <el-option
                                  label="诊断"
                                  value="diagnosis"
                                  key="diagnosis"
                          ></el-option>
                          <el-option
                                  label="检查"
                                  value="examine"
                                  key="examine"
                          ></el-option>
                          <el-option
                                  label="病理"
                                  value="pathology"
                                  key="pathology"
                          ></el-option>
                          <el-option 
                            label="生命特征" 
                            value="vital_signs" 
                            key="vital_signs"
                            ></el-option>
                          <el-option 
                            label="标签" 
                            value="label" 
                            key="label"
                            ></el-option>
                      </el-select>
                  </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="compelete">完成上传</el-button>
              </div>
          </el-dialog>
      </el-dialog>
 <!--===============================     导入字段管理的表   ===================================================================-->
</div>

 <el-dialog
      id="importDataTable"
      title="对所有特征进行分层次"
      :visible.sync="dialogFormVisible1"
      :close-on-click-modal="false" 
     
      :close-on-press-escape="false"
      width="40%"
      class="dialog"
    >
      <el-form
        :model="dialogForm"
        ref="dialogFormRef"
        :rules="dialogForm.rules"
        label-width="110px"
      >
        <el-form-item label="特征个数" prop="featuresNum">
          <el-input-number
            v-model="dialogForm.featuresNum"
            :min="this.featuresNum"
            :step="1"
            @change="generateFields"
          ></el-input-number>
        </el-form-item>
        <el-form-item
       
          v-for="(field, index) in dialogForm.fields"
          :key="index"
          :label="'特征' + (index + 1)"
          :prop="'field'"
        
        >
          <el-input
            v-model="field.featureName"
            class="feature"
            :placeholder="'请输入特证' + (index + 1) + '名称'"
          ></el-input>

          <el-input
            v-model="field.featureNameCn"
            class="feature"
            :placeholder="'请输入特证' + (index + 1) + '中文名称'"
          ></el-input>
      
          <el-select v-model="field.she" style="  margin-left:20px;" placeholder="请选择特征类型" class="feature">
            <el-option label="临床表征" value="0"></el-option>
            <el-option label="生活行为习惯" value="1"></el-option>
            <el-option label="社会环境" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
        <el-button @click="resetForm1()">重置</el-button>
        <el-button type="primary" @click="submitTable">提交</el-button>
      </div>
    </el-dialog>



    <div class="right_table">
        <el-card class="right_table_topCard">
       

          <div class="describe_content">
            <!-- <h3>{{showDataForm.tableName}}</h3> -->   <div style="margin-left: 50%;"><span ><h3>数据预览</h3></span></div>
            <p style="margin-top:0.5%">
              
              <i class="el-icon-user"></i>创建人: <span>{{showDataForm.createUser}}</span>
              <i class="el-icon-time"></i>创建时间: <span>{{showDataForm.createTime}}</span>
              <i class="el-icon-folder-opened"></i>所属类别: <span>{{showDataForm.classPath}}</span>
              <i class="el-icon-document"></i>特征列: <span>{{allColumns.length}}列</span>
            </p>
           
          </div>
          <el-button type="primary" style="margin-left: 15%;" @click="showColumnSelection=true">导出数据</el-button>
          <!-- 显示表数据 -->
          <div class="tableData">
            <!-- <el-button @click="exportToCSV()" type="primary">导出数据</el-button> -->
           

            <el-dialog :title="'选择导出特征'"  :visible.sync="showColumnSelection">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
              全选
            </el-checkbox>
            <el-checkbox-group v-model="selectedColumns">
              <el-checkbox v-for="item in allColumns" :label="item" :key="item">
                <span style="width: 100px; display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">
                  {{ item }}
                </span>
              </el-checkbox>
            </el-checkbox-group>
            
            <div slot="footer">
              <el-button @click="showColumnSelection = false">取消</el-button>
              <el-button type="primary" @click="handleExport">确认导出</el-button>
            </div>
          </el-dialog>

          <el-table :data="tableData"  style="width: 100%" class="">
          <el-table-column  v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key"  >
            <template slot-scope="{ row }">
              <div :class="{'first-row': $index === 0}" class="truncate-text">{{ row[key] }}</div>
            </template>
          </el-table-column>
        </el-table>


        <!-- <el-table :data="tableData" border style="width: 100%" class="custom-table">
    <el-table-column v-for="(value, key) in tableData[0]" :key="key" :prop="key" :label="key" :min-width="100" width="auto" :fit="true" :sortable="true">
      <template slot-scope="{ row }">
        <div class="truncate-text">{{ row[key] }}</div>
      </template>
     
      <template slot="header">
        <div style="cursor: pointer; ">
          {{ key }}
          <i v-if="sortKey === key && sortOrder === 'ascending'" class="el-icon-arrow-up" style="color: blue;"></i>
          <i v-else-if="sortKey === key && sortOrder === 'descending'" class="el-icon-arrow-down" style="color: blue;"></i>
        </div>
      </template>
    </el-table-column>
  </el-table> -->
    
        

          </div>


          
        </el-card>
      </div>
  </div>
</template>

<script>

import * as XLSX from 'xlsx'; // 导入整个XLSX库
import { utils } from 'xlsx';
import {  json_to_sheet, book_new, book_append_sheet, write } from 'xlsx';
import { getRequest, postRequest, saveParentDisease } from "@/api/user";
import { getFetures } from "@/api/feature.js";
import { getCategory, addDisease, removeCate } from "@/api/category";
import { getTableDes, getTableData} from "@/api/tableDescribe.js";
import { mapGetters, mapMutations, mapState, mapActions } from "vuex";
import { disOptions } from "@/components/tab/constData.js";
import { datatypes } from "@/components/tab/datatype.js";
import { resetForm, debounce } from "@/components/mixins/mixin.js";
import FileSaver from 'file-saver'; // 首先确保引入了FileSaver库
import { Parser } from 'json2csv';




let id = 1000;

export default {
  mixins: [ debounce],
  computed: {
    ...mapGetters(["dataDisList", "dataCreatorList"]),
    ...mapState(["dataList"]),
    loginUserID(){
      return sessionStorage.getItem("userid")
    },  treeDataWithIndex() {
    let index = 0;
    return this.treeData.map(node => ({
      ...node,
      index: ++index,
    }));
  },
  },

  watch: {
    "dialogForm.tableName"() {
      this.checkTableName();
    },
    "addDataForm.dataName"() {
      this.checkAddTaleName();
    },
  },

  data() {
    return {
      deleteIconCount: 0, // 用于存储 icon="el-icon-delete" 的个数
      sortKey: '', // 当前排序列的键名
      sortOrder: '', // 当前排序顺序，可选值为 'ascending'（升序）和 'descending'（降序）
      allColumns:[],
      checkAll: false,
      selectedColumnKeys: [],
      showColumnSelection:false,
      selectedColumns:[],
      // 获取虚拟树形结构数据
      // treeData: JSON.parse(JSON.stringify(treeData)),
      treeData: [],
      // 获取虚拟表格数据
      // tableData: JSON.parse(JSON.stringify(tableData)),
      tableData: [],
      fullData: '',
      showTooltip: false,
      isIndeterminate: true,
      hoverTimer: null,
      dialogDiseaseVisible: false,
      dialogDataVisible: false,
      characterVisible: false,
      showAddTableData: false,
      characterId:1,
      showDataForm: {
          tableName:'',
          createUser:'',
          createTime:'',
          classPath:''
      },
      totalPrimaryDiseases: 3, // 假设一级病种的总数为10
      totalDatasets: 10 ,// 假设数据集的总数为5
      showFeatureDataForm: {
          tableName:'',
          createUser:'',
          createTime:'',
          classPath:''
      },
      addDataForm:{
          dataName:"",
          createUser: "",
          createTime: "",
          path: "",
          characterList:[
              {
                  opt:'',
                  characterId:-1,
                  featureName: '',
                  chName: '',
                  type: '',
                  unit:'',
                  range:'',
                  button:'点击选择特征',
                  value:'',
                  computeOpt:''
              }
          ]
      },
      characterOptList:[
      ],
      addTableData: [],
      input3: '',
      select: '',

      dialogDiseaseVisible2: false,

      nodeData: {},
      featureForm: {
        featureName: "",
        diseaseName: "",
        she: null,
        featureNameCn: ""
      },
      diseaseName:'',

      loading: false,
      loading2: false,
      getData_loading: false,
      loadText: "拼命加载中",
      loadText2: "拼命加载中",
      disease: "",
      creator: "",
      datatypes,
      disOptions,
      featuresVision: false,
      DatadialogVisible:false,
      featuresMap: {},
      patientTable:[],
      dialogForm: {
        datatype:null,
        filesInfo: [],
        tableName: "",
        isOnly: true,
        dataDisease: "",
        featuresNum: 1,
        fields: [{ name: "", type: "" }],
        rules: {
          tableName: [
            {
              required: true,
              message: "数据表名称不能为空",
              trigger: "change",
            },
          ],
          dataDisease: [
            {
              required: true,
              message: "涉及疾病不能为空",
              trigger: "blur",
            },
          ],
          datatype: [
            {
              required: true,
              message: "数据类型不能为空",
              trigger: "blur",
            },
          ],
          numFeatures: [
            { required: true, message: "特征个数不能为空", trigger: "blur" },
            { type: "integer", message: "特征个数需为整数", trigger: "blur" },
            { min: 1, message: "特征个数需>1", trigger: "blur" },
          ],
        },
      },
      filters: {}, // 存储每列的筛选条件
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dataid:'1005',
      datalable:'copd',
      options: {
        method: "post",
        data: {},
        url: "/admin/api/DataTable/upload",
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    };
  },
mounted(){
  const firstRow = this.tableData[0];
    for (const key in firstRow) {
      this.$set(this.filters, key, ''); // 初始化筛选条件为空字符串
    }
  
},
  created() {
    // 检查重名的防抖函数
    this.checkTableName = this.debounce(() => {
      getRequest("/admin/api/DataTable/inspection", {
        newname: this.dialogForm.tableName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    this.checkAddTaleName = this.debounce(() => {
      getRequest("/admin/api/DataTable/inspection", {
        newname: this.addDataForm.dataName,
      }).then((res) => {
        console.log(res);
        // 上一次重复了这一次不重复就要提醒一下
        if (!this.dialogForm.isOnly && res.data) {
          this.$message({
            showClose: true,
            message: "表名可用",
            type: "success",
          });
        }
        if (typeof res.data === "boolean") {
          this.dialogForm.isOnly = res;
        }
        if (!res.data) {
          this.$message({
            showClose: true,
            message: "数据表重名，请重新填写",
            type: "warning",
          });
          return false;
        }
        return true;
      });
    }, 200);
    this.getCatgory();
     this.getTableDescribe("1005","copd")
     this.getTableData("1005","copd");
  },
  watch: {
    selectedColumns(newVal) {
      this.handleCheckChange();
    },
  },
  methods: {
    handleSortChange(key) {
      // 如果当前点击的列和之前的排序列相同，则切换排序顺序
      if (key === this.sortKey) {
        this.sortOrder = this.sortOrder === 'ascending' ? 'descending' : 'ascending';
      } else { // 否则，将当前点击的列设为排序列，并设置排序顺序为升序
        this.sortKey = key;
        this.sortOrder = 'ascending';
      }
      // 处理排序逻辑，这里你可以根据自己的需求进行排序
      console.log('当前排序列：', this.sortKey, '，排序顺序：', this.sortOrder);
    },
    handleFilterChange(key) {
      // 处理筛选条件改变事件
      console.log('筛选条件改变：', key, this.filters[key]);
    },
    //字段表的重置
    resetForm1() {
      this.dialogForm.dataSetName = "";
      this.dialogForm.featuresNum = 1;
      this.dialogForm.fields = [{ featureName: "", she: null, featureNameCn: "" }];
    },
    handleCheckAllChange(val) {
      this.selectedColumns = val ? this.allColumns : [];
      this.isIndeterminate = false;
    },
    handleCheckChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allColumns.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.allColumns.length;

      
    },
    //提交对字段的管理
    submitTable() {

      for(let i=0; i < this.dialogForm.fields.length; i++){
      const field = this.dialogForm.fields[i];
  if (!field.featureNameCn || !field.featureName || !field.she) {
    this.$message.error("请填写完整的字段信息");
    return; // 中断循环
  }}
      const FeaturesLen = this.dialogForm.fields.length
      console.log(this.dialogForm.fields)
      console.log(FeaturesLen)
      for(let i=0; i < FeaturesLen; i++){
        this.featureForm.diseaseName = this.dialogForm.dataDisease
        this.featureForm.featureNameCn = this.dialogForm.fields[i].featureNameCn
        this.featureForm.featureName = this.dialogForm.fields[i].featureName
        this.featureForm.she = this.dialogForm.fields[i].she
        postRequest("admin/table/addFeatures", this.featureForm).then(
          (response) => {
            if (response.code == "200") {
           
                this.$message.success("保存成功")

              }
              else{
                this.$message.error("保存失败,该字段已存在")
              }
              this.dialogFormVisible1 = false;
          }
        )
      }
      
    },


    show1(){
      this.showColumnSelection=true
    },
    handleExport() {
      this.showColumnSelection = false; // 关闭对话框
      // 现在可以使用this.selectedColumns来进行数据导出
 

      this.exportData(this.selectedColumns);
    },

exportData(selectedColumns) {
  getTableData("/admin/api/getTableData1", this.dataid, this.datalable)
    .then(response => {

      // 确保 response.data 不为空
      if (response.data && response.data.length > 0) {
        this.tableData1 = response.data;
        console.log("数据长度：" + response.data.length);

        // 根据selectedColumns过滤tableData
        const filteredData = this.tableData1.map(row => {
          return selectedColumns.reduce((acc, key) => ({
            ...acc,
            [key]: row[key],
          }), {});
        });

        // 将数据转换为适合Excel的工作簿对象
        const ws = utils.json_to_sheet(filteredData); // 或者 utils.json_to_sheet(filteredData);

            // 创建工作簿
            const wb = XLSX.utils.book_new();

            // 添加worksheet到工作簿
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // 导出为Excel文件
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            // 使用FileSaver或者其他兼容的方式保存文件
            saveAs(blob, 'selected_data.xlsx'); // 假设 saveAs 函数来自 FileSaver 库
          } else {
            console.error("未获取到有效的表数据。");
          }
        })
        .catch(error => {
          console.error("获取表数据出错：", error);
        });
},

    compelete() {
      // 判断多标签合理性
      let labelCount = 0;
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          if (this.featuresMap[key] == "label") {
            labelCount++;
          }
        }
      }
      if (labelCount < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请至少设置一个标签特征",
        });
        return false;
      }
      if (this.dialogForm.dataDisease != "多疾病" && labelCount > 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "只有多病种数据集能设置多个标签特征",
        });
        return false;
      }

      this.loadText2 = "正在添加字段类型";
      this.loading2 = true;
      let tableHeaders = [];
      for (const key in this.featuresMap) {
        if (Object.hasOwnProperty.call(this.featuresMap, key)) {
          switch (this.featuresMap[key]) {
            case "diagnosis":
              tableHeaders.push({
                fieldName: key,
                isDiagnosis: "1",
              });
              break;
            case "examine":
              tableHeaders.push({
                fieldName: key,
                isExamine: "1",
              });
              break;
            case "pathology":
              tableHeaders.push({
                fieldName: key,
                isPathology: "1",
              });
              break;
            case "vital_signs":
              tableHeaders.push({
                fieldName: key,
                isVitalSigns: "1",
              });
              break;
            case "label":
              tableHeaders.push({
                fieldName: key,
                isLabel: "1",
              });
              break;
            default:
              break;
          }
        }
      }
      // let userId = sessionStorage.getItem("userid")-0;
      // 上传特征分类结果
      postRequest("/admin/api/feature/insertFeature", {
        tableName: this.dialogForm.tableName,
        tableHeaders
        // userId
      }).then((res) => {
        console.log(res);
        this.dialogFormVisible = false;
      });

      
    },
    changeLabel(name, label) {
      console.log("name: ")
      console.log(name)

      console.log("label:")
      console.log(label)

      this.featuresMap[name] = label;
    },
    confirmCharacter(){
      this.characterVisible = false
      let index = this.addDataForm.characterList.indexOf(this.characterOptItem)
      let oldObj = this.addDataForm.characterList[index]
      for (let i = 0; i < this.characterOptList.length; i++) {
          let a = this.characterOptList[i]
          if (this.characterId == a.characterId){
              oldObj.characterId = a.characterId
              oldObj.featureName = a.featureName
              oldObj.chName = a.chName
              oldObj.type = a.type
              oldObj.unit = a.unit
              oldObj.range = a.range
              oldObj.button = a.chName
              oldObj.value = ''
              oldObj.opt = a.opt
          }
      }
      this.addDataForm.characterList[index] = oldObj
      console.log(this.addDataForm.characterList);
      this.characterId=''
    },
    
    // 数据表上传函数
  upRequest(data) {
  console.log("开始上传文件");
  const payload = new FormData();
  payload.append("file", data.file);
  payload.append("newName", this.dialogForm.tableName);
  payload.append("disease", this.dialogForm.dataDisease);
  const user = JSON.parse(localStorage.getItem("user"));
  payload.append("user", user.name);
  payload.append("uid", user.id);
  payload.append("parentId", this.nodeData.id);
  payload.append("parentType", this.nodeData.path);
  payload.append("dataType", this.dialogForm.datatype);
  console.log('name', user.name);
  console.log('id', user.id);
  console.log('表名字', this.dialogForm.tableName);
  console.log('数据表上传函数');
  console.log("数据类型!!!!!", this.dialogForm.datatype)

  const options = {
    method: "post",
    data: payload,
    url: "/admin/api/dataTable/upload",
    transformRequest: [(data, headers) => {
      // 在这里可以手动设置请求头的 Content-Type
      headers["Content-Type"] = "multipart/form-data";
      return data;
    }],
  };
console.log('上传的数据',payload)
  this.$axios(options).then((res) => { // 返回表头信息
    this.loading = false;
    console.log('res', res);
    if (res.code == "200") {
      this.$message({
        showClose: true,
        type: "success",
        message: "解析成功",
      });
 
      console.log("返回数据为：");
      console.log(res);
      let featureList = res.data;
      const tempData = res.data
      console.log(featureList)
      this.dialogForm.featuresNum=res.data.length;
      this.featuresNum = res.data.length;
      this.dialogForm.fields = [];
          for(let i = 0; i < res.data.length; i++){
            const obj = {
              featureName: tempData[i]
            }
            console.log(obj)
            this.dialogForm.fields.push(obj)
          }
          console.log(123)
      console.log(this.dialogForm.fields)
     
      // 把特征存为map的键
      for (const item of featureList) {
        this.$set(this.featuresMap, item, "diagnosis");
      }
    //  this.featureSelect();
      // this.featuresVision = true;
      
      this.dialogFormVisible = false;
      this.dialogFormVisible1 = true;
      this.getCatgory();
    //  this.dialogFormVisible1 = true;//字段管理的框
    } else {
      this.$message({
        showClose: true,
        type: "error",
        message: "解析失败",
      });
    }
  });
}
,
    getCatgory(){
      getCategory("/admin/api/category").then((response)=>{
       this.treeData = response.data;
       console.log(111)
       console.log(response.data)
      })
   
    },
    uploadFile() {
      console.log("开始上传文件")
      if (this.$refs["uploadRef"].uploadFiles.length < 1) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "请选择数据表",
        });
        return false;
      }
      this.checkTableName();
      if (!this.dialogForm.isOnly) {
        return false;
      }
      this.$refs["dialogFormRef"].validate((valid) => {
        if (valid) {
          this.loadText = "正在上传并解析文件";
          this.loading = true;
          this.$refs.uploadRef.submit();
        }
      });
    },
    getTableDescribe(id, label){
      this.showDataForm.tableName = label;
      getTableDes("/admin/api/tableDescribe",id).then(response=>{
        console.log(111)
        console.log(response)
       // let res = JSON.parse(response.data);
        this.showDataForm.createUser = response.data.createUser;
        this.showDataForm.createTime = response.data.createTime;
        this.showDataForm.classPath = response.data.classPath;
      })
      .catch(error=>{
        console.log("错误",error)
      });
    },

    async getTableData(tableId, tableName) {
      try {
        const response = await getTableData("/admin/api/getTableData", tableId, tableName);
        this.tableData = response.data;
        console.log(123)
        console.log( response)
        // 假设表头在数据的第一行
        if (Array.isArray(this.tableData) && this.tableData.length > 0) { 
          this.allColumns = Object.keys(this.tableData[0]); // 对象形式的表头
          // 或者，如果表头是数组形式：this.allColumns = this.tableData[0];
          
          console.log("限制数据长度" + this.tableData.length);
          console.log("表头: ", this.allColumns);
        } else {
          console.warn("没有获取到表头数据");
        }
      } catch (error) {
        console.error("获取数据时发生错误:", error);
      }
    },

    resetForm() {
      this.dialogForm.tableName="",
      this.dialogForm.dataDisease="",

      this.dialogForm.datatype = "";
      this.dialogForm.filesInfo = [];
      // this.dialogForm.featuresNum = 1;
      // this.dialogForm.fields = [{ featureName: "", she: null, featureNameCn: "" }];
    },
  

    changeData(data){
      if(data.isLeafs==1) {
        //获取描述信息
        this.getTableDescribe(data.id, data.label);
        //获取数据信息
        this.tableData = [];
        this.getTableData(data.id, data.label);
        this.dataid=data.id;
        this.datalable=data.label;
      }
    
     
    },
    // 其他方法...
 
    append(isLeaf) {
        // 发送请求新增一个病种信息（目录结构）
        let catagoryNode = {
          label: this.diseaseName,
          catLevel: this.nodeData.catLevel+1,
          parentId: this.nodeData.id,
          isLeafs: isLeaf,
          isCommon: this.nodeData.isCommon,
          path: this.nodeData.path+"/"+this.diseaseName,
          isDelete: 0,
          children: []
        };

        let catagoryNodeJSON = JSON.stringify(catagoryNode);
        addDisease("/admin/api/addDisease",catagoryNodeJSON).then(response=>{
          this.getCatgory(); //刷新目录结构
          console.log(response.data);
        })
        .catch(error=>{
          alert("新增疾病目录错误"+error)
        })
        this.nodeData = {};
        this.cleanInput();
        this.dialogDiseaseVisible = false;
    },
      appendCommon() {
          const newChild = { id: id++, label: this.diseaseName, children: [] , isLeafs: false,isCommon:true};
          if (!this.nodeData.children) {
              this.$set(this.nodeData, 'children', []);
          }
          this.nodeData.children.push(newChild);
          this.nodeData = {};
          this.cleanInput();
      },
    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === data.id);
      children.splice(index, 1);
      removeCate("/admin/api/category/remove",data).then(response=>{ // data就是要删除的目录信息
        console.log(response.data);
        this.showDataForm={};
        this.tableData=[];
      }).catch(error=>{
        console.log(error);
      })
    },

    addDisease() {
      console.log("name:",this.diseaseName)
      let diseaseName = this.diseaseName;
      saveParentDisease("/admin/api/addParentDisease", diseaseName).then(response=>{
        this.getCatgory();
        this.cleanInput();
      }).catch(error=>{
      })
      // const newNode = { id: id++, label: this.diseaseName, children: [] , isLeafs: false};
      // this.treeData.push(newNode);
      
    },

    handleCheckChange(data, checked) {
      if (checked) {
        this.$refs.tree.setCheckedKeys([data.id])
      }
    },

    markNode(data){
      console.log(data);
      this.nodeData = data;
    },

    cleanInput(){
      this.dialogDiseaseVisible = false;
      this.dialogDiseaseVisible2 = false;
      this.diseaseName = ""
    },
    cleanDataInput(){
      this.dialogDataVisible = false
    },
    addTable(){ // 创建表
      this.diseaseName = this.addDataForm.dataName
      this.dialogDataVisible = false
       let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      console.log(filterConditions);
      this.options = {
        method: "post",
        data: filterConditions,
        url: "/admin/api/createTable",
        headers: {
          "Content-Type": "application/json",
        },
      };
      this.$axios(this.options).then(res=>{
        console.log("数据:")
        console.log(res.data);
        this.getCatgory();
      });
      
    },
    putToAddDataForm(){
        let number = -Math.floor(Math.random() * 100);
        let item = {
            opt:'',
            characterId:-1,
            featureName: '',
            chName: '',
            type: '',
            unit:'',
            range:'',
            removeIndex:number,
            button:'点击选择特征',
            value:'',
            computeOpt:''
        }
        this.addDataForm.characterList.push(item);
    },
    deleteToAddDataForm(item){
        let index = this.addDataForm.characterList.indexOf(item)
        if (index !== -1) {
            this.addDataForm.characterList.splice(index, 1)
        }
    },
    chooseCharacter(item){
        this.exchangeCharacterList(0);
        this.characterVisible = true
        this.characterOptItem = item
    },
    submitCharacterCondition() {
      console.log("this.addDataForm.characterList");
      console.log(this.addDataForm.characterList)
      let filterConditions = {};
      filterConditions.addDataForm = this.addDataForm;
      filterConditions.nodeData = this.nodeData;
      this.options = {
        method: "post",
        data: filterConditions,
        url: "/admin/api/filterTableData",
        headers: {
          "Content-Type": "application/json",
        },
      };
      console.log("请求参数："+JSON.stringify(filterConditions))
      this.$axios(this.options).then(res=>{
        this.addTableData = res.data;
        console.log("数据:")
        console.log(this.addTableData)
        this.showAddTableData = true
      }).catch((error)=>{
        this.$message.error("获取数据失败");
        console.log("获取数据失败"+error);
      });
        let s = JSON.stringify(this.addDataForm.characterList, null, 2);
        console.log("this.addDataForm:")
        console.log(this.addDataForm)
        console.log(s)
    },
    getNowDateFormat() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },
    openAddDataForm(type) {
        this.addDataForm = {
            dataName:"",
            createUser:sessionStorage.getItem("username"),
            characterList:[
                {
                    opt:'',
                    characterId:-1,
                    featureName: '',
                    chName: '',
                    type: '',
                    unit:'',
                    range:'',
                    button:'点击选择特征',
                    value:'',
                    computeOpt:''
                }
            ]
        }
        this.dialogDataVisible=true
        this.showAddTableData=false
        this.showFeatureDataForm.createUse = sessionStorage.getItem('username')
        this.showFeatureDataForm.createTime = this.getNowDateFormat()
        this.showFeatureDataForm.classPath = type
    },
    exchangeCharacterList(index){
      getFetures("/admin/feature/getFeatures",index).then(response=>{
        console.log("特征为：");
        console.log(response.data);
        this.characterOptList = response.data;
        console.log(this.characterList)
      }).catch(error=>{
        console.log(error);
      })
    },
    ...mapMutations(["SetDataList"]),
    ...mapActions(["getDataList"]),
    getData(tablename) {
      this.DatadialogVisible = true;
      this.getData_loading = true;
      getRequest("/DataTable/getInfoByTableName", {
        tableName: tablename,
      }).then((res) => {
        this.patientTable = res.data;
        console.log("patientTable:"+res.data);
        this.getData_loading = false;
      });
    },

    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(row) {
      postRequest(`DataTable/delete/${row.id}`).then((res) => {
        this.SetDataList(res.reverse());
      });
    },
    clearFilter() {
      this.disease = "";
      this.creator = "";
    },
    importData() {
      this.dialogFormVisible = true;
    },

    handleSubmit() {
      console.log("文件上传中...");
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload(file) {
      //上传前的验证
      const isCSV =
        file.type === "text/csv" || file.type === "application/vnd.ms-excel";
      // const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isCSV) {
        this.$message.error("上传文件仅支持 CSV 格式");
      }
      // if (!isLt2M) {
      //     this.$message.error('上传文件大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
      return isCSV;
    },

    removeFileExtension(fileName) {
      // 寻找最后一个点号的位置
      const lastDotIndex = fileName.lastIndexOf(".");

      // 如果找到了点号并且不在文件名的开头或结尾
      if (
        lastDotIndex !== -1 &&
        lastDotIndex < fileName.length - 1 &&
        lastDotIndex > 0
      ) {
        // 返回删除了后缀的文件名部分
        return fileName.substring(0, lastDotIndex);
      } else {
        // 如果没有找到点号或者点号在文件名的开头或结尾，直接返回原文件名
        return fileName;
      }
    },

    changeFile() {
      console.log(this.$refs["uploadRef"].uploadFiles);
      if (this.dialogForm.tableName.length < 1) {
        this.dialogForm.tableName = this.removeFileExtension(
          this.$refs["uploadRef"].uploadFiles[0].name
        );
      }
    },

  },
  
    
};
</script>

<style scoped>
/* 使用/deep/或者::v-deep来穿透样式作用域 */
.custom-table /deep/ .el-table__header-wrapper th {
  font-weight: bold;
  background-color: #f5eaea;
}
#top_buttons > * {
  display: inline-block;
}
.horizontal-line {
  border: none; /* 移除默认的边框 */
  border-top: 1px solid #000; /* 定义水平线的样式，可以根据需要修改颜色、宽度等 */
 
}
.truncate-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

#DiseaseFilter {
  margin-right: 40px;
}
#creatorFilter {
  margin-right: 20px;
}
#top_right_buttons {
  float: right;
  margin-right: 100px;
}
#table {
  margin-top: 10px;
}

.featureLabel {
  height: 55vh;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  overflow: auto;
}

.featureLabel .el-form-item__label {
  color: #252525;
}


.left_tree{
  display: inline-block;
  height: 800px;
  width: 18%;
  border-radius: 3px;
  border-left: 1px solid #e6e6e6;
  border-right: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6; 
  border-bottom: none;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

.right_table {
  display: inline-block;
  height: 85%;
  width: 72%;
  position: absolute;
  border: none;
  /* overflow-y: auto; */
}

.right_table_topCard {
  padding: 0;
  height: auto;
  width: 95%;
  border-radius: 3px;
  border-bottom: 1px solid #e6e6e6;
  position: relative;
  /* top: 2%; */
  left: 1%;
  /* overflow-y: auto; */

}

.describe_content {
  display: inline-block;
  width: 70%;
}

.describe_content span {
  margin: 10px;
}

.add_button {
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.nameInput {
  width: 70%;
}

.addDataClass {
  border-radius: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  padding: 10px;
  font-size: 16px;
}
.addDataClass .el-input {
  width: 160px;
}
.addDataClass .addDataBaseInfo {
  margin-left: 50px;
}
.addDataClass .addDataTitle{
  margin-top: 10px;
  margin-right: 15px;
  padding-bottom: 10px;
  font-size: 18px;
  border-bottom: 1px solid #ebeef5;
}
.el-select .el-input {
  width: 130px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.el-dialog__headerbtn .el-dialog__close {
  display: none;
}
.cool-button {
    display: inline-block;
    padding: 12px 24px;
    font-size: 15px;
    font-weight: bold;
    color: #fff;
    background: linear-gradient(to right, #26acdf, #3ee09a);
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    width: 200px;
    letter-spacing: 1px;
    cursor: pointer
}
.el-icon-warning-outline {
  margin-left: 10px;
  font-size: 20px;
}
.el-icon-warning-outline:hover {
  color: #368ce7;
}
.cool-button::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.1);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
    z-index: -1;
}
.clearfix:before,
.clearfix:after {
 
  display: table;
  content: "";
}  
.lineStyle{
        color: '#5470C6',
     
 }
.cool-button:hover {
    background: linear-gradient(to right, #51bae2, #80e7bb);
}
.first-row {
  font-weight: bold;
  background-color: #8d8181; /* 设置背景色 */
}
.cool-button:hover::before {
    transform: scaleX(1);
}
.custom-table tr {
    background-color: #dcf3fc !important;
}
.tableData {
  width: 100%;
  height: 700px;
  overflow-y: auto;
}
.custom-table {
  width: 100%;
}
</style>