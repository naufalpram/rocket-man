export type APODResponse = {
    date: string,
    explanation: string,
    hdurl: string,
    media_type: string,
    service_version: string,
    title: string,
    url: string
} | {
    error: {
        code: string,
        message: string
    }
}

export type EONETCategory = {
    id: number,
    title: string
}

export type EONETSource = {
    id: string,
    url: string
}

export type EONETGeometry = {
    date: string,
    type: string,
    coordinates: Array<number>
}

export type EONETEvent = {
    id: string,
    title: string,
    description: string,
    link: string,
    closed: string,
    categories: Array<EONETCategory>,
    sources: Array<EONETSource>,
    geometries: Array<EONETGeometry>
}

export type EONETResponse = {
    title: "EONET Events",
    description: "Natural events from EONET.",
    link: "https://eonet.gsfc.nasa.gov/api/v2.1/events",
    events: Array<EONETEvent> | []
}
