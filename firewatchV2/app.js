var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var resourcesRouter = require('./routes/resources');
var mapRouter = require('./routes/map');

const predictor = require('./bigquery');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/resources', resourcesRouter);
app.use('/map', mapRouter);


app.use('/api/predict-fire', async (req, res) => {
    let { precip, tmp, wind } = req.query;
    precip = parseFloat(precip);
    tmp = parseFloat(tmp);
    wind = parseFloat(wind);
    console.log(precip);
    if (isNaN(precip) || isNaN(tmp) || isNaN(wind)) {
        return res.json({});
    }
    console.log(tmp);
    const duration = await predictor('wildfire_duration_model_lr', precip, tmp, wind);
    const size = await predictor('wildfire_size_model', precip, tmp, wind);
    if (!duration || typeof duration.predicted_fire_duration != "number" || !size ||
        typeof size.predicted_fire_size != "number") {
        return res.json({});
    }
    let { predicted_fire_duration } = duration;
    let { predicted_fire_size } = size;
    predicted_fire_duration = Math.max(predicted_fire_duration, 10);
    predicted_fire_size = Math.max(predicted_fire_size, 0.001);
    return res.json({ predicted_fire_duration, predicted_fire_size });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;