import bcrypt from "bcryptjs";

let password = "varinhaMagica123";

async function encripta() {
    let passwordHash = await bcrypt.hash(password, 12);
    console.log(passwordHash);
    console.log( await bcrypt.compare(password, passwordHash));
}

encripta();