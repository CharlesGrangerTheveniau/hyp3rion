export const requestPermission = async (userId: string, authorityId?: string, authorityType?: 'firm' | 'client') => {
    return await $fetch('/api/permissions/request', {
        method: 'POST',
        body: {
            userId,
            authorityId,
            authorityType
        }
    })
}