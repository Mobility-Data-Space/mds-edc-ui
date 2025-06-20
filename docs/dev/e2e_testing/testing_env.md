# Test Environment and Setup

## Playwright Global Setup
Run the E2E Docker Compose with the following services:
- EDC-1 (In memory connector)
- EDC-2 (In memory connector)
- Seed Data Space service to bootstrap the connectors with test data.


## Test Data

12 test assets that can be found here: https://github.com/Mobility-Data-Space/mds-catalog/tree/main/resources/test-data 
1 offer with always true

EDC-1: assets 1 to 7 (used for tests with UI)
EDC-2: assets 8 to 12