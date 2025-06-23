# Assets Page Specifications and User Tests

## Features

### 1. List Assets
- Display all assets available on the connector.
- Include pagination and search functionality for large datasets.

### 2. View Asset Details
- Allow users to select an asset and view detailed information.
- Include metadata such as asset ID, title, description, data category, and data source.

### 3. Delete Asset
- Provide functionality to delete a selected asset.
- Include a confirmation dialog to prevent accidental deletions.

### 4. Create New Asset
- Enable users to create a new asset with MDS-compliant ontology.
- Support multiple data sources:
  - **HTTP**: Optionally configure proxy, headers, and authentication.
  - **S3**: Allow users to specify bucket name, region, and access credentials.
  - **Azure**: Include options for storage account and container configuration.
  - **On Request**: Define assets that are fetched dynamically upon request.

## User Tests

### 1. List Assets
- Verify that all assets are displayed correctly.
- Test pagination and search functionality with varying dataset sizes.

### 2. View Asset Details
- Test that selecting an asset displays the correct details.
- Validate the accuracy of metadata fields.

### 3. Delete Asset
- Test the delete functionality with and without confirmation.
- Ensure deleted assets are no longer listed.

### 4. Create New Asset
- Test asset creation for each data source type:
  - **HTTP**: Validate proxy, headers, and authentication configurations.
  - **S3**: Verify bucket name, region, and access credentials.
  - **Azure**: Test storage account and container setup.
  - **On Request**: Ensure dynamic fetching works as expected.
