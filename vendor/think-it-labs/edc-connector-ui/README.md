<div align="center">
  <h1>EDC Connector UI 💅</h1>
  <p>
    <b>
      A set of headless UI components for <a href="https://github.com/eclipse-edc/Connector">EDC-enabled</a> React dashboards.
    </b>
  </p>
  <sub>
    Built with ❤️ at <a href="https://think-it.io">Think-it</a>.
  </sub>
</div>

## Abstract

The [**EDC Connector**](https://github.com/eclipse-edc/Connector) is a framework for a sovereign, inter-organizational
data exchange. It provides _low-level_ primitives to allow network participants to expose and consume offers.
The _Connector_ does so by providing an extensive HTTP API documented via
[OpenAPI specification](https://github.com/eclipse-edc/Connector/blob/a6fdb2a0b4360629ec562e11ae19d077162200b7/resources/openapi/openapi.yaml).

This project is built on the foundations of
[`@think-it-labs/edc-connector-client`](https://github.com/think-it-labs/edc-connector-client),
targeting UI web engineers by offering a suite of headless UI components for React. These components are designed
to be easily combined, facilitating the creation of visually appealing EDC-enabled dashboards.

## Compatibility matrix

| UI    | EDC   |
| ----- | ----- |
| 0.1.0 | 0.6.x |

## Usage

Install via `npm` or `yarn`

```sh
npm install @think-it-labs/edc-connector-ui
```

```sh
yarn add @think-it-labs/edc-connector-ui
```

Once installed, you import components and start building your dashboard.

```tsx
import { AssetsList } from "@think-it-labs/edc-connector-ui/assets-list";

export function AssetsTable({ onClick }) {
  return (
    <AssetsList managementUrl="https://edc.think-it.io/management">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Content type</th>
            <th>Data address</th>
          </tr>
        </thead>

        <tbody>
          <AssetsList.Items>
            {({ item, index }) => (
              <AssetsList.Asset item={item}>
                <tr>
                  <td>
                    <button type="button" onClick={onClick}>
                      {index + 1}
                    </button>
                  </td>

                  <td>
                    <AssetsList.Asset.Name />
                  </td>

                  <td>
                    <AssetsList.Asset.ContentType />
                  </td>

                  <td>
                    <p>
                      <AssetsList.Asset.DataAddress.Name />
                    </p>
                    <p>
                      <AssetsList.Asset.DataAddress.Type />
                    </p>
                    <p>
                      <small>
                        <AssetsList.Asset.DataAddress.BaseUrl />
                      </small>
                    </p>
                  </td>
                </tr>
              </AssetsList.Asset>
            )}
          </AssetsList.Items>
        </tbody>
      </table>
    </AssetsList>
  );
}
```

The above snippet, uses the `AssetList` component to automatically fetch and render assets
present in a given EDC Connector, but it is possible to list and visualise all EDC resources.

The library provides two types of primitives: _resource components_ and _low-level building blocks_.

### Resource components

Resource components are likely the ones you'll use the most and are the following ones:

| Component                  | Description                                                                                      |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `Connector`                | Fetches a target Connector data and status information.                                          |
| `AssetForm`                | Render a form with the purpose of creating new assets.                                           |
| `AssetView`                | Fetches a single asset for a target Connector.                                                   |
| `AssetsList`               | Fetches a list of assets for a target Connector, filtering via `QuerySpec`.                      |
| `ContractAgreementView`    | Fetches a single contract agreement for a target Connector.                                      |
| `ContractAgreementsList`   | Fetches a list of contract agreements for a target Connector, filtering via `QuerySpec`.         |
| `ContractDefinitionForm`   | Render a form with the purpose of creating new contract definition.                              |
| `ContractDefinitionView`   | Fetches a single contract definition for a target Connector.                                     |
| `ContractDefinitionsList`  | Fetches a list of contract definitions for a target Connector, filtering via `QuerySpec`.        |
| `ContractNegotiationView`  | Fetches a single contract negotiation for a target Connector.                                    |
| `ContractNegotiationsList` | Fetches a list of contract negotiations for a target Connector, filtering via `QuerySpec`.       |
| `ContractOffersList`       | Fetches a list of offers for target consumer and provider Connectors, filtering via `QuerySpec`. |
| `PolicyDefinitionForm`     | Render a form with the purpose of creating new contract definition.                              |
| `PolicyDefinitionView`     | Fetches a single policy definition for a target Connector.                                       |
| `PolicyDefinitionsList`    | Fetches a list of policy definitions for a target Connector, filtering via `QuerySpec`.          |
| `TransferProcessView`      | Fetches a single transfer process for a target Connector.                                        |
| `TransferProcessesList`    | Fetches a list of transfer processes for a target Connector, filtering via `QuerySpec`.          |

### Low-level building blocks

Low-level building blocks, instead are the core essence of the above components. Those won't likely
be used in the day to day, unless you are trying extend Connector's functionalities (e.g., building a UI for an extension's).

| Component        | Description                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `JsonLdContextProvider`           | Allow to specify additional JSON-LD contexts to more easily access JSON-LD fields.                                   |
| `Form`           | Provide primitives to build headless forms components.                                   |
| `List`           | Provide primitives to build headless list.                                               |
| `Local`          | Provide primitives to build headless visualisation components, without fetching ability. |
| `View`           | Provide primitives to build headless visualisation components, with fetching ability.    |
| `JsonLdValue`    | Provide primitives to access JSON-LD fields.                                              |
| `Timestamp`      | Provide primitives to visualise i18n-aware timestamps and dates.                         |

## Examples

### Next.js

The `examples/nextjs` folder implements a quick example of implementing these React headless components using the [Next.js](https://nextjs.org/) framework.

To run the example you should:

```sh
cd examples/nextjs

docker compose up -d

yarn

yarn seed

yarn dev
```

## Development

Please, adhere to the [CONTRIBUTING](CONTRIBUTING.md) guidelines when suggesting
changes in this repository.

## License

Copyright 2024 Think.iT GmbH.

Licensed under the [Apache License, Version 2.0](LICENSE). Files in the project
may not be copied, modified, or distributed except according to those terms.
