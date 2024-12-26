import type { Address } from "~~/server/api/addresses"
import type { User } from "./user-service"

export const getAddress = async (addressId: string) => {
    const address = await $fetch('/api/addresses', {
        headers: {
            'X-Address-Id': JSON.stringify(addressId)
        },
        method: 'GET'
    })

    console.log(addressId, address)
    return address
}

export const getAddressForUser = (user: User): Address | null => {
    const personEntity = user.entities.find((entity) => entity.type === 'PERSON')
    return personEntity ? personEntity.address : null
    
}