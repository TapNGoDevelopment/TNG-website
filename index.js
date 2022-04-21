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
const session = require('express-session');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var db = require('./database');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

const handlebarOptions = {
    viewEngine: {
        partialsDir: path.resolve('./views/'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./views/'),
   
};

var transporter = nodemailer.createTransport(
    {
        service: Constants.SMTP_SERVER,
        auth:{
            user: Constants.SMTP_EMAIL,
            pass: Constants.SMTP_PASSWORD
        }
    }
);

// admin side

app.get('/super-user/login', (req, res) => {
    res.render('admin/login', { title: 'Login'});
});

app.get('/super-user/dashboard', (req, res) => {
    res.render('admin/dashboard', { title: 'Dashboard'});
});

app.get('/super-user/contents', (req, res) => {
    res.render('admin/contents', { title: 'Contents'});
});

app.get('/super-user/contact', (req, res) => {
    res.render('admin/contact', { title: 'Contents'});
});

app.get('/super-user/testimonial', (req, res) => {
    res.render('admin/testimonial', { title: 'Contents'});
});

app.get('/super-user/testimonial_list', function(request, response) {
    var query = 'SELECT * FROM testimonial_old';
    db.query(query, (err, rows, fields) => {
        if (!err)
           
            response.render('admin/testimonial_list', { title: 'Testimonial', contact: rows});
        else
            console.log(err);
    })

});

  app.post('/testimonial', function(request, response) {
    var name = request.body.Name;
    var company_name = request.body.company_name;
    var client_since = request.body.client_since;
    var message = request.body.Message;

    var sql = `INSERT INTO testimonial_old (Name, company_name, Client_since, Message) VALUES ("${name}", "${company_name}", "${client_since}", "${message}")`;
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      response.redirect('back');
      response.end();
    });
  });

app.get('/view', function(request, response) {
    var query = 'SELECT * FROM contact';
    db.query(query, (err, rows, fields) => {
        if (!err)
           
            response.render('admin1/view', { title: 'Dashboard', contact: rows});
        else
            console.log(err);
    })

});

// update testimonial details

app.get('/admin/edit-form/:id', function(req, response) {
    var id = req.params.id;
    var sql = `SELECT * FROM testimonial_old WHERE id=${id}`;
    db.query(sql, function(err, rows, fields) {
        response.render('admin/testimonial', {title: 'Edit Product', product: rows[0]});
    });
  });

  app.post('/edit/:id', function(request, response) {
    var id = request.params.id;
    var Name = request.body.Name;
    var company_name  = request.body.company_name;
    var Client_since = request.body.Client_since;
    var Message = request.body.Message;
  
    var sql = `UPDATE testimonial_old SET Name="${Name}", company_name="${company_name}", Client_since="${Client_since}", Message="${Message}" WHERE id=${id}`;
  
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record updated!');
      response.redirect('/super-user/testimonial_list');
    });
  });

  // delete testimonial details

  app.get('/delete/:id', function(request, response){
    var id = request.params.id;
    console.log(id);
    var sql = `DELETE FROM testimonial_old WHERE id=${id}`;
  
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record deleted!');
      response.redirect('/super-user/testimonial_list');
    });
  });



  // client side 
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

app.get('/testimonial', (req, res) => {
    res.render('client/testimonial', { title: 'Home'});
});

app.get('/support', (req, res) => {
    res.render('admin1/support', { title: 'Home'});
});



app.post('/send', function(request, response) {
    var phone = request.body.phone;
    var email = request.body.email;
    var heading = request.body.heading;
    var main_heading = request.body.main_heading;
    var small_heading = request.body.small_heading;
  
    var sql = `INSERT INTO contact (phone, email, heading, main_heading, small_heading) VALUES ("${phone}", "${email}", "${heading}", "${main_heading}", "${small_heading}")`;
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      response.redirect('back');
      response.end();
    });
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
        console.log("Your message has been sent");
        
        response.redirect('back');
        response.end();
   
    
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

