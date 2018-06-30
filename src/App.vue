<template>
  <div id="app">
    <mu-appbar color="primary" style="width: 100%">
      <div slot="left">
        <img src="./assets/detective.png" alt="谁是大侦探">
        <h2>谁是大侦探</h2>
      </div>
      <div slot="right">
        {{address}}
      </div>
    </mu-appbar>
    <main>
      <home :stories="stories" :records="records"
            :rank="rank" :address="address"
        @recordAnswer="recordAnswer"></home>
    </main>
    <footer>
      基于<a href='https://nebulas.io/'>星云链</a>开发 |&nbsp;<a href="#" @click="openFeedback">帮助&反馈</a>
    </footer>
    <mu-button style="position: fixed; right: 20px; bottom: 50px; z-index: 999"
               fab color="primary" @click="openEditDialog">
      <mu-icon value="edit"></mu-icon>
    </mu-button>
    <mu-dialog width="100%" transition="slide-bottom" fullscreen :open.sync="openDialog">
      <mu-appbar color="primary" title="编辑侦探故事">
        <mu-button slot="left" icon @click="closeEditDialog">
          <mu-icon value="close"></mu-icon>
        </mu-button>
        <mu-button slot="right" flat @click="saveStory">
          保存
        </mu-button>
      </mu-appbar>
      <mu-alert v-if="showDialogAlert"
                color="error" transition="mu-scale-transition">
        {{alertText}}
      </mu-alert>
      <mu-flex justify-content="center">
        <mu-form style="width: 70%; padding: 20px 0" :model="story" label-width="100">
          <mu-form-item prop="title" label="案件名称" :rules="inputRules">
            <mu-text-field v-model="story.title"></mu-text-field>
          </mu-form-item>
          <mu-form-item prop="content" label="案件内容" :rules="inputRules">
            <mu-text-field v-model="story.content" multi-line
                           :rows="3" :rows-max="6"></mu-text-field>
          </mu-form-item>
          <mu-form-item prop="selection" label="有哪些嫌疑人" :rules="inputRules"
                        help-text="逗号隔开（小王,小明,小红）">
            <mu-text-field v-model="story.selection"></mu-text-field>
          </mu-form-item>
          <mu-form-item prop="answer" label="真凶是谁" :rules="inputRules"
                        help-text="真凶只有一个，请不要输入嫌疑人以外的姓名">
            <mu-text-field v-model="story.answer"></mu-text-field>
          </mu-form-item>
        </mu-form>
      </mu-flex>
    </mu-dialog>
    <mu-dialog width="600" title="帮助&&反馈" :open.sync="openFeedbackDialog">
      <div>
        <h2>游戏说明</h2>

        <p>这是一款激发大家智慧竞争的游戏，游戏有两个角色：</p>

        <ul><li>小说家：发挥脑洞写出最具悬疑最烧脑的侦探故事，剧情、线索完全自由发挥，最后让各路侦探去故事中解开您设下的局，找到真正的犯人。</li><li>侦探：你们是观察力最强最足智多谋的那批人，在每篇小说家的侦探故事中找寻线索，指认犯人，记录自己的成就，荣登侦探排行榜的前列。</li></ul>

        <h2>使用攻略</h2>

        <ol><li>本应用基于<a href="https://nebulas.io/">星云链</a>驱动，WEB 端使用请安装<a href="https://github.com/ChengOrangeJu/WebExtensionWallet">星云钱包插件</a>，移动端使用请安装<a href="https://nano.nebulas.io/index_cn.html">星云钱包 APP</a>。</li><li>小说家通过游戏右下角的编辑按钮即可进入自己的创作之旅。</li><li>每张卡片都是一个精心创作的作案现场，侦探可在首页寻找自己感兴趣的故事，指认真正的犯人。</li><li>成功发现真凶，可将自己的成就记录到星云链上</li></ol>

        <h2>联系开发者</h2>

        <p>欢迎提交意见与反馈，可通过 <a href="mailto:xal821792703@gmail.com">邮件</a> 或 <a href="https://github.com/nitta-honoka/morning-diary/issues">ISSUE</a> 的方式联系我们</p>

        <h2>星云激励计划</h2>

        <p>欢迎参加星云链开发者<a href="https://incentive.nebulas.io/cn/signup.html?invite=LGfSR">激励活动</a>，用一杯下午茶的时间赢取 NAS 奖励</p>

        <h3>现在，让我们开始激发起自己的脑力风暴，成为最厉害的小说家或者侦探吧！</h3>
      </div>
      <mu-button slot="actions" color="primary" @click="closeFeedback">让我们开始吧！</mu-button>
    </mu-dialog>
  </div>
</template>

