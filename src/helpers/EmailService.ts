
import * as mailer from 'nodemailer';

export class EmailServer {

    public async sendEmail(options: any): Promise<boolean> {

        const transporter: any = mailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: process.env.EMAIL_USERNAME, // generated ethereal user
              pass: process.env.EMAIL_PASS, // generated ethereal password
            },
        });

        const info: any = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: options.to, // list of receivers
            subject: 'Forgot Password ✔', // Subject line
            text: 'Hello world?', // plain text body
            html: '<b>Hello world?</b>', // html body
        });

        console.log('Message sent: %s', info.messageId);

        return true;
    }
}
