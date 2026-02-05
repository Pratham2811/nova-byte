import { sendOtp } from "../../utils/sendOtp.js";

export async function sendOtpService(email){
    console.log(email);
    const result=await sendOtp(email);
    console.log(result);
    
    return result;
    

}