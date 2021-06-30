import AWS from 'aws-sdk';
import stream from 'stream';

declare const ReadStream;

type S3UploadConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  destinationBucketName: string;
  region?: string;
};

type S3UploadStream = {
  writeStream: stream.PassThrough;
  promise: Promise<AWS.S3.ManagedUpload.SendData>;
};

export type File = {
  filename: string;
  mimetype: string;
  encoding: string;
  stream?: typeof ReadStream;
};

export type UploadedFileResponse = {
  filename: string;
  mimetype: string;
  encoding: string;
  url: string;
};

export interface IUploader {
  singleFileUploadResolver: (
    parent,
    { file }: { file: Promise<File> },
  ) => Promise<UploadedFileResponse>;
}

export class AWSS3Uploader implements IUploader {
  private s3: AWS.S3;
  public config: S3UploadConfig;

  constructor(config: S3UploadConfig) {
    AWS.config = new AWS.Config();
    AWS.config.update({
      region: config.region || 'ap-northeast-2',
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });

    this.s3 = new AWS.S3();
    this.config = config;
  }

  private createUploadStream(key: string): S3UploadStream {
    const pass = new stream.PassThrough();
    return {
      writeStream: pass,
      promise: this.s3
        .upload({
          Bucket: this.config.destinationBucketName,
          Key: key,
          Body: pass,
          ACL: 'public-read',
        })
        .promise(),
    };
  }

  private createDestinationFilePath(fileName: string, mimetype: string, encoding: string): string {
    return fileName;
  }

  async singleFileUploadResolver(
    parent,
    { file }: { file: Promise<File> },
  ): Promise<UploadedFileResponse> {
    const { stream, filename, mimetype, encoding } = await file;

    // Create the destination file path
    const filePath = this.createDestinationFilePath(filename, mimetype, encoding);

    // Create an upload stream that goes to S3
    const uploadStream = this.createUploadStream(filePath);

    // Pipe the file data into the upload stream
    stream.pipe(uploadStream.writeStream);

    // Start the stream
    const result = await uploadStream.promise;

    // Get the link representing the uploaded file
    // (optional) save it to our database
    const link = result.Location;

    return { filename, mimetype, encoding, url: link };
  }
}
