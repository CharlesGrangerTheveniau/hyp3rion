import type { Authority } from "~/components/no-permissions-modal.vue"

export const searchAuthorities = async (input: string) => {
    const response = await $fetch<unknown>(
        `/api/authorities?q=${input}`
    ) as Authority[]

    return response.map((result) => ({
        ...result,
        type: result.id.startsWith('f') ? 'firm' : 'client'
    }))
}