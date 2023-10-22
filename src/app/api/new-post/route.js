import { NextResponse } from "next/server";
import crypto from "crypto";
import config from "../../../../config.mjs";
import fs from "fs"
import path from "path";
import mime from "mime-types";
import { cookies } from "next/headers"

export async function POST(req, res) {
    const cookieStorage = cookies();
    const tokenCookie = cookieStorage.get("token");

    if (!tokenCookie) {
        return NextResponse.json({ status: 0, postStatus: 0 });
    }

    const date = new Date().getUTCFullYear() + "-" + new Date().getUTCMonth() + "-" + new Date().getUTCDate();
    const correctToken = crypto.createHash("sha256", config.ADMIN_USERNAME + config.ADMIN_PASSWORD + config.ADMIN_SECRET + date).digest("hex");

    if (correctToken != tokenCookie.value) {
        return NextResponse.json({ status: 0, postStatus: 0 });
    }

    let jsonRequest = null;
    let title = null;
    let body  = null;
    try {
        jsonRequest = await req.json();
        title =  jsonRequest.title;
        body = jsonRequest.newPostData;        ;
    } catch (e) {
        return NextResponse.json({status: 0, postStatus: 0 });
    }

    //delete existing files
    const waitingForDeleting = await new Promise((resolve, reject) => {
        fs.unlink("./src/row/posts/" + title+ ".txt", (err)=>{
            resolve("done");
        })
    });

    //save file in the row posts
    const writtenPromise = await new Promise((resolve, reject) => {
        fs.writeFile("./src/row/posts/" + title +".txt", body , (err) => {
            if (err) {
                console.log(err);
                return resolve("error");
            }
            return resolve("done");
        })
    });


    return NextResponse.json({ status: 0, postStatus: 0});
}