/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Entity } from "~~/server/api/entities/getEntities"
import type { UserProfile } from "~~/server/api/users"

export const getUser = async (userSession: any) => {
    const user: User = await $fetch<User>('/api/users', {
        headers: {
            'X-User-Data': JSON.stringify(userSession)
        },
        method: 'GET'
    })

    user.entities = await $fetch<Entity[]>('/api/entities/getEntities', {
        headers: {
            'X-User-Id': JSON.stringify(user.id)
        }
    })

    user.documents = await $fetch<Document[]>('/api/documents/getDocuments', {
        headers: {
            'X-User-Id': JSON.stringify(user.id)
        }
    })
    

    return user
}
export const getUserInfo = (user: User) => {
    const personEntity = user.entities.find((entity) => entity.type === 'PERSON')?.person as Person

    console.log(personEntity)
    return personEntity
}

export async function updateUser(userData: {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatarUrl: string | null
}) {
  return await $fetch('/api/users', {
    headers: { 'X-User-Id': JSON.stringify(userData.id) },
    method: 'PATCH',
    body: userData
  })
}

export interface User extends UserProfile {
    entities: Entity[]
    documents: Document[]
}

export interface Company extends Entity {
    id: string
    name: string
    sirenNumber: string
    incorporationDate: Date
    incorporationPlace: string
}

export interface Person extends Entity {
    id: string
    firstName: string
    lastName: string
    birthDate: Date
    birthPlace: string
    nationality: string
}

export interface Document {
    id: string
    name: string
}