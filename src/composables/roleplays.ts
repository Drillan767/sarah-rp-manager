import type {
    CreateChannelVariables,
    CreateRoleVariables,
} from '@sarah-rp-manager/default-connector'
import type { CreateRoleplayFormType, UpdateRoleplayFormType } from '@/types/forms'
import {
    createChannel,
    createRole,
    createRoleplay,
    deleteChannelsForSpecificRoleplay as deleteChannels,
    deleteRole,
    deleteRoleplay,
    deleteRolesForSpecificRoleplay as deleteRoles,
    getRoleplay as getRoleplayQuery,
    updateMessageBoard as updateMessageBoardQuery,
    updateRoleplayIllustration,
    updateRoleplay as updateRoleplayQuery,
} from '@sarah-rp-manager/default-connector'
import { deleteObject, getDownloadURL, listAll, ref as s3Ref, uploadBytes } from 'firebase/storage'
import { storeToRefs } from 'pinia'
import useUsersStore from '@/stores/users'
import useFirebase from './firebase'

export default function useRoleplays() {
    const usersStore = useUsersStore()
    const { user } = storeToRefs(usersStore)
    const { storage } = useFirebase()

    const createRP = async (
        roleplay: CreateRoleplayFormType,
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

    const updateMessageBoard = async (rpId: string, messageBoard: string | undefined) => {
        await updateMessageBoardQuery({
            id: rpId,
            messageBoard,
        })
    }

    const updateRP = async (rp: UpdateRoleplayFormType) => {
        if (rp.illustration) {
            // Delete old illustration
            const list = await listAll(s3Ref(storage, `roleplays/${rp.id}`))
            await Promise.all(list.items.map(async (item) => {
                await deleteObject(item)
            }))

            const storageRef = s3Ref(storage, `roleplays/${rp.id}/${rp.illustration.name}`)
            const uploadTask = await uploadBytes(storageRef, rp.illustration, {
                contentType: rp.illustration.type,
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

    const deleteRP = async (rpId: string) => {
        // Delete illustration
        const list = await listAll(s3Ref(storage, `roleplays/${rpId}`))
        await Promise.all(list.items.map(async (item) => {
            await deleteObject(item)
        }))

        // Delete channels
        await deleteChannels({ roleplayId: rpId })

        // Delete roles
        await deleteRoles({ roleplayId: rpId })

        // Delete roleplay
        await deleteRoleplay({ id: rpId })
        // await deleteRoleplayQuery({ id: rpId })
    }

    return {
        createRP,
        getRP,
        updateMessageBoard,
        updateRP,
        deleteRP,
    }
}
