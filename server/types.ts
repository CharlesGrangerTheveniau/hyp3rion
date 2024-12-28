import type { EntityType, PermissionType } from "@prisma/client"

export interface Firm {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    status: 'CERTIFIED' | 'UNCERTIFIED',
    //clients: Client[]
    /* permissions: Permission[] | null
    operations: Operation[] */
    person?: PersonMetadata
    company?: CompanyMetadata
}

export interface FirmMetadata {
    id: string
    entityId: string | null
    name: string
    createdAt: Date
    updatedAt: Date
    status: 'CERTIFIED' | 'UNCERTIFIED'
}

export interface PersonMetadata {
    id: string
    entityId: string
    firstName: string
    lastName: string
    email?: string | null
    phone?: string | null
    birthDate?: Date | null
    birthPlace?: string | null
    nationality?: string | null
    gender?: string | null
    createdAt: Date
    updatedAt: Date
}

export interface CompanyMetadata {
    id: string
    entityId: string
    name: string
    siren?: string
    type?: string
    address?: string
    capital?: number
    createdAt: Date
    updatedAt: Date
}

export interface Client {
    id: string
    name: string
    createdAt: Date
    updatedAt: Date
    firmId: string
    person?: PersonMetadata
    company?: CompanyMetadata
}

export interface ClientMetadata {
    id: string
    entityId: string
    createdAt: Date
    updatedAt: Date
    firmId: string
    name: string
}

export interface EntityMetadata {
    id: string
    createdAt: Date
    updatedAt: Date
    type: EntityType
    clientId: string | null
    firmId: string | null
    role: string | null
}

export interface Permissions {
    firmPermissions: Firm[]
    clientPermissions: Client[]
    user: User
}

export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    phone: string
    avatarUrl: string
    connected: boolean
    permissions: Permission[]
}

export interface Permission {
    userId: string
    firmId: string
    clientId: string
    permission: PermissionType
}