declare module '/pagefind/pagefind.js' {
  export interface PagefindSearchItem {
    data(): Promise<{
      url: string
      meta: { title: string }
      excerpt: string
    }>
  }

  export interface PagefindSearchResponse {
    results: PagefindSearchItem[]
  }

  export function search(query: string): Promise<PagefindSearchResponse>
}
