//this is through promises
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err)=>{
        next(err);
    });
 };
};

// this is through async await

// const asyncHandler = (fn) => async(req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (error) {
//             req.status(err.code || 500).json({
//                 sucess: false,
//                 message: err.message});
//         }
//     };
    
    export default asyncHandler;