import { Module } from '@nestjs/common';
//import { MailService, SmsService } from './common.service';

import { SmsService } from './common.service';

@Module({
    /*providers:[MailService, SmsService],
    exports:[MailService,SmsService]*/
    providers:[SmsService],
    exports:[SmsService]
})
export class CommonModule {}
