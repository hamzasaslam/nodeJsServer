"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const findData = (obj, targetValue) => {
    for (const key in obj) {
        if (obj[key] === targetValue) {
            return obj;
        }
        else if (typeof obj[key] === "object") {
            const nestVal = findData(obj[key], targetValue);
            if (nestVal !== undefined) {
                return nestVal;
            }
        }
        else if (Array.isArray(obj[key])) {
            for (let value of obj[key]) {
                if (value === targetValue) {
                    return obj[key];
                }
                else if (typeof value === "object") {
                    for (let nestedKey in value) {
                        if (value[nestedKey] === targetValue) {
                            return value;
                        }
                        else if (typeof value[nestedKey] === "object") {
                            const nestedVal = findData(value[nestedKey], targetValue);
                            if (nestedVal !== undefined) {
                                return nestedVal;
                            }
                        }
                        else if (Array.isArray(value[nestedKey])) {
                            for (let arrayValue of value[nestedKey]) {
                                if (arrayValue === targetValue) {
                                    return value[nestedKey];
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return undefined;
};
const searchData = async () => {
    const response = await axios_1.default.get("https://serpapi.com/search?engine=google_maps", {
        params: {
            q: "coffee",
            api_key: "6767f3b8aa507a5819bdb55c995a451e2e3d4f4a0fc258c187b6aa2ba68577d9",
            engine: "google",
        },
    });
    return response.data;
};
app.post("/", async (req, res) => {
    try {
        const response = await searchData();
        console.log(response, 'asdlkfaskjdfsalkdfjasdklf');
        const givenString = req.body;
        const searchObject = findData(response, givenString);
        if (!searchObject) {
            console.log("Value not found");
        }
        else {
            console.log(searchObject);
        }
        return res.status(200).json(searchObject);
    }
    catch (error) {
        const err = error;
        return res.status(500).json({ error: err.message });
    }
});
app.listen(6000, () => {
    console.log("Server is running on port 6000");
});
