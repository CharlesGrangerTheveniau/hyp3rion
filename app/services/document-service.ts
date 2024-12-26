export async function getDocuments(userId: string) {
    const documentMetadata = await loadDocuments(userId)

    return documentMetadata.map((document: Document) => {
        return {
            id: document.id,
            name: document.name,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            userId: document.userId,
            entityId: document.entityId,
        }
    })


}

export async function loadDocuments(userId: string): Promise<Document[]> {
    const documents = await $fetch<Document[]>('/api/documents/getDocuments', {
        headers: {
            'X-User-Data': JSON.stringify(userId)
        }
    })

    return documents
}

export interface Document {
    id: string
    name: string
    createdAt: string
    updatedAt: string
    userId: string
    entityId: string
    documentType: string
    documentStatus: string
    documentUrl: string
    documentMetadata: string
}