require('./dbconnect');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { body, validationResult } = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const { format } = require('date-fns');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const nodeMailer = require('nodemailer');
const ServiceModel = require('./models/Service');
const AvailabilityModel = require('./models/Availability');
const AppointmentModel = require('./models/Appointment');
const PromoModel = require('./models/Promo');
const fs = require('fs');
const path = require('path');
const clientEmailTemplate = fs.readFileSync(path.join(__dirname, 'email templates/clientEmail.html'), 'utf8');
const emailTemplate = fs.readFileSync(path.join(__dirname, 'email templates/email.html'), 'utf8');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({                                                                                                                                                                                                                                                                                                                                                                                                            
  credentials: true,
  //origin: `https://kbspas.ca`
  origin: `http://localhost:5173`
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com'],
      frameSrc: ["'self'", 'https://js.stripe.com']
    }
  }
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 75,
  message: "Rate limit exceeded"
});

app.use(['/api/', '/protected/', '/protected2/'], apiLimiter);

app.use(mongoSanitize());

app.use(cookieParser());

const authenticateUser = (req, res, tokenName, expiry, path) => {
  const { password } = req.body;
  let access = tokenName.replace("Token", "").toUpperCase();
  
  if (password === process.env[`${access}_PASSWORD`]) {
    const token = jwt.sign({ authenticated: true }, process.env.AUTH_SECRET_KEY, { expiresIn: expiry });
    res.cookie(tokenName, token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: expiry * 1000, path });
    console.log(`${access} login successful`);
    res.json({ message: 'Login successful' });
  } else {
    console.log(`Incorrect password for ${access} authentication`);
    res.status(401).json({ error: 'Incorrect password' });
  }
};

const verifyToken = (tokenName, access) => {
  return (req, res, next) => {
    const token = req.cookies[tokenName];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.AUTH_SECRET_KEY, (error, decoded) => {
      if (error) return res.sendStatus(403);
      req[access] = decoded;
      next();
    });
  };
};

app.post('/api/adminAuthentication', (req, res) => {
  authenticateUser(req, res, 'adminToken', 3600, '/protected');
});

const adminToken = verifyToken('adminToken', 'admin');

app.use('/protected', adminToken);

app.get('/protected/api/checkAdminAuth', (req, res) => {
  res.json({ valid: true, authenticated: req.admin.authenticated });
});

app.post('/api/bypassAuthentication', (req, res) => {
  authenticateUser(req, res, 'bypassToken', 900, '/protected2');
});

const bypassToken = verifyToken('bypassToken', 'authorizedUser');

app.use('/protected2', bypassToken);

app.get('/protected2/api/checkBypassAuth', (req, res) => {
  res.json({ valid: true, authenticated: req.authorizedUser.authenticated });
});

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error(errors.array());
    return res.status(400).json({ message: 'Invalid input' });
  }
  next();
};

const locationRule = (location) => {
  return body(location).trim().matches(/^(Richmond Hill|Waterloo)$/).withMessage(`Invalid ${location}`);
};

const dateRule = (dates, isArray) => {
  const regex = /^\d{2}-\d{2}-\d{4}$/;

  if (isArray) {
    return body(dates)
      .isArray().withMessage(`${dates} must be an array`)
      .custom(value => {
        if (!value.every(date => regex.test(date))) {
          return Promise.reject(`Invalid date in ${dates} array`);
        }
        return true;
      });
  } else {
    return body(dates).trim().matches(regex).withMessage(`Invalid ${dates}`);
  }
};

const timeRule = (timeSlots, isArray) => {
  const regex = /^(1[0-2]|[1-9]):(00|30) [AP]M$/;

  if (isArray) {
    return body(timeSlots)
      .isArray().withMessage(`${timeSlots} must be an array`)
      .custom(value => {
        if (!value.every(time => regex.test(time))) {
          return Promise.reject(`Invalid time in ${timeSlots} array`);
        }
        return true;
      });
  } else {
    return body(timeSlots).trim().matches(regex).withMessage(`Invalid ${timeSlots}`);
  }
};

