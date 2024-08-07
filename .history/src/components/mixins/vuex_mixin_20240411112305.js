import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState({ m_dataList: "dataList" }),//mapState批量获取数据
    ...mapGetters({ m_dataDisList: "dataDisList" }),
    m_step() {
      return this.$store.state[this.moduleName].step;
    },
    m_taskName() {
      return this.$store.state[this.moduleName].taskName;
    },
    m_principal() {
      return this.$store.state[this.moduleName].principal;
    },
    m_social(){
      return this.$store.state[this.moduleName].social;
    },
    m_living(){
      return this.$store.state[this.moduleName].living;
    },
    m_clinic(){
      return this.$store.state[this.moduleName].clinic;
    },
    m_dataType(){
      return this.$store.state[this.moduleName].m_dataType;
    },

    m_participants() {
      return this.$store.state[this.moduleName].m_participants;
    },
    m_disease() {
      return this.$store.state[this.moduleName].disease;
    },
    m_dataset() {
      return this.$store.state[this.moduleName].dataset;
    },
    m_use_features() {
      return this.$store.state[this.moduleName].use_features;
    },
    m_known_features() {
      return this.$store.state[this.moduleName].known_features;
    },
    m_target_feature() {
      return this.$store.state[this.moduleName].target_feature;
    },
    m_algorithm() {
      return this.$store.state[this.moduleName].algorithm;
    },
    m_SF_DRMB() {
      return this.$store.state[this.moduleName].SF_DRMB;
    },
    m_result() {
      return this.$store.state[this.moduleName].result;
    },
  
    m_city() {//市
      return this.$store.state[this.moduleName].city;
    },
    m_county() {//区县
      return this.$store.state[this.moduleName].county;
    },
    m_province() {//省
      return this.$store.state[this.moduleName].province;
    },
  },
  methods: {
    m_changeStep(newStep) {
      this.$store.commit(`${this.moduleName}/ChangeStep`, newStep);
    },
    m_changeTaskInfo(newValue) {
      this.$store.commit(`${this.moduleName}/ChangeTaskInfo`, newValue);
    },
    m_SF_DRMB_update(newdata) {
      this.$store.commit(`${this.moduleName}/SF_DRMB_update`, newdata);
    },
  },
};
