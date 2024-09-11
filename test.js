import { Client } from "@gradio/Client";
async function generate() {
    const client = await Client.connect("raannakasturi/generate");
    const result = await client.predict("/privcsr", {
        domains_input: 'domain.com', //domainInput.value,
        email: 'admin@domain.com', //emailInput.value,
        key_type: 'rsa', //keyTypeSelect.value,
        key_size: '4096', //keySize.value,
        key_curve: 'SECP256R1',//keyCurve.value,
    });
    console.log(result.data);
}
generate()
