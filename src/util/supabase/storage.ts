import supabase from '.'

const BUCKET = 'bucket'

export async function upload(file: File, filepath: string, contentType: string) {
    await supabase.storage.from(BUCKET).upload(filepath, file, { contentType })
}

export function get(file: string) {
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(file)

    return data.publicUrl
}

export function getAll(path: string) {

}

export async function deleteFile(file: string) {
    await supabase.storage.from(BUCKET).remove([file])
}

export async function deleteDirectory(path: string) {
    const { data, error } = await supabase.storage.from(BUCKET).list(path)

    if (error)
        throw new Error(`Error while listing files: ${error.message}`)
    if (!data)
        throw new Error('No data from file listing')

    // await supabase.storage.from(BUCKET).

    const fileList = data.map(d => d.name)
}
