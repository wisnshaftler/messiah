import { NextResponse } from "next/server";
import crypto from "crypto";
import config from "../../../../config.mjs";
import fs from "fs"
import mime from "mime-types";
import { cookies } from "next/headers"

export async function POST(req, res) {
    const cookieStorage = cookies();
    const tokenCookie = cookieStorage.get("token");

    if (!tokenCookie) {
        return NextResponse.json({ status: 0, filename: "" });
    }

    const date = new Date().getUTCFullYear() + "-" + new Date().getUTCMonth() + "-" + new Date().getUTCDate();
    const correctToken = crypto.createHash("sha256", config.ADMIN_USERNAME + config.ADMIN_PASSWORD + config.ADMIN_SECRET + date).digest("hex");

    if (correctToken != tokenCookie.value) {
        return NextResponse.json({ status: 0, filename: "", correctToken });
    }

    const formdata = await req.formData();

    let image = await formdata.get("file");

    let fileExtension = await formdata.get("extension");

    fileExtension = fileExtension.trim();

    if (!image) {
        return NextResponse.json({ status: 0, filename: "" })
    }
    const extension = mime.extension(image.type);

    try {
        image = await image.arrayBuffer();
    } catch (e) {
        return NextResponse.json({ status: 0, filename: "" });
    }

    let fileName = Date.now() + "_wisn_.";
    if (fileExtension != "") {
        fileName = fileName + fileExtension;
    } else {
        fileName = fileName + extension;
    }

    const writtenPromise = await new Promise((resolve, reject) => {
        fs.writeFile("./public/" + fileName, Buffer.from((image)), (err) => {
            if (err) {
                return resolve("error");
            }
            return resolve("done");
        })

    });

    if (writtenPromise == "error") {
        return NextResponse.json({ status: 0, filename: "" })
    }

    return NextResponse.json({ status: 1, filename: process.env.HOST + "/"+ fileName });
}