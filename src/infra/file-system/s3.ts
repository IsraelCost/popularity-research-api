import { Injectable } from '@nestjs/common'
import * as aws from 'aws-sdk'
import { IFileSystem } from '../../application/contracts/file-system'
import { ApplicationError } from '../../domain/entities/error'

@Injectable()
export class S3 implements IFileSystem {
  private readonly s3: aws.S3

  private readonly REPLACE_PATTERN = /^data:image\/\w.+;base64,/

  constructor () {
    this.s3 = new aws.S3({
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      region: process.env.S3_REGION
    })
  }

  async save (folder: string, fileName: string, base64: string): Promise<string> {
    if (!this.isBase64(base64)) return base64
    const data = Buffer.from(base64.replace(this.REPLACE_PATTERN, ''), 'base64')
    const imageType = base64.split(';')[0].split('/')[1]
    try {
      const { Location } = await this.s3.upload({
        Bucket: process.env.S3_BUCKET!,
        Key: `${folder}/${fileName}`,
        Body: data,
        ContentEncoding: 'base64',
        ContentType: `image/${imageType}`
      }).promise()
      return Location
    } catch (error) {
      throw new ApplicationError(`Falha ao salvar imagem: ${error}`, 500)
    }
  }

  private isBase64 (data: string): boolean {
    const rule = /^data:([-\w]+\/[-+\w.]+)?((?:;?[\w]+=[-\w]+)*)(;base64)?,(.*)/
    return rule.test(data)
  }
}
