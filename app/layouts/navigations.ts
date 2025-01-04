export const firmRoutes: SidebarRoute[] = [
    { n: 1, to: 'dashboard', icon: 'solar:home-2-outline', kbds: ['meta', 'H'] },
    { n: 2, to: 'clients', icon: 'solar:buildings-2-linear', kbds: ['meta', 'C'] },
    { n: 3, to: 'operations', icon: 'solar:database-outline', kbds: ['meta', 'O'] },
    { n: 4, to: 'content', icon: 'solar:book-minimalistic-outline', kbds: ['meta', 'B'] },
    { n: 5, to: 'preferences', icon: 'solar:settings-minimalistic-linear', kbds: ['meta', 'P'] },
]

export interface SidebarRoute {
    n: number
    to: string
    icon: string
    kbds: string[]
}