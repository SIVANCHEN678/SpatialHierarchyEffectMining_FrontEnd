<!-- <template>
  <div>
    <object :data="pdfUrl" type="application/pdf" width="100%" height="1000px">
 
</object>
  </div>
</template>

<script>
import { postRequest, getRequest } from "@/api/user";

export default {
  data() {
    return {
      pdfUrl: ''
    };
  },
  mounted() {
    this.loadPDF();
  },
  methods: {
    loadPDF() {
      getRequest('/api/mining/api/pdf', { responseType: 'arraybuffer' })
        .then(response => {
          console.log('响应数据:', response);
          const blob = new Blob([response], { type: 'application/pdf' });
          this.pdfUrl = URL.createObjectURL(blob);
        })
        .catch(error => {
          console.error('加载PDF失败:', error);
        });
    }
  }
}
</script> -->
<template>
  <div>
    <object ref="pdfObject" :data="pdfUrl" type="application/pdf" width="100%" height="1000px">
      <p>您的浏览器不支持PDF插件，请下载PDF查看。</p>
    </object>
  </div>
</template>

<script>
import { postRequest, getRequest } from "@/api/user";

export default {
  data() {
    return {
      pdfUrl: ''
    };
  },
  mounted() {
    this.loadPDF();
  },
  methods: {
    async loadPDF() {
      try {
        const response = await getRequest('/api/pdf', { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));
        this.pdfUrl = url;
      } catch (error) {
        console.error('加载PDF失败:', error);
      }
    }
  },
  beforeUnmount() {
    // 清理URL以避免内存泄漏
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl);
    }
  }
};
</script>