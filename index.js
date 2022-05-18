const express = require('express');
const app = express();
//const port = 3000;
var dateTime = require('node-datetime');
var dt = dateTime.create();
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');
var Constants = require('./constants');
const res = require('express/lib/response');
const session = require('express-session');
const md5 = require('md5');
var multer  =   require('multer');
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

app.get('*', function(req, res, next) {
	res.locals.session = req.session;
	next();
});

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
    if (req.session.loggedin) {
        res.redirect("/super-user/dashboard");
    }else{
        res.render('admin/login', { title: 'Login'});
    }
   
});

app.post('/user/auth', function(request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
    // Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT * FROM admin WHERE username = ? AND password = ?', [username, md5(password)], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.admin_id = results[0].admin_id;
				request.session.save();
				
				response.json({"is_loggedin":"Yes"});
			}else{
				response.json({"is_loggedin":"No"});
			}			
			
		});
	} else {
		response.json({"is_loggedin":"No"});
	}
});

app.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		res.redirect('/super-user/login') // will always fire after session is destroyed
 	})
})

app.get('/super-user/home-page', async(req, res) => {
     const homeContent = await new Promise((resolve) => {
        db.query('SELECT * FROM home_page WHERE id=1', (err, res) => {
          resolve(res)
        })
    })
    res.render('admin/home_page', { title: 'Home Page','homeContent':homeContent});
});

app.get('/super-user/about_us', async(req, res) => {
    const homeContent = await new Promise((resolve) => {
       db.query('SELECT * FROM home_page WHERE id=1', (err, res) => {
         resolve(res)
       })
   })
   res.render('admin/home_page', { title: 'Home Page','AboutContent':AboutContent});
});

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/home_images')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
  })

var storageLogo = multer.diskStorage({
destination: function (req, file, cb) {
    cb(null, 'public/home_logo')
},
filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
}
})
var upload = multer({ storage: storage })
var uploadLogo = multer({ storage: storageLogo })

// use for about us page as well
app.post('/super-user/homepage/update', upload.single('main_image'), (req, res, next) => {
    var main_title = req.body.main_title;
    var second_heading = req.body.second_heading;
    var third_heading= req.body.third_heading;
    var fourth_heading= req.body.fourth_heading;
    var five_heading= req.body.five_heading;
    var six_heading= req.body.six_heading;
    var section_4_heading=req.body.section_4_heading;
    var sub_4_1_heading=req.body.sub_4_1_heading;
    var sub_4_1_details=req.body.sub_4_1_details;
    var sub_4_2_heading=req.body.sub_4_2_heading;
    var sub_4_2_details=req.body.sub_4_2_details;
    var sub_4_3_heading=req.body.sub_4_3_heading;
    var sub_4_3_details=req.body.sub_4_3_details;
    var sub_4_4_heading=req.body.sub_4_4_heading;
    var sub_4_4_details=req.body.sub_4_4_details;
    var business=req.body.business;
    var sold=req.body.sold;
    var transaction=req.body.transaction;
    var support=req.body.support;
    var sub_3_1_heading= req.body.sub_3_1_heading;
    var sub_3_1_details=req.body.sub_3_1_details;
    var sub_3_2_heading= req.body.sub_3_2_heading;
    var sub_3_2_details=req.body.sub_3_2_details;
    const file = req.file
    var sendData = { main_title: main_title,second_heading: second_heading,third_heading:third_heading,fourth_heading:fourth_heading,five_heading:five_heading,six_heading:six_heading, section_4_heading:section_4_heading, sub_4_1_heading:sub_4_1_heading, sub_4_1_details:sub_4_1_details,sub_4_2_heading:sub_4_2_heading, sub_4_2_details:sub_4_2_details,sub_4_3_heading:sub_4_3_heading, sub_4_3_details:sub_4_3_details,sub_4_4_heading:sub_4_4_heading, sub_4_4_details:sub_4_4_details,business:business,sold:sold,transaction:transaction,support:support,sub_3_1_heading:sub_3_1_heading,sub_3_1_details:sub_3_1_details,sub_3_2_heading:sub_3_2_heading,sub_3_2_details:sub_3_2_details};
    if (file) {
        console.log(file);
        var sendData = { main_title: main_title,second_heading: second_heading,main_image:file.filename,third_heading:third_heading,fourth_heading:fourth_heading,five_heading:five_heading,six_heading:six_heading,section_4_heading:section_4_heading,sub_4_1_heading:sub_4_1_heading,sub_4_1_details:sub_4_1_details,sub_4_3_heading:sub_4_3_heading, sub_4_3_details:sub_4_3_details,sub_4_4_heading:sub_4_4_heading, sub_4_4_details:sub_4_4_details,sub_3_1_heading:sub_3_1_heading,sub_3_1_details:sub_3_1_details,sub_3_2_heading:sub_3_2_heading,sub_3_2_details:sub_3_2_details};
    }
 
    db.query('UPDATE home_page SET ? WHERE id = ?', [sendData, 1], function(err, result) {
        if (err) throw err;
        res.send("Yes");
      });
});

