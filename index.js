
const express = require('express');
const app = express();
const port = 3000;
var dateTime = require('node-datetime');
var dt = dateTime.create();
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
var Constants = require('./constants');
const res = require('express/lib/response');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


var transporter = nodemailer.createTransport(
    {
        service: Constants.SMTP_SERVER,
        auth:{
            user: Constants.SMTP_EMAIL,
            pass: Constants.SMTP_PASSWORD
        }
    }
);

// point to the template folder
const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions))
app.get('/', (req, res) => { //get requests to the root ("/") will route here
   
    res.render('client/index', { title: 'Home'});

});

app.get('/contact-us', (req, res) => { 
    res.render('client/contact_us', { title: 'Home'});
});

app.get('/about-us', (req, res) => {
    res.render('client/about_us', { title: 'Home'});
});

app.post('/send_enquiry', function(request, response) {
    var first_name = request.body.first_name;
    var last_name = request.body.last_name;
    var email = request.body.email;
    var mobile = request.body.mobile;
    var business_name = request.body.business_name;
    var business_address = request.body.business_address;
    var enquiry_message = request.body.enquiry_message;
    var enquiry_type = request.body.enquiry_type;
	var mailOptions = {
        from: '"'+Constants.SMTP_FROM_NAME+'" <'+Constants.SMTP_FROM_EMAIL+'>', // sender address
        to: Constants.TO_EMAIL, // list of receivers
        subject: 'You have new '+enquiry_type+' enquiry from Tap N Go!',
        template: 'tmpl_enquiry', // the name of the template file
        context:{
            enquiry_type: enquiry_type, // replace {{enquiry_type}}
            first_name: first_name,
            last_name: last_name,
            mobile_no: mobile,
            email_id: email,
            business_name: business_name,
            business_address: business_address,
            enquiry_message: enquiry_message,
            submitted_at:dt.format('d/m/Y H:M:S')
        }
    };
    
    // trigger the sending of the E-mail
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
       
        
    });

    response.redirect('back');
    response.end();
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});