import { IUser } from '@models/types'

export interface ISignTokenAndSendResponseOptions {
  user: Partial<IUser>
  remember: boolean
  message?: string
}

export type TFilteredRequiredFields = Pick<
  IUser,
  'name' | 'email' | 'password' | 'passwordConfirm'
> &
  Record<'remember', '1' | '0' | undefined>
