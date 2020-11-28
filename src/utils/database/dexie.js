import Dexie from 'dexie'

const db = new Dexie('ZYPlayerWeb')

db.version(2).stores({
  setting: 'id, theme, volume',
  star: '++id, name, url, date, host',
  history: '++id, name, url, date, host, time'
})

const settingConfig = [
  {
    id: 0,
    theme: 'light',
    history: true
  }
]

db.on('populate', () => {
  db.setting.bulkAdd(settingConfig)
})

db.open()

class History {
  async add (doc) {
    return await db.history.add(doc)
  }

  async find (doc) {
    return await db.history.where(doc).first()
  }

  async update (id, doc) {
    return await db.history.update(id, doc)
  }

  async all () {
    return await db.history.toArray()
  }

  async remove (id) {
    return await db.history.delete(id)
  }

  async clear () {
    return await db.history.clear()
  }
}

class Star {
  async add (doc) {
    return await db.star.add(doc)
  }

  async find (doc) {
    return await db.star.where(doc).first()
  }

  async update (id, doc) {
    return await db.star.update(id, doc)
  }

  async all () {
    return await db.star.toArray()
  }

  async remove (id) {
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

  async update (doc) {
    return await db.setting.update(0, doc)
  }
}

export const historyDB = new History()

export const starDB = new Star()

export const settingDB = new Setting()
