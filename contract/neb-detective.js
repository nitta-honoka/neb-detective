/**
 * Created by honoka on 18/6/29.
 */
"use strict"
let Story = function (text) {
  if (text) {
    const obj = JSON.parse(text)
    this.author = obj.author
    this.title = obj.title
    this.content = obj.content
    this.id = obj.id
    this.selection = obj.selection
    this.answer = obj.answer
    this.detectives = obj.detectives
  } else {
    this.author = ''
    this.title = ''
    this.content = ''
    this.id = ''
    this.selection = []
    this.answer = ''
    this.detectives = []
  }
}

Story.prototype = {
  toString: function () {
    return JSON.stringify(this)
  }
}

// let Record = function (text) {
//   if (text) {
//     const obj = JSON.parse(text)
//     this.from = obj.from
//     this.count = obj.count
//   } else {
//     this.from = ''
//     this.count = 0
//   }
// }

// Record.prototype = {
//   toString: function () {
//     return JSON.stringify(this)
//   }
// }

let NebDetective = function () {
  LocalContractStorage.defineProperties(this, {
    // stories: null,
    records: null,
    size: null
  })
  LocalContractStorage.defineMapProperty(this, 'authorList')
  LocalContractStorage.defineMapProperty(this, 'recordItem')
  LocalContractStorage.defineMapProperty(this, 'storyItem', {
    stringify: function (obj) {
      return obj.toString()
    },
    parse: function (text) {
      return new Story(text)
    }
  })
}

NebDetective.prototype = {
  init: function () {
    this.records = []
    // this.stories = []
    this.size = 0
  },
  
  save: function (title, content, selection, answer) {
    const author = Blockchain.transaction.from
    const id = String(this.size || 0)
    // const stories = this.stories
    const story = new Story()
    
    story.author = author
    story.title = title
    story.content = content
    story.id = id
    story.selection = selection
    story.answer = answer
    story.detectives = []
    // this.stories = stories.push(story)
    this.storyItem.put(id, story)
    this.size += 1
    this._saveAuthorList(author, id)
    return 'success'
  },
  
  _saveAuthorList: function (author, id) {
    const ids = this.authorList.get(author) || []
    if (ids.indexOf(id) > -1) {
      // id 已存在，不重复保存
      return
    }
    this.authorList.put(author, ids.concat(id))
  },
  
  record: function (id) {
    const from = Blockchain.transaction.from
    const story = this.storyItem.get(id)
    story.detectives = (story.detectives || []).concat(from)
    this.storyItem.put(id, story)
    
    const records = this.records || []
    if (records.indexOf(from) > -1) {
      const count = this.recordItem.get(from)
      this.recordItem.put(from, parseInt(count) + 1)
    } else {
      this.recordItem.put(from, 1)
      this.records = this.records.concat(from)
    }
    return 'success'
  },
  
  getAllRecords: function (offset, size) {
    const start = offset || 0
    size = size || 10
    let end = start + size
    if (end > this.records.length) {
      end = this.records.length
    }
    
    let result = []
    for (let i = start; i < end; i ++) {
      const from = this.records[i]
      if (from) {
        const count = this.recordItem.get(from)
        result.push({
          from: from,
          count: count
        })
      }
    }
    return result
  },
  
  getAllStories: function () {
    let result = []
    const size = this.size
    for (let i = 0; i < size; i ++) {
      result.push(this.storyItem.get(i))
    }
    return result
  },
  
  getStoriesByAuthor: function () {
    const author = Blockchain.transaction.from
    const ids = this.authorList.get(author) || []
    let result = []
    if (ids && ids.length) {
      ids.forEach(id => {
        result.push(this.storyItem.get(id))
      })
    }
    return result
  }
}

module.exports = NebDetective