<template>
  <mu-container>
    <mu-row>
      <mu-col span="8" sm="12" md="8">
        <mu-row :gutter="true" wrap="wrap">
          <mu-col v-for="story in stories" :key="story.id"
            span="4" sm="12" md="6" lg="4">
            <mu-card :raised="true">
              <mu-card-header
                :title="story.status ? `${story.title}（已解决）` : story.title"
                :sub-title="story.author">
              </mu-card-header>
              <mu-card-text>
                {{story.content}}
              </mu-card-text>
              <mu-card-actions>
                <mu-select label="真凶只有一个" v-model="answer[story.id]">
                  <mu-option v-for="s in story.selection"
                             :key="s" :label="s" :value="s"></mu-option>
                </mu-select>
                <mu-button flat color="secondary" @click="recordAnswer(story)">
                  凶手就是TA
                </mu-button>
              </mu-card-actions>
            </mu-card>
          </mu-col>
        </mu-row>
      </mu-col>
      <mu-col offset="1" span="3" sm="12" md="3" class="aside-right">
        <h3>侦探排名</h3>
        <p v-if="rank">{{`您现在是第 ${rank} 名`}}</p>
        <div v-for="(record, index) in records" :key="index">
          <avatar :username="record.from.split('').pop()"></avatar>
          <span>
            <p>{{record.from}}</p>
            <p>{{`共找到${record.count}名犯人`}}</p>
          </span>
        </div>
      </mu-col>
    </mu-row>
  </mu-container>
</template>

<script>
import Avatar from 'vue-avatar'

export default {
  name: 'square',
  components: {
    Avatar
  },
  data() {
    return {
      // stories: []
      answer: {} // id: answer
    }
  },
  props: {
    stories: Array,
    records: Array,
    rank: Number,
    address: String
  },
  methods: {
    recordAnswer(story) {
      const answer = this.answer[story.id]
      if (answer && answer === story.answer) {
        this.$toasted.success('太厉害了，您成功找出了犯人！请将您的成就记录下来吧')
        this.$emit('recordAnswer', story.id)
      } else {
        this.$toasted.error('ta不是犯人呦，请再思考一下')
      }
    }
  },
};
</script>

<style scoped lang="less">
.col {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}
.mu-card {
  .mu-card-sub-title {
    max-width: 200px;
    word-wrap: break-word;
  }
  .mu-card-actions {
    display: flex;
    align-items: center;
  }
}
.aside-right {
  > div {
    display: flex;
    align-items: center;
    .vue-avatar--wrapper {
      max-width: 50px;
      min-width: 50px;
    }
    > span {
      margin-left: 3px;
      max-width: 120px;
      word-wrap: break-word;
    }
  }
}
</style>
