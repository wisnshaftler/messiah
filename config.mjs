import *  as dotenv from "dotenv";
dotenv.config();

export function config() {
    admin_username = process.env.ADMIN_USERNAME,
    admin_password = process.env.ADMIN_PASSWORD
}