<script>
import Avatar from 'vue-avatar'
import Home from './views/Home'
export default {
  name: 'App',
  components: {
    'home': Home,
    Avatar
  },
  data() {
    return {
      address: '',
      openDialog: false,
      openFeedbackDialog: false,
      story: {},
      inputRules: [{
        validate: val => !!val,
        message: '不能为空'
      }],
      showDialogAlert: false,
      alertText: '',
      stories: [],
      records: [],
      rank: 0
    }
  },
  methods: {
    openEditDialog () {
      this.showDialogAlert = false
      this.alertText = ''
      this.openDialog = true
    },
    closeEditDialog () {
      this.showDialogAlert = false
      this.alertText = ''
      this.openDialog = false
    },
    saveStory() {
      let { title, content, selection, answer } = this.story || {}
      if (!title || !content || !selection || !answer) {
        this.showDialogAlert = true
        this.alertText = '表单不能为空'
        return
      }
      selection = selection.replace(/[,，]/g, ',')
      answer = answer.replace(/[,，]/g, ',')
      if (!selection.includes(answer)) {
        this.showDialogAlert = true
        this.alertText = '真凶必须是嫌疑人中的一位'
        return
      }
      if (answer.split(',').length > 1) {
        this.showDialogAlert = true
        this.alertText = '真凶只能有一位'
        return
      }
      this.showDialogAlert = false
      this.alertText = ''
      Nasa.call('', 'save', [title, content, selection.split(','), answer])
        .then(payId => {
          this.queryInterval = setInterval(() => this.queryCallStatus(payId), 8000)
        })
        .catch(e => {
          if (e.message === 'tx rejected by user') {
            this.showDialogAlert = true
            this.alertText = '您已取消交易，未保存成功'
          }
          console.error(e)
        })
    },
    queryCallStatus(payId) {
      if (this.queryCount > 4) {
        // 4 次轮询未通过判为超时
        this.showDialogAlert = true
        this.alertText = '交易超时，请稍后再试'
        clearInterval(this.queryInterval)
        return this.queryCount = 0
      }
      this.queryCount = this.queryCount + 1
      Nasa.checkTx(payId)
        .then(resp => {
          if (resp.status === 1) {
            // 交易成功且打包上链
            clearInterval(this.queryInterval)
            this.queryCount = 0
            this.openDialog = false
            this.$toasted.success('保存成功')
            this.getStories()
          }
        })
    },
    getStories() {
      Nasa.query('', 'getAllStories')
      .then(resp => {
        this.stories = resp.map(story => {
          const { detectives } = story
          if (detectives.includes(this.address)) {
            story.status = 1
          } else {
            story.status = 0
          }
          return story
        })
      })
      .catch(e => {
        this.$toasted.error('网络似乎出现了问题，请稍后再试')
        console.error(e)
      })
    },
    getRecords() {
      Nasa.query('', 'getAllRecords')
        .then(resp => {
          const records = resp.sort((a, b) => b.count - a.count)
          const index = records.findIndex(r => r.from === this.address)
          if (index > -1) {
            this.rank = index + 1
          } else {
            this.rank = 0
          }
          this.records = records
        })
        .catch(e => {
          this.$toasted.error('网络似乎出现了问题，请稍后再试')
          console.error(e)
        })
    },
    recordAnswer(id) {
      Nasa.call('', 'record', [id])
      .then(payId => {
        this.queryInterval = setInterval(() => this.queryCallStatus(payId), 8000)
      })
      .catch(e => {
        if (e.message === 'tx rejected by user') {
          this.alertText = '您已取消交易，未保存成功'
        }
        console.error(e)
      })
    },
    openFeedback() {
      this.openFeedbackDialog = true
    },
    closeFeedback() {
      this.openFeedbackDialog = false
    }
  },
  mounted() {
    Nasa.user.getAddr()
      .then(addr => {
        this.address = addr
        this.getStories()
        this.getRecords()
      })
      .catch(e => {
        console.error(e)
        this.$toasted.error('网络似乎出现了问题，请稍后再试')
      })
  }
};
</script>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  /*text-align: center;*/
  /*color: #2c3e50;*/

  > main {
    padding: 20px 0;
    height: calc(100vh - 86px);
    overflow-y: auto;
  }

  > footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    background: #f2f3fc;
  }
}
.mu-appbar-left {
  margin-left: 10px;
  > div:first-child {
    display: flex;
    align-items: center;
    > img {
      width: 36px;
      height: 36px;
      margin-right: 8px;
    }
  }
}

/*#nav {*/
  /*padding: 30px;*/
  /*a {*/
    /*font-weight: bold;*/
    /*color: #2c3e50;*/
    /*&.router-link-exact-active {*/
      /*color: #42b983;*/
    /*}*/
  /*}*/
/*}*/
</style>
