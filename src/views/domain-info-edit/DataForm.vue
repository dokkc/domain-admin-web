<template>
  <div v-loading="loading">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <!-- 域名 -->
      <el-form-item
        :label="$t('域名')"
        prop="domain"
      >
        <el-input
          type="text"
          v-model="form.domain"
          :placeholder="$t('请输入域名')"
          @blur="handleDomainChange"
        ></el-input>
      </el-form-item>

      <!-- 域名注册时间 -->
      <!-- <el-form-item
        label="注册时间"
        prop="domain_start_time"
      >
        <el-date-picker
          v-model="form.domain_start_time"
          type="date"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="域名注册时间"
          :disabled="disabledTime"
        />
      </el-form-item> -->

      <!-- 域名到期时间 -->
      <!-- <el-form-item
        label="到期时间"
        prop="domain_expire_time"
      >
        <el-date-picker
          v-model="form.domain_expire_time"
          value-format="YYYY-MM-DD HH:mm:ss"
          type="date"
          placeholder="域名到期时间"
          :disabled="disabledTime"
        />
      </el-form-item> -->

      <el-form-item
        :label="$t('域名时间')"
        prop="start_time"
      >
        <div class="flex justify-between w-full">
          <el-date-picker
            v-model="form.domain_start_time"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('域名注册时间')"
            :disabled="form.is_auto_update"
            style="width: 170px"
          />

          <span> - </span>

          <el-date-picker
            v-model="form.domain_expire_time"
            type="date"
            value-format="YYYY-MM-DD HH:mm:ss"
            :placeholder="$t('域名到期时间')"
            :disabled="form.is_auto_update"
            style="width: 170px"
          />
        </div>
      </el-form-item>

      <div class="grid grid-cols-2">
        <!-- 自动更新 -->
        <el-form-item          
          :label="$t('自动更新')"
          prop="is_auto_update"
        >
          <el-switch v-model="form.is_auto_update" />

          <el-tooltip
            effect="dark"
            content="如需手动设置过期时间，需关闭自动更新"
            placement="top-start"
            :show-after="500"
          >
            <el-link :underline="false"
              ><el-icon class="ml-sm"><Warning /></el-icon
            ></el-link>
          </el-tooltip>
        </el-form-item>

        <!-- 子域证书 -->
        <el-form-item
          :label="$t('子域证书')"
          prop="is_auto_subdomain"
        >
          <el-switch v-model="form.is_auto_subdomain" />

          <el-tooltip
            effect="dark"
            content="自动识别子域名，并添加证书监控，仅本次提交有效"
            placement="top-start"
            :show-after="500"
          >
            <el-link :underline="false"
              ><el-icon class="ml-sm"><Warning /></el-icon
            ></el-link>
          </el-tooltip>
        </el-form-item>
      </div>

      <div class="grid grid-cols-2">
        <!-- 分组 -->
        <el-form-item
          :label="$t('分组')"
          prop="group_id"
          style="align-self: flex-start"
        >
          <SelectGroup
            class="w-[150px]"
            v-model="form.group_id"
            clearable
          ></SelectGroup>
        </el-form-item>

        <!-- 负责人 -->
        <el-form-item
          v-if="role == RoleEnum.Admin"
          :label="$t('负责人')"
          prop="user_id"
          style="align-self: flex-start"
        >
          <el-tag
            v-if="form.user_id"
            closable
            @close="handleRemoveUser"
            >{{ form.user_name }}</el-tag
          >

          <SearchUser
            v-else
            v-model:keyword="keyword"
            @on-select="handleSelectUser"
          ></SearchUser>
        </el-form-item>
      </div>

      <!-- 标签 -->
      <el-form-item
        :label="$t('标签')"
        prop="tags"
      >
        <div>
          <el-input
            type="text"
            v-model="tag"
            :placeholder="$t('标签，回车确认')"
            @keypress.native.enter="handleAddTag"
            style="width: 180px"
            class="mr-sm"
          ></el-input>

          <div>
            <template v-for="(tag, index) in form.tags">
              <el-tag
                closable
                @close="handleCloseTag(index)"
                >{{ tag }}</el-tag
              >
            </template>
          </div>
        </div>
        <!-- <el-select
          style="width: 100%"
          v-model="form.tags"
          multiple
          filterable
          clearable
          allow-create
          default-first-option
          tag-type="primary"
          :reserve-keyword="false"
          placeholder="输入标签"
          loading
          popper-class="domain-info-edit__tag-select"
        > -->
        <!-- <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              /> -->
        <!-- </el-select> -->
      </el-form-item>

      <!-- 主办单位名称 -->
      <el-form-item
        :label="$t('主办单位')"
        prop="icp_company"
      >
        <el-input
          type="text"
          v-model="form.icp_company"
          :placeholder="$t('请输入主办单位名称')"
        ></el-input>
      </el-form-item>

      <!-- ICP备案 -->
      <el-form-item
        :label="$t('ICP备案')"
        prop="icp_licence"
      >
        <el-input
          type="text"
          v-model="form.icp_licence"
          :placeholder="$t('请输入ICP备案')"
        ></el-input>
      </el-form-item>

      <!-- 备注 -->
      <el-form-item
        :label="$t('备注')"
        prop="comment"
      >
        <el-input
          type="textarea"
          v-model="form.comment"
          :rows="3"
          :placeholder="$t('请输入备注')"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- 操作 -->
    <div class="text-center">
      <el-button @click="handleCancel">{{ $t('取消') }}</el-button>
      <el-button
        type="primary"
        @click="handleSubmit"
        >{{ $t('确定') }}</el-button
      >
    </div>
  </div>
