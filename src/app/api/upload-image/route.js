import { NextResponse } from "next/server";
import crypto from "crypto";
import config from "../../../../config.mjs";
import fs from "fs"
import mime from "mime-types";

export async function POST(req, res) {
    const formdata = await req.formData();
    let image = await formdata.get("image");
    const extension = mime.extension(image.type);

    image = await image.arrayBuffer();

    const fileName =  Date.now() + "_wisn_img." +extension;

    const writtenPromise = await new Promise( (resolve, reject)=> {
        fs.writeFile("./public/"+fileName, Buffer.from((image)), (err)=>{
            if(err) {
                return resolve("error");
            }
            return resolve("done");
        })
        
    });

    if( writtenPromise == "error") {
        return NextResponse.json({status:0, filename: ""})
    }

    return NextResponse.json({status: 1, filename: fileName});
}