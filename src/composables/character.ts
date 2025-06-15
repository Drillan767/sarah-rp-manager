import type { UpdateCharacterTemplateVariables } from '@sarah-rp-manager/default-connector'
import type { CreateTemplateFormType, UpdateTemplateFormType } from '@/types/forms'
import {
    createCharacterTemplate,
    deleteCharacterTemplate,
    updateCharacterTemplate,
    updateTemplateIllustration,
} from '@sarah-rp-manager/default-connector'
import { deleteObject, getDownloadURL, listAll, ref as s3Ref, uploadBytes } from 'firebase/storage'
import useUsersStore from '@/stores/users'
import { storeToRefs } from 'pinia'
import useFirebase from './firebase'

export default function useCharacter() {
    const { storage } = useFirebase()
    const { user } = storeToRefs(useUsersStore())

    async function createTemplate(template: CreateTemplateFormType) {
        // Create template
        const { data } = await createCharacterTemplate({
            ...template,
            illustration: '',
        })

        // Upload illustration
        const storageRef = s3Ref(storage, `users/${user.value?.id}/templates/${data.character_template_insert.id}/${template.illustration.name}`)
        const uploadTask = await uploadBytes(storageRef, template.illustration, {
            contentType: template.illustration.type,
        })

        const url = await getDownloadURL(uploadTask.ref)

        // Update template with illustration
        await updateTemplateIllustration({
            id: data.character_template_insert.id,
            illustration: url,
        })
    }

    async function updateTemplate(template: UpdateTemplateFormType) {
        const payload: UpdateCharacterTemplateVariables = {
            id: template.id,
            name: template.name,
            description: template.description,
        }

        if (template.illustration) {
            // Delete old illustration
            const list = await listAll(s3Ref(storage, `users/${user.value?.id}/templates/${template.id}`))
            await Promise.all(list.items.map(async (item) => {
                await deleteObject(item)
            }))

            const storageRef = s3Ref(storage, `users/${user.value?.id}/templates/${template.id}/${template.illustration.name}`)
            const uploadTask = await uploadBytes(storageRef, template.illustration, {
                contentType: template.illustration.type,
            })
            payload.illustration = await getDownloadURL(uploadTask.ref)
        }

        await updateCharacterTemplate(payload)
    }

    async function deleteTemplate(templateId: string) {
        // Delete illustration
        const list = await listAll(s3Ref(storage, `users/${user.value?.id}/templates/${templateId}`))
        await Promise.all(list.items.map(async (item) => {
            await deleteObject(item)
        }))

        await deleteCharacterTemplate({ id: templateId })
    }

    // TODO: handle character creation from here.

    return {
        createTemplate,
        updateTemplate,
        deleteTemplate
    }
}
