import axios from "axios";

/**
 * Send SMS using Fast2SMS DLT API
 * @param {string} mobileNumber
 * @param {string} variableValues  Example: "123456" or "123456|John"
 * @param {string} templateId      Example: "207453"
 */
export async function sendSms(mobileNumber, variableValues, templateId) {
    try {
        if (!mobileNumber) {
            throw new Error("Mobile number required");
        }

        const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;

        const payload = {
            route: "dlt",
            sender_id: "SFOC2C",
            message: templateId,            // DLT Template ID
            variables_values: variableValues || "",
            flash: 0,
            numbers: mobileNumber,
        };

        const response = await axios.post(
            "https://www.fast2sms.com/dev/bulkV2",
            payload,
            {
                headers: {
                    authorization: FAST2SMS_API_KEY,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );

        return {
            success: true,
            response: response.data,
        };

    } catch (error) {
        return {
            success: false,
            error: error?.response?.data || error.message,
        };
    }
}