</template>

<script>
/**
 * props:
 *  row
 *
 * event:
 *  on-cancel
 *  on-success
 *
 * created 2022-10-01
 * */
// 引入枚举值
import { formRules } from './config.js'
import SelectGroup from '@/components/SelectGroup.vue'
import SearchUser from '@/components/SearchUser.vue'
import { RoleEnum } from '@/emuns/role-enums.js'
import { useUserStore } from '@/store/user-store.js'
import { useSystemStore } from '@/store/system-store.js'
import { mapState, mapActions } from 'pinia'

export default {
  name: '',

  props: {
    // 数据行
    row: { type: Object, default: null },

    role: {
      type: Number,
      default: RoleEnum.User,
    },
  },

  components: {
    SelectGroup,
    SearchUser,
  },

  data() {
    return {
      RoleEnum,
      loading: false,
      tag: '',
      keyword: '',
      form: {
        // 域名
        domain: '',
        // 备注
        comment: '',
        // 端口
        port: 443,
        // 分组
        group_id: '',

        domain_start_time: '',
        domain_expire_time: '',
        is_auto_update: true,

        icp_company: '',
        icp_licence: '',
        // 标签
        tags: [],

        user_id: '',
        user_name: '',
      },

      options: [],

      rules: formRules,
      disabledTime: false,
      is_auto_subdomain: false,
    }
  },

  computed: {
    ...mapState(useUserStore, {
      userInfo: 'userInfo',
      isAdmin: 'isAdmin',
    }),

    disabledDomain() {
      if (this.row) {
        return true
      } else {
        return false
      }
    },
  },

  methods: {
    async getData() {
      this.loading = true

      if (this.row) {
        let params = {
          domain_info_id: this.row.id,
        }

        const res = await this.$http.getDomainInfoById(params)

        let data = res.data
        // let data = this.row
        // 域名
        this.form.domain = data.domain
        this.form.comment = data.comment
        this.form.group_id = data.group_id
        this.form.domain_start_time = data.domain_start_time
        this.form.domain_expire_time = data.domain_expire_time
        this.form.is_auto_update = data.is_auto_update
        this.form.icp_company = data.icp_company
        this.form.icp_licence = data.icp_licence
        this.form.user_id = data.user_id
        this.form.user_name = data.user_name

        this.form.tags = data.tags || []
        // this.form.port = data.port

        if (this.form.group_id == 0) {
          this.form.group_id = ''
        }

        if (data.is_auto_update) {
          this.disabledTime = true
        }
      } else {
        this.handleSelectUser(this.userInfo)
      }

      this.loading = false
    },

    // 取消
    handleCancel() {
      this.$emit('on-cancel')
    },

    // 提交
    handleSubmit() {
      console.log('handleSubmit', this.form)

      this.$refs['form'].validate((valid) => {
        console.log(valid)

        if (valid) {
          this.confirmSubmit()
        } else {
          return false
        }
      })
    },

    async confirmSubmit() {
      let loading = this.$loading({ fullscreen: true })

      let params = {
        // 域名
        domain: this.form.domain.trim(),
        comment: this.form.comment.trim(),
        group_id: this.form.group_id,
        is_auto_update: this.form.is_auto_update,
        domain_start_time: this.form.domain_start_time,
        domain_expire_time: this.form.domain_expire_time,
        is_auto_subdomain: this.form.is_auto_subdomain,
        tags: this.form.tags,
        icp_company: this.form.icp_company,
        icp_licence: this.form.icp_licence,
      }

      // 管理员可以提交数据
      if (this.role == RoleEnum.Admin) {
        params.user_id = this.form.user_id
      }

      let res = null

      if (this.row) {
        // 编辑
        params['domain_info_id'] = this.row.id
        res = await this.$http.updateDomainInfoById(params)
      } else {
        // 添加
        res = await this.$http.addDomainInfo(params)
      }

      if (res.code == 0) {
        this.$msg.success('操作成功')
        this.$emit('on-success')
      } else {
        this.$msg.error(res.msg)
      }

      this.$nextTick(() => {
        // 以服务的方式调用的 Loading 需要异步关闭
        loading.close()
      })
    },

    handleAddTag() {
      if (!this.tag) {
        return
      }

      this.form.tags.push(this.tag)
      this.tag = ''
    },

    handleCloseTag(index) {
      this.form.tags.splice(index, 1)
    },

    async handleDomainChange() {
      if (!this.form.domain) {
        return
      }

      if (this.form.icp_company && this.form.icp_licence) {
        return
      }

      let params = {
        domain: this.form.domain,
      }

      const res = await this.$http.getICP(params)

      if (res.ok) {
        if (!this.form.icp_company) {
          this.form.icp_company = res.data.name
        }

        if (!this.form.icp_licence) {
          this.form.icp_licence = res.data.icp
        }
      }
    },

    handleSelectUser(data) {
      console.log(data)
      this.form.user_id = data.id
      this.form.user_name = data.username

      this.keyword = ''
    },

    handleRemoveUser() {
      this.form.user_id = ''
      this.form.user_name = ''
    },
  },

  created() {
    this.getData()
  },
}
</script>

<style lang="less">
.domain-info-edit__tag-select {
}
</style>

<style lang="less" scoped>
.el-tag {
  margin-right: 8px;
}
</style>
