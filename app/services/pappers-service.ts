/* eslint-disable @typescript-eslint/no-explicit-any */
// https://api.pappers.fr/v2/
// 883844276

export const searchCompany = async (input: string) => {
    const response = await $fetch<PappersMetadata>(
        `https://api.pappers.fr/v3/suggestions-frontend?q=${input}&longueur=5&cibles=nom_entreprise,siren`
    )

    console.log(response)
    const companies = response.entreprises?.map(company => buildCompanySuggestion(company)) || []

    return companies
}

/* export const getCompany = async (siren: string) => {
    const response = await $fetch<PappersMetadata>(
        `https://api.pappers.fr/v3/entreprises/${siren}?api_key=${process.env.PAPPER_API_KEY}`
    )

    return buildCompany(response)
} */

export interface PappersMetadata {
    entreprises?: any[]
    resultats_siren?: any[]
}

export interface PappersCompany {
    name: string
    siren: string
    type: string
    partialAddress: {
        zip: string
        city: string
        country: string
    }
}

const buildCompanySuggestion = (company: any): PappersCompany => {
    return {
        name: company.nom_entreprise,
        siren: company.siren_formate,
        type: company.forme_juridique,
        partialAddress: {
            zip: company.siege.code_postal,
            city: company.siege.ville,
            country: company.siege.pays
        }
    }
}