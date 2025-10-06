class ErrorHandler extends Error{
    constructor(message,statusCode){
        super(message);
        this.statusCode = statusCode
        Error.captureStackTrace(this,this.constructor)
    }    
}

export const errorHandler = ErrorHandler

//error handler is a class and whenever we create an object of the class we use new keyword.
//So in our code when ever we will use errorHandler we have to use the new keyword.


/*
without Error.captureStackTrace:-
if you do not use this line the error report would include unnecessary technical
detail like where the erroe handler class itself is defined.ErrorThat is not helpful 
when we try to debug the code


with Error.captureStackTrace:-
we are saying that skip all the setup details and just show 
me where the erroe acually happenend in the code

*/
