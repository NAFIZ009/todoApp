const url = require('url');
//date validation middleware
const validateDate=(req,res,next)=>{
    //req url object 
    const pathObj =url.parse(req.url,true);

    //validate day,month and year
    //a date will be valid if it is today or tomorrow
    const [inputDay, inputMonth, inputYear] = pathObj.query.date.split('-').map(Number);

    //current date
    const currentDate = new Date();

    //check the input date is valid or not
    if(!((inputDay ===currentDate.getDate() && inputMonth === currentDate.getMonth()+1 && inputYear === currentDate.getFullYear())||(inputDay ===currentDate.getDate()+1 && inputMonth === currentDate.getMonth()+1 && inputYear === currentDate.getFullYear()))){
        res.writeHead(400,{'content-type':'application/json'});
        res.end(JSON.stringify({status:'Unsuccessful', message:'Invalid date'}));
        return;
    }

    next(req, res);
}

module.exports = validateDate;