## Getting Started

### Local Development

1. Copy `.envrc.example` to `.envrc` and fill in the required environment variables for your EDC connector.

2. Run the development server:
   ```bash
   yarn dev
   ```


### Run E2E tests 

To run the tests in the app use the following command

```bash

yarn playwright test [test-file-path]

# eg

yarn playwright test kafka-data-offer.spec.ts
```

