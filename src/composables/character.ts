import type {
    CreateCharacterTemplateVariables,
    UpdateCharacterTemplateVariables,
} from '@sarah-rp-manager/default-connector'
import { createCharacterTemplate, updateCharacterTemplate } from '@sarah-rp-manager/default-connector'

export default function useCharacter() {
    async function createTemplate(template: CreateCharacterTemplateVariables) {
        await createCharacterTemplate(template)
    }

    async function updateTemplate(template: UpdateCharacterTemplateVariables) {
        await updateCharacterTemplate(template)
    }

    return {
        createTemplate,
        updateTemplate,
    }
}
