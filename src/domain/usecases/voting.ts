export interface IVoting {
  vote: (input: VotingDTO.Input) => Promise<VotingDTO.Output>
}

export namespace VotingDTO {
  export type Input = {
    questionId: string
    surveyId: string
    optionId: string
    phoneNumber: string
    deviceIp: string
  }

  export type Output = void
}
