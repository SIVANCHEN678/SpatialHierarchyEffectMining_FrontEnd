<template>
    <div class="ValidCode disabled-select"
         :style="`width:${width}; height:${height}`"
         @click="refreshCode">
      <span v-for="(item, index) in codeList"
            :key="index"
            :style="getStyle(item)">
        {{item.code}}
      </span>
    </div>
  </template>
  <script>
  export default {
    name: "ValidCode",
    model: {
      prop: 'value',
      event: 'input'
    },
    props: {
      width: {
        type: String,
        default: '100px'
      },
      height: {
        type: String,
        default: '54px'
      },
      length: {
        type: Number,
        default: 4
      }
    },
    data () {
      return {
        codeList: []
      }
    },
    mounted () {
      this.createdCode()
    },
    methods: {
      refreshCode () {
        this.createdCode()
      },
      createdCode () {
    const len = this.length
    const codeList = []
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
    const charsLen = chars.length
    const fixedFontSize = '20px'; // 设置固定的字体大小
    const charSpacing = '4px'; // 设置固定的字符间距
    const maxPadding = '2px'; // 设置最大的内边距

    // 生成
    for (let i = 0; i < len; i++) {
      const rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)];
      const padding = `${Math.floor(Math.random() * maxPadding) + 1}px`; // 随机内边距在一定范围内
      codeList.push({
        code: chars.charAt(Math.floor(Math.random() * charsLen)),
        color: `rgb(${rgb})`,
        fontSize: fixedFontSize, // 使用固定的字体大小
        padding,
        transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)}deg)`
      });
      
      // 如果不是最后一个字符，添加左右间距
      if (i < len - 1) {
        codeList[i].marginLeft = charSpacing;
        codeList[i].marginRight = charSpacing;
      }
    }

    this.codeList = codeList;
    this.$emit('input', codeList.map(item => item.code).join(''));
  },
  getStyle (data) {
    let styleString = `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`;
    
    // 添加固定的间距样式
    if (data.marginLeft) {
      styleString += `; margin-left: ${data.marginLeft}`;
    }
    if (data.marginRight) {
      styleString += `; margin-right: ${data.marginRight}`;
    }

    return styleString;
  }
    }
  }
  </script>
  <style scoped >
    .ValidCode {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #cdcdcd; /* 添加这条样式，设置为灰色背景 */
    border-radius: 4px; /* 可选，添加圆角边框以增加视觉效果 */
    }

    .ValidCode span {
    display: inline-block;
    margin: 0; /* 清除默认间距 */
    }
  </style>