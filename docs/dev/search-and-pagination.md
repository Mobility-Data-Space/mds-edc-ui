# Search and Pagination 

## Overview

In this document, the application refers to the user-facing MDS Next.js application, and vendor refers to the EDC headless UI library that lives in the `/vendor` directory.

## Final Decision

We decided to move forward with lifting the search state to the application level, this approach is the most compatible with the existing vendor APIs while allowing us to solve this issue in a cleaner way. Implemented in [#208](https://github.com/Mobility-Data-Space/mds-edc-ui/pull/208).

## Requirements

- Ability to paginate through entities
- Ability to search for entities and reset the page to 0
- Ability to paginate through search results
- Pagination should not clear the search box

## Current Scenario

Currently the pagination state is saved in the URL and the search state is saved on the client.
On Next.js (page router) when navigating through pages, the React state resets, which causes the search query to be reset to `""` when moving to the next page. At the same time, if we search while at a page other than the first one, we get empty results as the pagination offset is also sent to the connector. Not updating the pagination value would cause a drift in the state, and updating the pagination state would cause a reload that resets the search query.

It's important to note that the vendor cannot (and should not) access or use the Next.js router as the library is designed for all React apps (SPAs and MPAs), not just Next.js.

## Implementation Proposals

### Lift up the search query state

We'll move the search query tracking up to the application and store it in the query params. This helps with sharing the search results with others as well.

```tsx
// pages/assets/page.tsx
const { query, push } = useRouter();

const handleSearch = useCallback((searchQuery: string) => {
  router.push({
    pathname: router.pathname,
    query: {
      ...router.query,
      search: searchQuery,
    },
  });
}, [router]);

return (
  <>
    <SearchBar 
      searchTarget="https://w3id.org/edc/v0.0.1/ns/id" 
      searchOperator="ilike" 
      value={query.search || ""}
      onChange={handleSearch}
    />
  </>
);
```

This approach can be implemented in a way to keep the old behavior on the vendor as well.

### Integrate the pagination state into the vendor

Since the vendor is designed for React apps and not Next.js specifically, we can't use query params in the vendor, so we'll move the pagination to the React state on the vendor side, making sharing specific pages by link not possible.

```tsx
// vendor/list/use-list.tsx
const [page, setPage] = useState(0); // the pagination state lives here now

const setQuerySpec = useCallback((querySpec: QuerySpec) => {
  dispatch({ type: "SET_QUERY_SPEC_BASE", payload: { querySpec, pagination: 0 } }); // reset pagination to 0 on new search
  setPage(0);
}, []);
```

All the pagination state code from the application would be removed. This change to the vendor would make it harder for users that still want to track their own pagination state to use the library.

### Track pagination state in the component

Instead of using the query param, we would use React state on the application side to track the pagination state.

```tsx
// pages/assets/page.tsx
const [page, setPage] = useState(0);

const handlePagination = useCallback((newPage: number) => {
  setPage(newPage);
}, []);

const handleSearch = useCallback((searchQuery: string) => {
  setPage(0); // reset to first page on new search
  // handle search logic here
}, []);
```

### Save the query in local storage

Saving the query in the local storage would sidestep the navigation refresh issue. We need to make sure to set the search query before navigating and then reset it after rendering.

```tsx
// pages/assets/page.tsx
const { query, push } = useRouter();
const [page, setPage] = useState(0);
const [search, setSearch] = useState("");

useEffect(() => {
  const searchQuery = localStorage.getItem("searchQuery");
  if (searchQuery) {
    setSearch(searchQuery);
    localStorage.removeItem("searchQuery");
  }
}, []);

const handlePagination = useCallback((newPage: number) => {
  localStorage.setItem("searchQuery", search);
  router.push({
    pathname: router.pathname,
    query: {
      ...router.query,
      page: newPage,
    },
  });
}, [router, search]);

return (
  <>
    <SearchBar 
      searchTarget="https://w3id.org/edc/v0.0.1/ns/id" 
      searchOperator="ilike" 
      value={search}
      onChange={setSearch}
    />
  </>
);
```

Now we can safely navigate or reset the page to 0 on new search.

## Comparison

| Approach | Application Refactoring | Vendor Refactoring | Shareability | Performance | Notes |
|----------|------------------------|-------------------|--------------|-------------|-------|
| **Lift search to URL** | Medium | Midium | High - Full URL state | Good | Best for user experience, requires URL state management |
| **Vendor pagination** | Low - Remove pagination code | High - Major state restructure | Low - No page sharing | Good | Breaking change for vendor consumers |
| **Component state** | Medium - State management | None | None - All client state | Best | Simple but loses URL benefits |
| **Local storage** | Medium - Storage + router sync | Low | Medium - Page only | Medium - Storage overhead | Hacky solution, potential race conditions |

## Conclusion

**Recommended approach: Lift search to URL**. This provides the best user experience with shareable URLs while requiring minimal vendor changes. The medium refactoring effort on the application side is justified by improved functionality and maintainability.
