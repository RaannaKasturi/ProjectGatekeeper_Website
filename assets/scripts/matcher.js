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
    const result = await get_data(csrpvt, ssl)
    console.log(result.data[0]);
    console.log(typeof(result.data[0]));
    if (result.data[0] === 'CSR match SSL' || result.data[0] === 'Private Key match SSL') {
        document.getElementById('matchstatus').classList.add('border-success')
    } else {
        document.getElementById('matchstatus').classList.add('border-danger')
    }
    document.getElementById('matchstatus').textContent = result.data;
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