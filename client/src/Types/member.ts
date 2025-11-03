export type Member = {
  sID: string
  dateOfBirth: string
  sImageUrl?: string
  sDisplayName: string
  created: string
  lastActive: string
  sGender: string
  sDescription?: string
  sCity: string
  sCountry: string
}

export type Photo = {
  sId: number
  sUrl: string
  sPublicId?: any
  memberId: string
}