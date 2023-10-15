import { NextResponse } from "next/server";
import crypto from "crypto";
import config from "../../../../config.mjs";

export async function POST(req, res) {
    const jsonRequest =  await req.json();

    if(jsonRequest.username != config.ADMIN_USERNAME || jsonRequest.password != config.ADMIN_PASSWORD) {
        return NextResponse.json({ status:0, token: null });
    }

    const date = new Date().getUTCFullYear() + "-" + new Date().getUTCMonth() + "-" + new Date().getUTCDate();
    const token = crypto.createHash("sha256", jsonRequest.username + jsonRequest.password + config.ADMIN_SECRET + date).digest("hex");

    return NextResponse.json({status: 0, token: token});
}