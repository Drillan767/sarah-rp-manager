import type {
    CreateChannelVariables,
    CreateRoleplayVariables,
    CreateRoleVariables,
    UpdateRoleplayVariables,
} from '@sarah-rp-manager/default-connector'
import {
    createChannel,
    createRole,
    createRoleplay,
    getRoleplay as getRoleplayQuery,
    updateMessageBoard as updateMessageBoardQuery,
    updateRoleplayIllustration,
    updateRoleplay as updateRoleplayQuery,
} from '@sarah-rp-manager/default-connector'
import { deleteObject, getDownloadURL, ref as s3Ref, uploadBytes } from 'firebase/storage'
import { storeToRefs } from 'pinia'
import useUsersStore from '@/stores/users'
import useFirebase from './firebase'

type RoleplayFormType = Omit<CreateRoleplayVariables, 'illustration'> & {
    illustration: File
}

export default function useRoleplays() {
    const usersStore = useUsersStore()
    const { user } = storeToRefs(usersStore)
    const { storage } = useFirebase()

    const createRP = async (
        roleplay: RoleplayFormType,
        roles: CreateRoleVariables[],
    ) => {
        if (!user.value) {
            throw new Error('User not found')
        }

        // Create roleplay
        const { data } = await createRoleplay({
            ...roleplay,
            illustration: '',
            user: user.value?.id,
        })

        // Upload illustration
        const storageRef = s3Ref(storage, `roleplays/${data.roleplay_insert.id}/${roleplay.illustration.name}`)
        const uploadTask = await uploadBytes(storageRef, roleplay.illustration, {
            contentType: roleplay.illustration.type,
        })
        const downloadURL = await getDownloadURL(uploadTask.ref)

        // Update roleplay with illustration
        await updateRoleplayIllustration({
            id: data.roleplay_insert.id,
            illustration: downloadURL,
        })

        // Create roles
        await Promise.all(roles.map(async (role) => {
            return await createRole({
                ...role,
                roleplay: data.roleplay_insert.id,
            })
        }))

        // Create default channels
        const channels: CreateChannelVariables[] = [
            {
                name: 'Canal principal',
                roleplay: data.roleplay_insert.id,
                isInternal: true,
                isDefault: true,
            },
            {
                name: 'Canal secondaire',
                roleplay: data.roleplay_insert.id,
                isInternal: true,
                isDefault: true,
            },
        ]

        await Promise.all(channels.map(async (channel) => {
            return await createChannel(channel)
        }))

        return data.roleplay_insert.id
    }

    const getRP = async (rpId: string) => {
        const { data } = await getRoleplayQuery({ id: rpId })
        return data.roleplay
    }

    const updateMessageBoard = async (rpId: string, messageBoard: string) => {
        await updateMessageBoardQuery({
            id: rpId,
            messageBoard,
        })
    }

    const updateRP = async (rp: UpdateRoleplayVariables, illustration?: File) => {
        if (illustration) {
            // Delete old illustration
            const oldIllustration = rp.illustration.split(`${import.meta.env.VITE_S3_BUCKET_URL}/o`)[1]
            if (oldIllustration) {
                const storageRef = s3Ref(storage, oldIllustration)
                await deleteObject(storageRef)
            }

            const storageRef = s3Ref(storage, `roleplays/${rp.id}/${illustration.name}`)
            const uploadTask = await uploadBytes(storageRef, illustration, {
                contentType: illustration.type,
            })
            const downloadURL = await getDownloadURL(uploadTask.ref)

            // Update roleplay with new illustration
            await updateRoleplayQuery({
                id: rp.id,
                title: rp.title,
                description: rp.description,
                startDate: rp.startDate,
                illustration: downloadURL,
            })
        }
    }

    return {
        createRP,
        getRP,
        updateMessageBoard,
        updateRP,
    }
}