app.get('/super-user/home-logo-section', async(req, res) => {
    const homeLogo = await new Promise((resolve) => {
       db.query('SELECT * FROM home_logo', (err, res) => {
         resolve(res)
       })
   })
   res.render('admin/home_logo', { title: 'Home Logo','homeLogo':homeLogo});
});

app.post('/super-user/homepage/new_logo', uploadLogo.single('logo'), (req, res, next) => {
    var redirect_link = req.body.redirect_link;
    const file = req.file
    let newLogoSql = `INSERT INTO home_logo (logo, logo_link) VALUES (?, ?);`;
    db.query(newLogoSql, [file.filename,redirect_link], (err, rows) => {
        if (err) throw err;
        res.send("Yes");
    });
});

app.post('/super-user/homepage/remove_logo', function(request, response) {
    let logo_id = request.body.id;
    console.log('Logo '+logo_id);
    var sql = 'DELETE FROM home_logo WHERE id = ?';
    db.query(sql, [logo_id], function (err, data) {
      if (err) throw err;
      console.log('record deleted!'+logo_id);
      response.send('Yes');
    });
})

app.get('/super-user/dashboard', (req, res) => {
    if (req.session.loggedin) {
        res.render('admin/dashboard', { title: 'Dashboard'});
    }else{
        res.redirect("/super-user/login");
    }
});


app.get('/super-user/contact', (req, res) => {
    if (req.session.loggedin) {
        res.render('admin/contact', { title: 'Contents'});
    }else{
        res.redirect("/super-user/login");
    }
});

app.get('/super-user/testimonial', (req, res) => {
    if (req.session.loggedin) {
        res.render('admin/testimonial', { title: 'Contents',product:[]});
    }else{
        res.redirect("/super-user/login");
    }
});

app.get('/super-user/testimonial_list', function(request, response) {
    if (request.session.loggedin) {
        var query = 'SELECT * FROM testimonial_old';
        db.query(query, (err, rows, fields) => {
            if (!err)
               
                response.render('admin/testimonial_list', { title: 'Testimonial', contact: rows});
            else
                console.log(err);
        })    
    }else{
        response.redirect("/super-user/login");
    }
});

app.post('/testimonial', function(request, response) {
    if (request.session.loggedin) {
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
    }else{
        response.redirect("/super-user/login");
    }
    
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
app.get('/', async(req, res) => { //get requests to the root ("/") will route here
    var getLogo = 'SELECT * FROM home_logo';
    const homeLogo = await new Promise((resolve) => {
        db.query(getLogo, (err, res) => {
          resolve(res)
        })
    })
    
    const homeContent = await new Promise((resolve) => {
        db.query('SELECT * FROM home_page WHERE id=1', (err, res) => {
          resolve(res)
        })
    })
    res.render('client/index', { title: 'Home','homeContent':homeContent,'homeLogo':homeLogo});
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


// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

const port = process.env.port || 4000; 
app.listen(port, ()=>{
    console.log("We are running at Done 3000 ");
});