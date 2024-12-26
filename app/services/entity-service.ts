export const getCompany = async (entityId: string) => {
    const company = await $fetch('/api/entities/companies', {
        headers: {
            'X-Entity-Id': JSON.stringify(entityId)
        },
        method: 'GET'
    })

    return company
}

export const getPerson = async (entityId: string) => {
    const person = await $fetch('/api/entities/persons', {
        headers: {
            'X-Entity-Id': JSON.stringify(entityId)
        },
        method: 'GET'
    })

    return person
}