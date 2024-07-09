<template>
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
</script>
