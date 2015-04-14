// email wrapper fonction
// Called from controllers 


var nconf = require('nconf');
nconf.argv().env().file({file:'config.json'});
var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');
var transporter = nodemailer.createTransport(directTransport());

// setup e-mail data (defaults)
var mailOptions = {
    from: nconf.get('MAIL_SENDER'), // sender address
    to: nconf.get('MAIL_DEFAULT_RECEIVER'),
    subject: '[-]', // Subject line
    text: '-', // plaintext body
    html: '-' // html body
};


exports.sendmail = function(options){

        // DEPENDS FROM API / SERVER CONFIGs
        if(!nconf.get('MAIL_API')){
            console.log('NO MAIL API')
            console.log(options)
        }
        else{
                mailOptions.Subject         = options.subject;
                mailOptions.text            = options.text;
                mailOptions.html            = options.text;
                // send mail with defined transport object
      
       
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                        console.log(error);
                    }else{
                        console.log('Message sent: ' + info.response);
                    }
                });
                console.log('sent mail>')
                console.log(mailOptions)


        }
       return;
}
// DIRECT CALL TEST.
//var o = new Object({'subject':'sdds', 'text': 'sd'})
//this.sendmail(o)