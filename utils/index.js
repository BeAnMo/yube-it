/* Utility Functions */

// Request, Response, Function -> Void
// middleware to ensure user is logged in when access certain content
function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('info', 'You must be logged in to see this page');
        res.redirect('/');
    }
}

// Date -> String
// formats Date to YYYY-MM-DD
function formatDate(dateObj){
    let date = new Date(dateObj);
    let adjust = (d) => { 
        if(d < 10) {
            return '0' + d;
        } else {
            return d;
        }
    };
    
    let year = date.getFullYear();
    let month = adjust(date.getMonth());
    let day = adjust(date.getDate());
    
    console.log(day);
    
    return year + '-' + month + '-' + day;
}

// String -> String
// converts a Post title to the URI appropriate form
function formatTitle(title){
    let newTitle = title.toLowerCase();
    let re = /\W/gi;
    
    return newTitle.replace(re, (matched) => {
        let char = matched.charCodeAt(0);
        if(char === 32){
            return '_';
        } else {
            return '';
        }
    });
}

// Number -> String
// takes in a Date (in milliseconds UTC),
// returns the time elapsed from the input Date and the current Date
function timeFromNow(then){
    let now = Date.now();
    let delta = (now - then) / 1000;
    // Number, Number -> Number
    let adjust = (delta, amount) => { return (delta / amount).toFixed(2); }
  
    if(delta < 60){
        return adjust(delta, 1) + ' seconds ago';
    } else if(delta > 60 && delta < 3600){
        return adjust(delta, 60) + ' minutes ago';
    } else if(delta > 3600 && delta < 86400){
        return adjust(delta, 3600) + ' hours ago';
    } else {
        return adjust(delta, 86400) + ' days ago';
    }
}


module.exports = {
    formatDate:  formatDate,
    formatTitle: formatTitle,
    elapsedTime: timeFromNow,
    ensureAuthenticated: ensureAuthenticated
}
