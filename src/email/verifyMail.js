import nodemailer from "nodemailer";
import dotenv from "dotenv/config";

export const verifyEmail = async(token,email)=>{
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL,
            pass : process.env.PASS
        }
    })

    const mailConfigurations = {
        from : process.env.EMAIL,
        to : email,
        subject : "Email Verification for Todo",
        text : `VerifyEmail/${token}`
    }

    transporter.sendMail(mailConfigurations,function(err,info){
        if(err){
            console.log("Error sending mail : ",err);
            throw new Error(err)
        }
        console.log("Mail sent successfully");
        console.log(info)
    })
}