// https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html

declare global {
  interface RegionItem {
    code: number
    name: string
  }

  interface Regions {
    province: Province[]
    city: City[]
    county: County[]
  }

  interface Province extends RegionItem { }

  interface City extends Province {
    p_code: Province.code
    p_name: Province.name
  }

  interface County extends City {
    c_code: City.code
    c_name: City.name
  }

  interface MemoryUsage {
    rss: number
    heapTotal: number
    heapUsed: number
  }

  interface APIResponse {
    metadata: unknown
    data: Province[]
    memory?: {
      before: MemoryUsage | undefined
      afterRead: MemoryUsage | undefined
      afterFilter: MemoryUsage | undefined
    }
  }
}

export { }
