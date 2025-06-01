import type {
    CreateCharacterTemplateVariables,
    CreateRoleplayVariables,
    UpdateCharacterTemplateVariables,
    UpdateRoleplayVariables,
} from '@sarah-rp-manager/default-connector'

export type CreateRoleplayFormType = Omit<CreateRoleplayVariables, 'illustration'> & {
    illustration: File
}

export type UpdateRoleplayFormType = Omit<UpdateRoleplayVariables, 'illustration'> & {
    illustration: File | undefined
}

export type CreateTemplateFormType = Omit<CreateCharacterTemplateVariables, 'illustration'> & {
    illustration: File
}

export type UpdateTemplateFormType = Omit<UpdateCharacterTemplateVariables, 'illustration'> & {
    illustration: File | undefined
}
