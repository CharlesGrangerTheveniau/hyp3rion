<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<template>
    <ItemCard>
        <template #header>
            <h3 class="text-3xl font-bold">Your team</h3>
        </template>

        <UTable 
            :data="permissions || []" 
            :loading="loading" 
            loading-color="primary" loading-animation="carousel" 
            :columns="columns" 
            class="flex-1 w-full"
        >
            <template #avatar-cell="{ row }">
                <UAvatar v-if="row.original.user?.avatar" :src="`${row.original.user?.avatar}`" size="lg" />
            </template>
            <template #name-cell="{ row }">
                <p class="font-medium text-[var(--ui-text-highlighted)]">
                    {{ row.original.user?.fullName }}
                </p>
            </template>
            <template #email-cell="{ row }">
                <p>{{ row.original.user?.email }}</p>
            </template>
            <template #permission-cell="{ row }">
                <USelectMenu 
                    :model-value="row.original.permission"
                    :items="permissionLevels"
                    class="w-48"
                    :loading="loading"
                    variant="soft"
                    @update:model-value="updatePermission(row.original, $event)"
                >
                    <template #leading="{ modelValue, ui }">
                        <UChip
                            v-if="modelValue"
                            v-bind="modelValue.chip"
                            inset
                            standalone
                            :size="ui.itemLeadingChipSize()"
                            :class="ui.itemLeadingChip()"
                        />
                    </template>
                </USelectMenu>
            </template>
            <template #action-cell="{ row }">
                <UDropdownMenu :items="getDropdownActions(row.original)">
                    <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" />
                </UDropdownMenu>
                </template>
        </UTable>
    </ItemCard>
</template>

<script lang="ts" setup>
    import { PermissionType, type PermissionWithUser } from '~~/server/types';
    import ItemCard from '../cards/item-card.vue';
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui';
    const UAvatar = resolveComponent('UAvatar')
    const toast = useToast()


    const firmId = useRoute().params.id as string

    const permissionLevels = ref([
        {
            label: 'Admin',
            value: PermissionType.ADMIN,
            chip: {
                color: 'primary' as const
                }
            },
        {
            label: 'Read only',
            value: PermissionType.READ_ONLY,
            chip: {
                color: 'secondary' as const
            }
        },
        {
            label: 'Pending',
            value: PermissionType.PENDING,
            chip: {
                color: 'warning' as const
            }
        }
    ])



    const loading = ref(true)

    const permissions = ref(await $fetch<PermissionWithUser[]>('/api/permissions/permissionsForAuthority', {
        method: 'POST',
        body: {
            firmId: firmId
        }
    }).then(res => {
        const mapped = res.map(permission => {
            return {
                ...permission,
                permission: permissionLevels.value.find(level => level.value === permission.permission)
            }
        })
        console.log('Fetched permissions:', mapped)
        return mapped
    }))
    loading.value = false

    const columns: TableColumn<PermissionWithUser>[] = [
        {
            id: 'avatar',
            cell: ({ row }) => {
                return h(UAvatar, {
                    src: row.original.user?.avatar,
                    size: 'lg'
                })
            }
        },
        {
            accessorKey: 'name',
            header: 'Name',
        },
        {
            accessorKey: 'email',
            header: 'Email'
        },
        {
            accessorKey: 'permission',
            header: 'Permission'
        },
        {
            id: 'action'
        }
    ]

    /* function getPermissionLevel(permission: PermissionType) {
        return permissionLevels.find(level => level.value === permission)
    } */

    async function updatePermission(row: PermissionWithUser, newPermission: any) {
        console.log(newPermission)
        loading.value = true
        permissions.value = permissions.value.map(permission => {
            if (permission.userId === row.userId) {
                return {
                    ...permission,
                    permission: newPermission
                }
            }
            return permission
        })

        await $fetch('/api/permissions/updatePermission/', {
            method: 'PATCH',
            body: {
                permissionId: row.id,
                permission: newPermission.value
            }
        }).then(() => {
            toast.add({
                title: `We updated ${row.user?.fullName}'s permission to ${newPermission.value}`,
               color: 'primary',
                icon: 'i-lucide-circle-check'
            })
        })
        loading.value = false
    }

    
    function getDropdownActions(permission: PermissionWithUser): DropdownMenuItem[][] {
        return [
            /* [
            {
                label: 'Delete',
                icon: 'i-lucide-trash',
                onSelect: () => {
                navigator.clipboard.writeText(user.userId.toString())
                toast.add({
                    title: 'User ID copied to clipboard!',
                   color: 'primary',
                    icon: 'i-lucide-circle-check'
                })
                }
            }
            ], */
            [
            {
                label: 'Edit',
                icon: 'i-lucide-edit'
            },
            {
                label: 'Delete',
                icon: 'i-lucide-trash',
                color: 'error',
                onSelect: () => {
                    deletePermission(permission)
                }
            }
            ]
        ]
    }

    async function deletePermission(permission: PermissionWithUser) {
        loading.value = true
        await $fetch('/api/permissions/deletePermission', {
            method: 'DELETE',
            body: {
                permissionId: permission.id
            }
        }).then(() => {
            toast.add({
                title: `We deleted ${permission.user?.fullName}'s permission`,
               color: 'primary',
                icon: 'i-lucide-circle-check'
            })
        })
        permissions.value = permissions.value.filter(p => p.id !== permission.id)
        loading.value = false
    }

</script>

<style>

</style>