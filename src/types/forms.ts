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

export interface ParticipationRole {
    id: string
    name: string
    maxUsers: number
    description: string
}

export interface ParticipationCharacter {
    // May not have an existing template
    templateId?: string
    // May have a template, so no need to provide the rest
    name?: string
    illustration?: string
    description?: string
}

/*
    user: User!
    roleplay: Roleplay!
    role: Role!
    characterTemplate: CharacterTemplate!
    characterName: String
    characterIllustration: String
    characterDescription: String
    joinedAt: Date! @default(expr: "request.time")
    status: String! @default(expr: "'active'")
*/
