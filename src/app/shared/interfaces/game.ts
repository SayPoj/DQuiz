
export interface Game {
  id?: string,
  name?: string,
  shortDescription?: string,
  dateTime?: Date,
  tags?: { name?:string }[],
  fullDescription?: string,
  posterUrl?: string,
  state?: number,
  step?:{
    section: number,
    question:number
  },
  showBroadcast?:boolean,
  showChat?:boolean,
  answers?: {
    name:string,
    id:string,
    questions: {
      id:string,
      correctAnswer: number,
      name: string,
      wrongAnswer: number,
      type: string,
      rightAnswer:number,
      rightAnswers?: {
        name:string
      }[]
      answerOptions?: {
        name:string
      }[]
    }[]
  }[]
  mediaServer?:{
    snapshotId?: number,
    size?: string,
    domain?: string,
    cors: string,
    id?: null,
    ip?: null,
    subdomain?: string,
    price_month?: null,
    price?: null,
    name?: null,
    ipv6?: null,
    created_at?: null,
    isWork?: boolean,
    port?: number,
    status?: string,
    sub_status?: number,
    numberOfConnectionAttempts?: number,
    error?: {
      code?: string,
      info?: string
    }
  },
  teams?: {
    id?,
    name?,
    totalPoints?,
    captain?: {
      name?: string,
      surname?: string,
      lastName?: string,
      email?: string,
      phoneNumber?: string,
    },
    secret?:string,
    answers?: {
      sectionId?:string,
      questionId?:string,
      points?,
      answer?:string
    }[],
  }[]
}
export interface Games extends Array<Game>{}
