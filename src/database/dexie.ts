import Dexie from 'dexie'
import { IHistory, IStar, ISetting } from './types'

class Database extends Dexie {
  history: Dexie.Table<IHistory>
  star: Dexie.Table<IStar>
  setting: Dexie.Table<ISetting>

  constructor () {
    super('ZYPlayerWeb')

    this.version(2).stores({
      setting: 'id, theme, volume',
      star: '++id, name, url, date, host',
      history: '++id, name, url, date, host, time'
    })

    this.version(3).stores({
      setting: 'id, language, history',
      star: '++id, name, url, date, host, time',
      history: '++id, name, url, date, host, time'
    })

    this.history = this.table('history')
    this.star = this.table('star')
    this.setting = this.table('setting')
  }
}

const db = new Database()

const settingConfig = [
  {
    id: 0,
    language: 'cn',
    history: true
  }
]

db.on('populate', () => {
  db.setting.bulkAdd(settingConfig)
})

db.open()

class History {
  async add (doc: IHistory) {
    return await db.history.add(doc)
  }

  async find (url: string) {
    return await db.history.where({ url }).first()
  }

  async update (id: number, doc: IHistory) {
    return await db.history.update(id, doc)
  }

  async all () {
    return await db.history.toArray()
  }

  async remove (id: number) {
    return await db.history.delete(id)
  }

  async clear () {
    return await db.history.clear()
  }
}

class Star {
  async add (doc: IStar) {
    return await db.star.add(doc)
  }

  async find (url: string) {
    return await db.star.where({ url }).first()
  }

  async update (id: number, doc: IStar) {
    return await db.star.update(id, doc)
  }

  async all () {
    return await db.star.toArray()
  }

  async remove (id: number) {
    return await db.star.delete(id)
  }

  async clear () {
    return await db.star.clear()
  }
}

class Setting {
  async find () {
    return await db.setting.get({ id: 0 })
  }

  async update (doc: ISetting) {
    return await db.setting.update(0, doc)
  }
}

export const historyDB = new History()

export const starDB = new Star()

export const settingDB = new Setting()
