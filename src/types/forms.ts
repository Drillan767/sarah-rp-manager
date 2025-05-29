import type { CreateRoleplayVariables, UpdateRoleplayVariables } from '@sarah-rp-manager/default-connector'

export type CreateRoleplayFormType = Omit<CreateRoleplayVariables, 'illustration'> & {
    illustration: File
}

export type UpdateRoleplayFormType = Omit<UpdateRoleplayVariables, 'illustration'> & {
    illustration: File | undefined
}
