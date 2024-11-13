const bcrypt = require('bcrypt');

const hashpassword = async (password)=>{
    try{
    const saltround = 10;
    const hashedpassword = await bcrypt.hash(password,saltround)
    return hashedpassword}
    catch(error){
        console.log(error)
    }
}

const comparePassword =async  (password,hashedpassword)=>{
    return await bcrypt.compare(password,hashedpassword)
}

module.exports = {hashpassword,comparePassword}
