import { Module } from '@nestjs/common';
import { MailService, SmsService } from './common.service';

@Module({
    providers:[MailService, SmsService],
    exports:[MailService,SmsService]
})
export class CommonModule {}
