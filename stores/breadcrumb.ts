import { defineStore } from "pinia"

type Breadcrumb = {
    url?: string,
    title: string,
}

export const useBreadcrumbStore = defineStore('breadcrumb', () => {
    const links = ref<Breadcrumb[]>([])

    return { links }
})