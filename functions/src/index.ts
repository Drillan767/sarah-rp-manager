import admin from 'firebase-admin'
import { onRequest } from 'firebase-functions/v2/https'

admin.initializeApp()

exports.onUserJoinedRP = onRequest(async (req, res) => {
    const { roleplayId, roleId, userId, characterId } = req.body

    try {
        await admin.database()
            .ref(`live_assignments/${roleplayId}/${roleId}`)
            .set({
                user_id: userId,
                character_id: characterId,
                joined_at: admin.database.ServerValue.TIMESTAMP,
                is_active: true,
            })

        res.status(200).send('User joined roleplay')
    }
    catch (error) {
        res.status(500).send('Error joining roleplay')
        console.error(error)
    }
})
