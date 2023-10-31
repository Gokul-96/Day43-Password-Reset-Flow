// helpers.js

import { client } from "./index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";

async function genPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

async function createUser(username, hashedPassword) {
    return await client.db("FSD").collection("users").insertOne({ username: username, password: hashedPassword });
}

async function getUserByName(username) {
    return await client.db("FSD").collection("users").findOne({ username: username });
}

function genRandomString() {
    const randomString = randomstring.generate(20);
    return randomString;
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.secret_key);
}

async function storeRandom(randomString, userFromDB, randomStringExpiresAt) {
    return await client.db("FSD").collection("users").updateOne({ _id: userFromDB._id }, { $set: { randomString: randomString, randomStringExpiresAt: randomStringExpiresAt } });
}

async function getUserByRandomString(randomString) {
    return await client.db("FSD").collection("users").findOne({ randomString: randomString });
}

async function updateNewPassword(randomstring, hashedPassword) {
    return await client.db("FSD").collection("users").updateOne({ _id: randomstring._id }, { $set: { password: hashedPassword, randomString: null, randomStringExpiresAt: null } });
}

export { genPassword, createUser, getUserByName, genRandomString, generateToken, storeRandom, getUserByRandomString, updateNewPassword };