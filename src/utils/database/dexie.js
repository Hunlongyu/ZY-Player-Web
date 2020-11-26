import Dexie from 'dexie'
const db = new Dexie('ZYPlayerWeb')
db.version(1).stores({
  setting: 'id, theme, volume',
  star: '++id, name, url',
  history: '++id, name, url'
})
db.open()

const { history } = db

export default history {}
