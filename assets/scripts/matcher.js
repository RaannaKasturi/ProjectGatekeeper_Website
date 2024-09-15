import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

async function get_data(newcsrpvt, newcert) {
    const client = await Client.connect("raannakasturi/match-pvtcsr-ssl");
    try {
        const result = await client.predict("/predict", { csrpvt: newcsrpvt, cert: newcert });
        return result;
    } catch (error) {
        console.error("Error during prediction:", error);
        return { data: "Error occurred" };
    }
}

async function matcher(event) {
    event.preventDefault(); // Prevent default form submission
    const csrpvt = document.getElementById('csrpvt').value;
    const ssl = document.getElementById('ssl').value;
    const decode = document.getElementById('decode');
    const matchstatus = document.getElementById('matchstatus');
    decode.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Decoding & Matching...';
    decode.classList.add('disabled');
    decode.classList.add('placeholder');
    decode.classList.add('placeholder-wave');
    matchstatus.value = 'Decoding & Matching...';
    matchstatus.classList.add('placeholder');
    matchstatus.classList.add('placeholder-wave');
    matchstatus.classList.remove('border-success');
    matchstatus.classList.remove('border-danger');
    const result = await get_data(csrpvt, ssl)
    console.log(result.data[0]);
    console.log(typeof(result.data[0]));
    if (result.data[0] === 'CSR match SSL' || result.data[0] === 'Private Key match SSL') {
        matchstatus.classList.add('border-success')
    } else {
        matchstatus.classList.add('border-danger')
    }
    matchstatus.value = result.data;
    decode.innerHTML = 'Decode & Match';
    decode.classList.remove('disabled');
    decode.classList.remove('placeholder');
    decode.classList.remove('placeholder-wave');
    matchstatus.classList.remove('placeholder');
    matchstatus.classList.remove('placeholder-wave');
}
document.getElementById('match').addEventListener('submit', matcher);

document.getElementById('csrpvtupload').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the first file
    if (file) {
        const reader = new FileReader(); // Create a FileReader object
        reader.onload = function(e) {
            const content = e.target.result; // Get the file content
            document.getElementById('csrpvt').value = content; // Set content in the textarea
        };
        reader.onerror = function() {
            console.error('Error reading file:', reader.error); // Log error if reading fails
        };
        reader.readAsText(file); // Read the file as text
    } else {
        alert('No file selected'); // Alert if no file is selected
    }
});

document.getElementById('sslupload').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Get the first file
    if (file) {
        const reader = new FileReader(); // Create a FileReader object
        reader.onload = function(e) {
            const content = e.target.result; // Get the file content
            document.getElementById('ssl').value = content; // Set content in the textarea
        };
        reader.onerror = function() {
            console.error('Error reading file:', reader.error); // Log error if reading fails
        };
        reader.readAsText(file); // Read the file as text
    } else {
        alert('No file selected'); // Alert if no file is selected
    }
});