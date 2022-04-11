const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { TranscationModel } = require('./db/connection');

const app = express()

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())

const mailMessage = (
`<b>Dear Ashutosh Chauhan,</b>
<p>
Thank you for buying a pass for <b>Technunctus 2022</b>. Please find the pass attached with this email.
</p>
<br>
Thanks,<br>
Technunctus Team`);

function generate_ticket(ticket_number, ticket_name) {
  const doc = new PDFDocument();

  let writeStream = fs.createWriteStream('tickets/' + ticket_number + '.pdf');

  doc.pipe(writeStream)

  doc.font('fonts/Montserrat.ttf')
    .fontSize(25)
    .text('Technunctus Pass')

  doc.font('fonts/Montserrat.ttf')
    .fontSize(20)
    .text(ticket_name)

  doc.save()
  doc.end()
  return writeStream;

}

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.post('/buy_pass', (req, res) => {
  let transaction = new TranscationModel();
  transaction.transactionid = req.body.payment_id;
  transaction.transactionamount = req.body.formData.amount;
  transaction.name = req.body.formData.name;
  transaction.email = req.body.formData.email;
  transaction.contact = req.body.formData.contact;
  transaction.referral = req.body.referral;

  transaction.save().then((trans) => {

    // Generate PDF ticket
    generate_ticket(trans._id, trans.name).on('finish', () => {

      let attachment = fs.readFileSync(`${__dirname}/tickets/${trans._id}.pdf`).toString('base64');

      const msg = {
        to: transaction.email,
        from: 'ashutoshc8101@gmail.com',
        subject: 'Thanks for buying pass for technunctus 2022',
        html: mailMessage,
        attachments: [
          {
            content: attachment,
            filename: `pass_${trans._id}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment',
          }
        ]
      };

      sgMail.send(msg)
        .then(() => {
          return res.send('printed and email sent');
      }, error => {
        console.error(error);
        if (error.response) {
          console.error(error.response);
        }
      });
    })
  }).catch(() => {
    res.send('didn\'t save')
  })
});

app.listen(8080, () => {
  console.log('Listening on 8080');
})
