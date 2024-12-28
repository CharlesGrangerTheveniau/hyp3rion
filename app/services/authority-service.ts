import type { Authority } from "~~/server/types"

export const searchAuthorities = async (input: string) => {
    const response = await $fetch<unknown>(
        `/api/authorities?q=${input}`
    ) as Authority[]

    return response.map((result) => ({
        ...result,
        type: result.id.startsWith('f') ? 'firm' : 'client'
    }))
}