const nameRule = (name) => {
  return body(name).trim().matches(/^[a-zA-Z-' ]{1,35}$/).withMessage(`Invalid ${name}`);
};

const promoCodeRule = (promoCode) => {
  return body(promoCode).trim().toUpperCase().matches(/^[A-Z0-9]+$/).withMessage(`Invalid ${promoCode}`);
};

const setAvailabilityRules = () => {
  return [
    locationRule('selectedLocation'),
    dateRule('selectedDates', true),
    timeRule('allTimeSlots', true),
    timeRule('selectedTimeSlots', true)
  ];
};

const deleteAvailabilityRules = () => { 
  return [ 
    dateRule('selectedDates', true) 
  ];
};

const createPromoRules = () => {
  return [
    promoCodeRule('promoCode'),
    body('percentOff').trim().matches(/^(100|[1-9][0-9]?)$/).withMessage('Invalid percent off')
  ];
};

const clientPromoCodeRules = () => {
  return [
    promoCodeRule('promoCode')
  ];
};

const clientInputRules = () => {
  return [
    nameRule('firstName'),
    nameRule('lastName'),
    body('email').trim().toLowerCase().matches(/^(?=.{1,254}$)(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/).withMessage('Invalid email'),
    body('phone').trim().matches(/^\d{10}$/).withMessage('Invalid phone number'),
    body('promoCode').trim().toUpperCase().custom(async (value, {req}) => {
      if (value === '') return true;
      const promo = await PromoModel.findOne({ code: value });
      if (!promo) return Promise.reject('Invalid promo code');
      req.promo = promo;
    }),
    body('selectedService').trim().custom(async (value, {req}) => {
      if (value.includes("Full Set") || value.includes("Refill")) {
        value = value.split(' - ')[0];
      }
      const service = await ServiceModel.findOne({ name: value });
      if (!service) return Promise.reject('Invalid service');
      req.serviceDoc = service;
    }),
    locationRule('selectedLocation'),
    dateRule('selectedDate', false),
    timeRule('selectedTimeSlot', false)
  ];
};

app.post('/protected/api/setAvailability', setAvailabilityRules(), validateInput, async (req, res) => {
  const {selectedLocation, selectedDates, allTimeSlots, selectedTimeSlots} = req.body;

  try {
    const mappedTimeSlots = allTimeSlots.map(time => ({
      startTime: time,
      available: selectedTimeSlots.includes(time),
    }));
    
    for (const date of selectedDates) {
      await AvailabilityModel.create({
        location: selectedLocation,
        date,
        timeSlots: mappedTimeSlots,
      });
    }
    res.json({message: "Successfully set availability"});
  } catch (error) { 
    if (error.code === 11000) {
      res.status(400).json({ error: 'Availability for one or more selected dates already exists' });
    } else { 
      console.error('Error setting availability:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
})

app.post('/protected/api/deleteAvailability', deleteAvailabilityRules(), validateInput, async (req, res) => {
  const {selectedDates} = req.body;
  try {
    for (const date of selectedDates) {
      await AvailabilityModel.findOneAndDelete({date});
    }
    res.json({message: "Successfully deleted availability"});
  } catch (error) {
    console.error('Error deleting availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/protected/api/createPromo', createPromoRules(), validateInput, async (req, res) => {
  const {promoCode, percentOff} = req.body;
  try {
    await PromoModel.create({
        code: promoCode,
        percentOff
    });
    res.json({message: "Successfully created promo"});
  } catch (error) { 
    if (error.code === 11000) {
      res.status(400).json({ error: 'Promo already exists' });
    } else { 
      console.error('Error creating promo:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
})

app.delete('/protected/api/deletePromo/:id', async (req, res) => {
  try {
    const document = await PromoModel.findByIdAndDelete(req.params.id);
    if (!document) return res.status(404).json({ error: 'Document not found' });
    res.json({message: "Successfully deleted promo"});
  } catch (error) {
    console.error('Error deleting promo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/protected/api/fetchPromos', async (req, res) => {
  try {
    const promos = await PromoModel.find();
    res.json(promos);
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/protected/api/fetchAppointments', async (req, res) => {
  try {
    const appointments = await AppointmentModel.find();
    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/api/fetchServices', async (req, res) => {
  try {
    const services = await ServiceModel.find();
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.get('/api/fetchAvailability', async (req, res) => {
  const {location: selectedLocation} = req.query;

  try {
    if (!!selectedLocation) {
      const data = await AvailabilityModel.find({location: selectedLocation});
      
      const currentDate = format(new Date(), 'MM-dd-yyyy');
      const filteredDates = data.filter(entry => {
          const entryDate = format(new Date(entry.date), 'MM-dd-yyyy');
          return entryDate !== currentDate && entry.timeSlots.some(timeSlot => timeSlot.available);
      });
      const filteredDatesTimes = filteredDates.map(entry => ({
          ...entry,
          date: format(new Date(entry.date), 'MM-dd-yyyy'),
          timeSlots: entry.timeSlots.filter(timeSlot => timeSlot.available),
      }));
      res.json(filteredDatesTimes);
    } else { 
      const data = await AvailabilityModel.find();
      const dates = data.map(entry => ({
        ...entry,
        date: format(new Date(entry.date), 'MM-dd-yyyy'),
      }));
      res.json(dates);
    }

  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

app.post('/api/validatePromoCode', clientPromoCodeRules(), validateInput, async (req, res) => {
  const { promoCode } = req.body;
  try {
    const promo = await PromoModel.findOne({ code: promoCode });
    if (promo) {
        res.json({ valid: true, percentOff: promo.percentOff });
    } else {
        res.json({ valid: false });
    }
  } catch (error) {
    console.error('Error validating promo:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

async function checkAvailability(location, date, time) {
  const availability = await AvailabilityModel.findOne({ location, date });
  if (!availability) return false;
  let timeSlotIndex = availability.timeSlots.findIndex(timeSlot => timeSlot.startTime === time);
  if (timeSlotIndex === -1) return false;
  return (availability.timeSlots[timeSlotIndex].available);
}

async function updateAvailability(location, date, time) {
  try {
    const availability = await AvailabilityModel.findOne({ location, date });
    let timeSlotIndex = availability.timeSlots.findIndex(timeSlot => timeSlot.startTime === time);
    if (!availability.timeSlots[timeSlotIndex].available) throw new Error("Time slot unavailable");
    for (let i = Math.max(0, timeSlotIndex - 4); i < Math.min(timeSlotIndex + 5, availability.timeSlots.length); i++) {
        availability.timeSlots[i].available = false;
    }
    await availability.save();
  } catch (error) {
    throw error;
  }
}

async function createAppointment(firstName, lastName, email, phoneNumber, service, location, date, time, promo) {
  let promoApplied = '';
  if (promo) { promoApplied = promo.code + ': ' + promo.percentOff + '% off' };

  let [hour, minutesMeridiem] = time.split(':');

  let minutes = minutesMeridiem.substring(0, 2);
  
  let meridiem = minutesMeridiem.substring(3);
  
  hour = parseInt(hour);
  if (meridiem === 'PM' && hour !== 12) {
    hour = (hour + 12).toString();
  } else if (meridiem === 'AM' && hour === 12) {
    hour = '00';
  } else if (meridiem === 'AM' && hour < 10) {
    hour = '0'+ hour.toString();
  }
  
  date = `${format(new Date(date), 'yyyy-MM-dd')}T${hour}:${minutes}:00.000Z`;

  try {
    const appointment = await AppointmentModel.create({
      name: firstName + ' ' + lastName,
      email,
      phoneNumber,
      service,
      location,
      date,
      time,
      promoApplied
    });
    return appointment;
  } catch (error) { 
    throw error;
  }
}

async function bookAppointment(req, deposit) {
  const { firstName, lastName, email, phone, selectedService, selectedLocation, selectedDate, selectedTimeSlot } = req.body;

  let errorMsg = "";

  console.log("Booking appointment: ", req.body);

  try {
    await updateAvailability(selectedLocation, selectedDate, selectedTimeSlot);
  } catch (error) { 
    if (error.message === "Time slot unavailable") { 
      errorMsg += "DATE/TIME IS UNAVAILABLE. CONTACT CLIENT TO RESCHEDULE. ";
      console.error("DATE/TIME IS UNAVAILABLE");
    } else { 
      console.error("ERROR UPDATING AVAILABILITY: ", error);
      errorMsg += "ERROR UPDATING AVAILABILITY. ";
    }
  }
  
  const serviceDoc = req.serviceDoc;
  const basePrice = selectedService.includes("Refill") ? serviceDoc.refillPrice : serviceDoc.price;
  const promo = req.promo;
  let percentOff = 0;
  if (promo) percentOff = promo.percentOff;
  const total = basePrice * (1-percentOff/100) - deposit;

  try {
    await createAppointment(firstName, lastName, email, phone, selectedService, selectedLocation, selectedDate, selectedTimeSlot, promo);
  } catch (error) { 
    console.error("ERROR CREATING APPOINTMENT: ", error);
    errorMsg += "ERROR CREATING APPOINTMENT. ";
  }
  
  try {
    await sendClientEmail(firstName, email, selectedService, selectedLocation, selectedDate, selectedTimeSlot, total);
  } catch (error) { 
    console.error("ERROR SENDING EMAIL TO CLIENT: ", error);
    errorMsg += "ERROR SENDING EMAIL TO CLIENT.";
  }
  
  try {
    await sendEmail(firstName, lastName, email, phone, promo, selectedService, selectedLocation, selectedDate, selectedTimeSlot, total, errorMsg);
  } catch (error) { 
    console.error("Error sending email to KbSpas: ", error);
  }
}

app.post("/api/payment", clientInputRules(), validateInput, async (req, res) => {
  const { id, firstName, lastName, email, selectedLocation, selectedDate, selectedTimeSlot } = req.body;

  if (!await checkAvailability(selectedLocation, selectedDate, selectedTimeSlot)) {
    return res.json({ message: "Time slot unavailable" }); 
  }

  try {
    const customer = await stripe.customers.create({
      name: firstName + ' ' + lastName,
      email,
    });

    const idempotencyKey = req.headers['idempotency-key'];
    const payment = await stripe.paymentIntents.create({
      amount: 2000,
      currency: 'CAD', 
      description: "KbSpas Payment",
      payment_method: id, 
      customer: customer.id,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    }, { idempotencyKey });
  } catch (error) {
    console.error("Error processing payment: ", {
      errorType: error.type,
      errorCode: error.code,
      declineCode: error.decline_code,
      errorMessage: error.message,
      paymentIntentId: error.payment_intent ? error.payment_intent.id : null,
      chargeId: error.charge,
      requestId: error.requestId,
      statusCode: error.statusCode
    });
    
    if ((error.type === 'StripeInvalidRequestError' && error.statusCode === 409) || (error.type === 'StripeIdempotencyError' && error.statusCode === 400)) {
      return res.json({ message: "Idempotency key in use" }); 
    }
    return res.json({ message: "Payment failed" });
  }

  await bookAppointment(req, 20);
  return res.json({ message: "Successfully booked appointment" });
})

const GMAIL = process.env.GMAIL;
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD;

const transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
      user: GMAIL,
      pass: GMAIL_PASSWORD
  },
  secure: true
});

async function sendClientEmail(firstName, email, service, location, date, time, total) {
  let htmlContent = clientEmailTemplate
    .replace('${firstName}', firstName)
    .replace('${service}', service)
    .replace('${address}', location)
    .replace('${date}', date)
    .replace('${time}', time)
    .replace('${total}', Number(total).toFixed(2));

  const mailOptions = {
    from: GMAIL,
    to: email,
    subject: 'Your appointment with KbSpas is booked!',
    html: htmlContent
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent to client: %s ", info.messageId);
  } catch (error) {
    throw error;
  }
}

async function sendEmail(firstName, lastName, email, phone, promo, service, location, date, time, total, errorMsg) {
  let promoApplied = '';
  if (promo) { promoApplied = promo.code + ': ' + promo.percentOff + '% off' };
  let htmlContent = emailTemplate
    .replace('${error}', errorMsg)
    .replace('${name}', firstName + ' ' + lastName)
    .replace('${email}', email)
    .replace('${phone}', phone)
    .replace('${service}', service)
    .replace('${location}', location)
    .replace('${date}', date)
    .replace('${time}', time)
    .replace('${promo}', promoApplied)
    .replace('${total}', Number(total).toFixed(2));

  const mailOptions = {
    from: GMAIL,
    to: GMAIL,
    subject: 'An appointment has been booked!',
    html: htmlContent
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent to KbSpas: %s ", info.messageId);
  } catch (error) {
    throw error;
  }
}

app.post("/protected2/api/bypassPayment", clientInputRules(), validateInput, async (req, res) => {
  const { selectedLocation, selectedDate, selectedTimeSlot } = req.body;

  if (!await checkAvailability(selectedLocation, selectedDate, selectedTimeSlot)) { 
    return res.json({ message: "Time slot unavailable" });
  }

  await bookAppointment(req, 0);
  return res.json({ message: "Successfully booked appointment" });
})

app.use(express.static(path.join(__dirname, '.', 'client', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'client', 'build', 'index.html'));
});

app.listen(PORT, () => {console.log(`Server started on port ${PORT}`)});