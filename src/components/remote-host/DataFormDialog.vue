<template>
  <!-- 编辑框 -->
  <el-dialog
    :title="dialogTitle"
    v-model="dialogVisible"
    width="400px"
    center
    append-to-body
  >
    <DataForm
      v-if="dialogVisible"
      :row="row"
      @on-cancel="handleClose"
      @on-success="handleSuccess"
    ></DataForm>
  </el-dialog>
</template>

<script>
/**
 * created 2023-07-27
 */
import DataForm from './DataForm.vue'

export default {
  name: '',

  props: {
    // 数据行
    row: {
      type: Object,
      default: null,
    },

    // 显示
    visible: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['update:visible'],

  components: {
    DataForm,
  },

  data() {
    return {
      // currentRow: null,
      // dialogVisible: false,
    }
  },

  computed: {
    dialogTitle() {
      if (this.row) {
        return '编辑主机'
      } else {
        return '添加主机'
      }
    },

    dialogVisible: {
      get() {
        return this.visible
      },

      set(val) {
        this.$emit('update:visible', val)
      },
    },
  },

  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },

    handleOpen() {
      this.$emit('update:visible', true)
    },

    handleSuccess() {
      this.handleClose()
      this.$emit('on-success')
    },
  },

  created() {},
}
</script>

<style lang="less"></style>

<style lang="less" scoped></style>
