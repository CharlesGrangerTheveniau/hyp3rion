import { defineStore } from 'pinia'
import { PermissionType, type Permissions, type User } from '~~/server/types'
import type { User as SupabaseUser } from '@supabase/supabase-js';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        permissions: null as Permissions | null
    }),
    actions: {
        async fetchUser(userSession: SupabaseUser) {
            this.user = await $fetch<User>('/api/whoAmI', {
                headers: {
                    'X-User-Data': JSON.stringify(userSession)
                },
                method: 'GET'
            })

            return this.user
        },
        async fetchPermissions() {
            if(!this.user) return
            this.permissions = await $fetch<Permissions>('/api/permissions/'+this.user.id)

            return this.permissions
        },
        async fetchUserAndPermissions(userSession: SupabaseUser) {
            const user = await this.fetchUser(userSession)
            const permissions = await this.fetchPermissions()

            return { user, permissions }
        },
        setUser(user: User) {
            this.user = user
        },
        setPermissions(permissions: Permissions) {
            this.permissions = permissions
        },
        hasUrlPermission(url: string): boolean {
            if (!this.permissions) return false;

            // Extract the path segments
            const segments = url.split('/').filter(Boolean);

            if(segments[0] === 'firm') {
                return this.permissions.firmPermissions.some(permission => permission.id === segments[1] 
                    && (permission.permissionForUser === PermissionType.READ_ONLY
                    || permission.permissionForUser === PermissionType.ADMIN)
                )
            }

            if(segments[0] === 'client') {
                return this.permissions.clientPermissions.some(permission => permission.id === segments[1] 
                    && (permission.permissionForUser === PermissionType.READ_ONLY
                    || permission.permissionForUser === PermissionType.ADMIN)
                )
            }

            return false
        }
    }
})