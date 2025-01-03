export type GlobeData = {
    lat: number,
    lng: number,
    size: number,
    color: string,
    title: string,
    maxR: number,
    propagationSpeed: number,
    repeatPeriod: number
}

export type GlobeDataArrayResponse = {
    data: Array<GlobeData>
}