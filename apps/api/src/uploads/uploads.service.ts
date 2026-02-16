import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import AWS from 'aws-sdk'

@Injectable()
export class UploadsService {
  constructor(private prisma: PrismaService) {}

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private getS3Client() {
    const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000'
    const accessKeyId = process.env.S3_ACCESS_KEY || 'minioadmin'
    const secretAccessKey = process.env.S3_SECRET_KEY || 'minioadmin'
    return new AWS.S3({
      endpoint,
      accessKeyId,
      secretAccessKey,
      s3ForcePathStyle: true,
      signatureVersion: 'v4'
    })
  }

  private getAllowedMime(): string[] {
    return (process.env.UPLOAD_ALLOWED_MIME || 'image/jpeg,image/png,application/pdf')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean)
  }

  private getMaxSize(): number {
    return Number(process.env.UPLOAD_MAX_SIZE_BYTES || 5 * 1024 * 1024)
  }

  private sanitizeFileName(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_')
  }

  createSignedUrl(userId: string, payload: { fileName: string; mime: string; size: number; category?: string }) {
    const allowed = this.getAllowedMime()
    if (!allowed.includes(payload.mime)) {
      throw new BadRequestException(`Unsupported mime type: ${payload.mime}`)
    }
    if (payload.size > this.getMaxSize()) {
      throw new BadRequestException(`File too large: ${payload.size}`)
    }

    const endpoint = process.env.S3_ENDPOINT || 'http://localhost:9000'
    const bucket = process.env.S3_BUCKET || 'shoppy'
    const safeName = this.sanitizeFileName(payload.fileName)
    const prefix = this.sanitizeFileName(payload.category || 'evidence')
    const key = `uploads/${userId}/${prefix}/${Date.now()}-${safeName}`

    const uploadUrl = `${endpoint}/${bucket}/${key}`
    const publicUrl = uploadUrl

    return { key, uploadUrl, publicUrl, expiresInSeconds: 900 }
  }

  async completeUpload(userId: string, payload: { key: string; url: string; mime: string; size: number }) {
    const allowed = this.getAllowedMime()
    if (!allowed.includes(payload.mime)) {
      throw new BadRequestException(`Unsupported mime type: ${payload.mime}`)
    }
    if (payload.size > this.getMaxSize()) {
      throw new BadRequestException(`File too large: ${payload.size}`)
    }
    if (!payload.key.startsWith(`uploads/${userId}/`)) {
      throw new BadRequestException('Upload key does not match user')
    }

    return this.prisma.upload.create({
      data: {
        uploadedById: userId,
        key: payload.key,
        url: payload.url,
        mime: payload.mime,
        size: payload.size
      }
    })
  }

  async completeUploadWithVerify(userId: string, payload: { key: string; url: string; mime: string; size: number }) {
    const bucket = process.env.S3_BUCKET || 'shoppy'
    const s3 = this.getS3Client()
    const attempts = Number(process.env.UPLOAD_VERIFY_ATTEMPTS || 3)
    const baseDelayMs = Number(process.env.UPLOAD_VERIFY_DELAY_MS || 300)

    for (let i = 0; i < attempts; i += 1) {
      try {
        await s3.headObject({ Bucket: bucket, Key: payload.key }).promise()
        return this.completeUpload(userId, payload)
      } catch (err) {
        if (i === attempts - 1) {
          throw new BadRequestException('Upload not found in storage')
        }
        await this.sleep(baseDelayMs * Math.pow(2, i))
      }
    }

    throw new BadRequestException('Upload verification failed')
  }
}
