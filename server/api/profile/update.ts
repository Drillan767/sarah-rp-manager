export default defineEventHandler(async (event) => {
    const body = await readMultipartFormData(event)

    if (!body) {
        throw createError({
            statusCode: 400,
            statusMessage: 'ID should be an integer',
        })
    }

    for (const field of body) {
        console.log({
            field: field.name,
            data: field.data.toString()
        })
    }

    return { body }

})