export interface IHistory {
  id?: number
  name: string
  url: string
  date: string
  host: string
  time: number
}

export interface IStar {
  id?: number
  name: string
  url: string
  date: string
  host: string
  time: number
}

export interface ISetting {
  id?: number
  language: string
  history: boolean
}
