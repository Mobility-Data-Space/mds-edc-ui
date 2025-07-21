# Search Across Multiple Columns for Entities

## Overview 

This document outlines a proposal for implementing a mechanism for searching for entities with multiple criteria. In this document, the application refers to the user-facing MDS Next.js application, and vendor refers to the EDC headless UI library that lives in the `/vendor` directory.

## Requirements

- Ability to search an entity by multiple columns (id, title, description, etc.)
- No duplicate entities should be displayed

## Current Scenario

Currently, the connector API does not support chaining filter criteria in OR fashion, [only AND](https://eclipse-edc.github.io/documentation/for-contributors/control-plane/entities/#9-querying-with-queryspec-and-criterion). What we need is the inverse of the In operator, i.e.:

```json
{
  "@context": {
    "edc": "https://w3id.org/edc/v0.0.1/ns/"
  },
  "@type": "QuerySpec",
  "sortField": "createdAt",
  "sortOrder": "DESC",
  "filterExpression": [
    {
      "operandLeft": [
        "https://w3id.org/edc/v0.0.1/ns/id",
        "http://purl.org/dc/terms/description"
      ],
      "operator": "=",
      "operandRight": "Rerum exercitation dasdasd"
    }
  ]
}
```

This also does not work as the connector will always [pick the first element of the operandLeft array](https://github.com/eclipse-edc/Connector/blob/e82baec0896b5b55b12c42c28beafaee570cbda3/spi/common/json-ld-spi/src/main/java/org/eclipse/edc/jsonld/spi/transformer/AbstractJsonLdTransformer.java#L271), giving us in this case matches only for the id and not the description.

On the application side, the search state lives on the vendor side, so sending multiple requests from the MDS UI is not feasible without lifting up the state. P.S. the pagination state lives on the application side.

Another important note is that this is possibly not viable for other users of the headless-ui vendor, so drastic changes can make it hard to migrate them back to upstream and locks us to shipping with the vendor folder permanently.

## Implementation Proposals

### Move all of the query functionality to the application side

We'll move all the querying functionality to the application side by removing the List components from the app and using the EDC client directly. This would require a substantial change to every list page and querying the data ourselves in multiple requests and merging them together.

Example:

```jsx
// pages/assets/page.tsx

const searchQuery = ""; // this state has to be tracked on the application side
const filteredById = await client.management.assets.queryAll(context, {
  filterExpression: [
    {
      "operandLeft": "https://w3id.org/edc/v0.0.1/ns/id",
      "operator": "ilike",
      "operandRight": `%${searchQuery}%`
    }
  ],
  limit: 25,
  offset: 0,
  sortField: "createdAt",
  sortOrder: "DESC"
});

const filteredByDescription = await client.management.assets.queryAll(context, {
  filterExpression: [
    {
      "operandLeft": "http://purl.org/dc/terms/description",
      "operator": "ilike",
      "operandRight": `%${searchQuery}%`
    }
  ],
  limit: 25,
  offset: 0,
  sortField: "createdAt",
  sortOrder: "DESC"
});

const result = merge(filteredById, filteredByDescription); // a utility function to remove duplicates and keep the order consistent

// ... //

return (
  <>
    {result.map(asset => <AssetCard {...asset} />)}
  </>
);
```

This would be a substantial refactor migrating every page to this new approach. Also, we would lose out on existing features of the vendor list component.

### Allow the application to supply initial array of entities

We'll send extra queries for the 2nd+ criteria and supply them to the vendor where it takes care of merging the data.

```jsx
// pages/assets/page.tsx

const searchQuery = ""; // this state has to be tracked on the application side
const filteredById = await client.management.assets.queryAll(context, {
  filterExpression: [
    {
      "operandLeft": "https://w3id.org/edc/v0.0.1/ns/id",
      "operator": "ilike",
      "operandRight": `%${searchQuery}%`
    }
  ],
  limit: 25,
  offset: 0,
  sortField: "createdAt",
  sortOrder: "DESC"
});

// ... //

return (
  <>
    <AssetsList.Items
      initialArray={filteredById}
      limit={25}
      offset={0}
      sortField="createdAt"
      sortOrder="DESC"
    >
      {({ item, index }) => (
        <AssetCard asset={item} key={index} />
      )}
    </AssetsList.Items>
  </>
);
```

```jsx
// vendor/list/use-list.tsx
useEffect(() => {
  if (!shouldFetch) return;
  // Only fetch if there is a filter or some required field in querySpecBase
  const hasBase = state.querySpecBase && Object.keys(state.querySpecBase).length > 0;
  const hasSearch = state.committedSearchSpec && state.committedSearchSpec.operandRight;
  if (!hasBase && !hasSearch) return;
  dispatch({ type: "SEARCH_START" });
  queryAll(buildQuerySpec())
    .then((response) => {
      return merge(response, initialArray); // a utility function to remove duplicates and keep the order consistent
    })
    .then((completeList) => {
      dispatch({ type: "SEARCH_SUCCESS", payload: completeList });
    })
    .catch((err) => {
      dispatch({ type: "SEARCH_ERROR", payload: err as Error });
    });
}, [queryAll, state.querySpecBase, state.committedSearchSpec, shouldFetch, initialArray]);
```

### Query all the data at initial render and search application side

We'll request all entities the connector holds and handle the pagination and search on the application side.

```jsx
// pages/assets/page.tsx

const searchQuery = ""; // this state has to be tracked on the application side
const currentPage = 0;
const MAX_ITEMS = 5;

const assets = await client.management.assets.queryAll(context, {
  limit: 50000, // a very high limit
  sortField: "createdAt",
  sortOrder: "DESC"
});

// ... //

return (
  <>
    {assets
      .filter(asset => hasMatchingId(asset, searchQuery) || hasMatchingDescription(asset, searchQuery))
      .slice(currentPage * MAX_ITEMS, MAX_ITEMS)
      .map(asset => <AssetCard {...asset} />)
    }
  </>
);
```

This solution would solve other issues as well (we now know how many total entities we have and pagination does not affect filtering results), but it is the most computationally expensive approach. Also, this could cause longer data loading time (as the data loads on the application) and also slower initial paint time (as the server will try to request the data as well, but this could be circumvented as it is unnecessary).

Also, this solution would require a pretty substantial refactor to either the application or the vendor side. Although we can set a very high limit, there's no guarantee that it would be enough as the number of entities scales with time.

### Add the ability to send multiple requests to the vendor

We'll send multiple requests from the vendor side to fetch all the requests and present our own OR operator API.

```jsx
// pages/assets/page.tsx

return (
  <>
    <SearchBar 
      searchTarget={["https://w3id.org/edc/v0.0.1/ns/id", "http://purl.org/dc/terms/description"]} 
      searchOperator="ilike" 
    /> {/* no uplifting the search state here */}

    {/* ... */}

    <AssetsList.Items
      limit={25}
      offset={0}
      sortField="createdAt"
      sortOrder="DESC"
    >
      {({ item, index }) => (
        <AssetCard asset={item} key={index} />
      )}
    </AssetsList.Items>
  </>
);
```

```jsx
// vendor/list/use-list.tsx

const buildQuerySpec = useCallback(() => {
  const { querySpecBase, committedSearchSpec } = state;
  let filterExpression = [];
  
  if (Array.isArray(querySpecBase.filterExpression)) {
    if (Array.isArray(querySpecBase.filterExpression.operandLeft)) {
      return querySpecBase.filterExpression.operandLeft.map((operand) => ({
        ...state.querySpecBase,
        filterExpression: { 
          ...querySpecBase.filterExpression, 
          operandLeft: operand 
        }
      }));
    } else {
      return {
        ...state.querySpecBase,
        filterExpression: [...querySpecBase.filterExpression],
      };
    }
  }

  const querySpec = [{
    ...state.querySpecBase,
    filterExpression: undefined,
  }];

  return querySpec;
}, [state.querySpecBase, state.committedSearchSpec]);

// ... //

useEffect(() => {
  if (!shouldFetch) return;
  // Only fetch if there is a filter or some required field in querySpecBase
  const hasBase = state.querySpecBase && Object.keys(state.querySpecBase).length > 0;
  const hasSearch = state.committedSearchSpec && state.committedSearchSpec.operandRight;
  if (!hasBase && !hasSearch) return;
  dispatch({ type: "SEARCH_START" });
  Promise.all(buildQuerySpec().map(querySpec => queryAll(querySpec)))
    .then((response) => {
      return merge(response); // a utility function to remove duplicates and keep the order consistent
    })
    .then((completeList) => {
      dispatch({ type: "SEARCH_SUCCESS", payload: completeList });
    })
    .catch((err) => {
      dispatch({ type: "SEARCH_ERROR", payload: err as Error });
    });
}, [queryAll, state.querySpecBase, state.committedSearchSpec, shouldFetch, initialArray]);
```

The code above glosses over some critical details (combining AND and OR operators, for example), and this part of the codebase can be very sensitive to changes as it's handling pagination, searching, querying, and more.

This change would be viable to merge into upstream in my opinion as it could be a useful feature but isn't too intrusive.

## Comparison

| Approach | Application Refactor | Vendor Refactor | Performance | Upstream Compatibility | Notes |
|----------|---------------------|-----------------|-------------|----------------------|-------|
| Application-side querying | High | None | Good | High | Lose vendor features, every page needs changes |
| Initial array supply | Medium | Low | Good | Medium | Requires state lifting, coordination complexity |
| Query all data | High | None | Poor | High | Scalability issues, memory intensive |
| Multiple vendor requests | Low | High | Good | High | Clean API, maintains existing features |

## Conclusion

Recommend approach 4 (multiple vendor requests) as it provides OR functionality with minimal application changes and remains upstream-compatible. Approach 1 is viable if we're willing to rebuild list functionality from scratch.
