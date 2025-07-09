import { BaseDataAddress, HttpDataAddress } from "@think-it-labs/edc-connector-client";

export type DataAddressErrors<T> = {
  [K in keyof Partial<T>]: boolean | string;
};

export enum DataAddressTypes {
  MDSOnRequestOffer = "MDSOnRequestOffer",
  AmazonS3 = "AmazonS3",
  AzureBlob = "AzureBlob",
  HttpData = "HttpData",
  CustomJson = "CustomJson"
}

export const remoteTypes = [
  DataAddressTypes.AzureBlob,
  DataAddressTypes.AmazonS3
];

export interface OnRequestDataAddress extends BaseDataAddress {
  type: DataAddressTypes.MDSOnRequestOffer,
  email?: string,
  preferred_email_subject?: string
}

export interface S3DataAddress extends BaseDataAddress {
  type: DataAddressTypes.AmazonS3,
  bucketName: string,
  region: string,
  keyname: string,
  objectName?: string,
  objectPrefix?: string
}

export interface AzureBlobDataAddress extends BaseDataAddress {
  type: DataAddressTypes.AzureBlob,
  bucketName: string,
  region: string,
  keyname: string,
  objectName?: string,
  objectPrefix?: string
}

export const defaultHttpSourceDataAddress: HttpDataAddress = {
  type: DataAddressTypes.HttpData,
  method: "GET",
};

export const defaultHttpDestinationDataAddress: HttpDataAddress = {
  type: DataAddressTypes.HttpData,
  method: "POST",
  isPull: false,
};

export const defaultOnRequestDataAddress: OnRequestDataAddress = {
  type: DataAddressTypes.MDSOnRequestOffer
};
