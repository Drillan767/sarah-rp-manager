import type { CreateRoleplayVariables, CreateRoleVariables, CreateChannelVariables } from '@sarah-rp-manager/default-connector'
import { ref as s3Ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import useUsersStore from '@/stores/users'
import useFirebase from './firebase'
import { storeToRefs } from 'pinia'
import { createRoleplay, updateRoleplayIllustration, createRole, createChannel } from '@sarah-rp-manager/default-connector'

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
        const storageRef = s3Ref(storage, `roleplays/${data.roleplay_insert.id}`)
        const uploadTask = await uploadBytes(storageRef, roleplay.illustration)
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
    }


    return {
        createRP
    }
}