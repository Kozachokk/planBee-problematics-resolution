export function validateIdParam(req, res, next, id) {
    //Validate solution id to not waste resource on a useless query
    if(isNaN(id) || id <= 0){
        res.status(400).send("The problem with id: " + id + " doesn't exist.");
        return;
    }
    next();
}


// Use this more often i guess?
export function isIdValid(value){
    return (isNaN(value) || value <= 0)
}