import { Client } from "./../../node_modules/@gradio/client/dist/index.js";

async function generate() {
    const keyTypeSelect = document.getElementById('valkeytype');
    const domainInput = document.getElementById('valdomain');
    const emailInput = document.getElementById('valemail')
    const keySize = document.getElementById('valkeysize')
    const keyCurve = document.getElementById('valkeycurve')
    try {
        const client = await Client.connect("raannakasturi/generate");
        const result = await client.predict("/privcsr", {
            domains_input: domainInput,
            email: emailInput,
            key_type: keyTypeSelect,
            key_size: keySize,
            key_curve: keyCurve,
        });
        console.log(result.data);
    } catch (error) {
        console.error("Error during prediction:", error);
    }
}
document.getElementById('generatepvtcsr').addEventListener('click', generate);
