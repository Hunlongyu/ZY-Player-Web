export interface IHistory {
  id?: number
  name: string
  url: string
  date: string
  host: string
  time: string
}

export interface IStar {
  id?: number
  name: string
  url: string
  date: string
  host: string
  time: string
}

export interface ISetting {
  id?: number
  language: string
  history: boolean
}
