import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'

// const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

import { CreateSignedURLRequest } from '../requests/CreateSignedURLRequest';
// import * as AWS from 'aws-sdk';
// import * as AWSXRay from 'aws-xray-sdk';

// const XAWS = AWSXRay.captureAWS(AWS);

export default class AttachmentUtils  {
    constructor(
        private readonly todosStorage = process.env.S3_BUCKET,
        private readonly s3 = new AWS.S3({ signatureVersion: 'v4'})
    ) {}

    getBucketName() {
        return this.todosStorage;
    }

    getPresignedUploadURL(createSignedUrlRequest: CreateSignedURLRequest) {
        return this.s3.getSignedUrl('putObject', createSignedUrlRequest);
    }
}