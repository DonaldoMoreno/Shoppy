import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateSignedUploadDto } from './dto/create-signed-upload.dto'
import { CompleteUploadDto } from './dto/complete-upload.dto'
import { UploadsService } from './uploads.service'

@Controller('uploads')
export class UploadsController {
  constructor(private svc: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('signed-url')
  createSigned(@Request() req, @Body() body: CreateSignedUploadDto) {
    return this.svc.createSignedUrl(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete')
  complete(@Request() req, @Body() body: CompleteUploadDto) {
    return this.svc.completeUpload(req.user.id, body)
  }

  @UseGuards(JwtAuthGuard)
  @Post('complete-verify')
  completeVerify(@Request() req, @Body() body: CompleteUploadDto) {
    return this.svc.completeUploadWithVerify(req.user.id, body)
  }
}
