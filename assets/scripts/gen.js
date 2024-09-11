const keyTypeSelect = document.getElementById('valkeytype');
const domainInput = document.getElementById('valdomain');
const emailInput = document.getElementById('valemail')
const keySize = document.getElementById('valkeysize')
const keyCurve = document.getElementById('valkeycurve')

import { Client } from "http://cdn.jsdelivr.net/npm/@gradio/client@latest/dist/index.js"; // Example link, verify if it works

async function generate() {
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
// if clicked on button with id='generatepvtcsr' execute function generate()
// document.getElementById('generatepvtcsr').addEventListener('click', generate);