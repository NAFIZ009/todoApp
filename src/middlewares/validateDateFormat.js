const url = require('url');
// date format validation middleware
function validateDateFormat(req,res,next) {
    //req url object 
    const pathObj =url.parse(req.url,true);

    //if date is not specified
    if(!pathObj.query.date)
    {
        res.writeHead(400,{'content-type':'application/json'});
        res.end(JSON.stringify({status:'Unsuccessful', message:'Date is not specified'}));
        return;
    }

    // Define a regular expression for "DD-MM-YYYY" format
    const dateFormatRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(1000|19[0-9][0-9]|20[0-9][0-9]|9999)$/;

    // Parse the date components
    const [day, month, year] = pathObj.query.date.split('-').map(Number);
  
    // Check if the string matches the format & Validate day, month, and year ranges
    if ((!dateFormatRegex.test(pathObj.query.date))||(day < 1 || day > 31 || month < 1 || month > 12 || year < 1000 || year > 9999)) {
        //if date format is not acceptable
        res.writeHead(400,{'content-type':'application/json'});
        res.end(JSON.stringify({status:'Unsuccessful', message:'Date Format is not acceptable'}));
        return;
    }

    next(req,res);
}

module.exports=validateDateFormat;