import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

// file to txt box
document
  .getElementById("fileupload")
  .addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get the first file
    if (file) {
      const reader = new FileReader(); // Create a FileReader object
      reader.onload = function (e) {
        const content = e.target.result; // Get the file content
        document.getElementById("sslcsrpvt").value = content; // Set content in the textarea
      };
      reader.onerror = function () {
        console.error("Error reading file:", reader.error); // Log error if reading fails
      };
      reader.readAsText(file); // Read the file as text
    } else {
      alert("No file selected"); // Alert if no file is selected
    }
  });

// gets data
async function get_data(sslcsrpvt) {
  const client = await Client.connect("raannakasturi/decode_ssl");
  try {
    const result = await client.predict("/decode", { cert: sslcsrpvt });
    const data = result.data;
    const parsedData = JSON.parse(data[0]);
    return parsedData;
  } catch (error) {
    console.error("Error during prediction:", error);
    return { data: "Error occurred" };
  }
}

// shows data
async function decoder(event) {
  event.preventDefault(); // Prevent default form submission
  hidetables();

  // assigning variables
  const sslcsrpvt = document.getElementById("sslcsrpvt");
  const decode = document.getElementById("decode");
  const matchstatus = document.getElementById("matchstatus");
  const common_name = document.getElementById("common_name");
  const sans = document.getElementById("sans");
  const not_valid_before = document.getElementById("not_valid_before");
  const not_valid_after = document.getElementById("not_valid_after");
  const expiry = document.getElementById("expiry");
  const key_type = document.getElementById("key_type");
  const key_size = document.getElementById("key_size");
  const signature_algorithm = document.getElementById("signature_algorithm");
  const serial_number = document.getElementById("serial_number");
  const issuer = document.getElementById("issuer");
  const organization = document.getElementById("organization");
  const country = document.getElementById("country");
  const authorityKeyIdentifier = document.getElementById(
    "authorityKeyIdentifier"
  );
  const subjectKeyIdentifier = document.getElementById("subjectKeyIdentifier");
  const key_usage = document.getElementById("key_usage");
  const extended_key_usage = document.getElementById("extended_key_usage");
  const crl_distribution_points = document.getElementById(
    "crl_distribution_points"
  );
  const ocsp_url = document.getElementById("ocsp_url");
  const ca_issuer_url = document.getElementById("ca_issuer_url");
  const subject_alt_name = document.getElementById("subject_alt_name");
  const openssl_asn1parse_data = document.getElementById(
    "openssl_asn1parse_data"
  );
  const raw_openssl_data = document.getElementById("raw_openssl_data");

  const general_info = document.getElementById("general_info");
  const issuer_info = document.getElementById("issuer_info");
  const x509_extenstions_info = document.getElementById(
    "x509_extenstions_info"
  );
  const rawssl = document.getElementById("rawssl");
  const asn1parsed = document.getElementById("asn1parsed");

  // tables vars
  const tables = [
    general_info,
    issuer_info,
    x509_extenstions_info,
    rawssl,
    asn1parsed,
  ];

  // post submission actions
  decode.innerHTML =
    '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Decoding...';
  decode.classList.add("disabled", "placeholder", "placeholder-wave");
  matchstatus.classList.add("placeholder", "placeholder-wave");
  matchstatus.classList.remove("border-success", "border-danger");

  // get data
  let result;
  try {
    result = await get_data(sslcsrpvt.value);
    console.log("Result from get_data:", result);
  } catch (error) {
    console.error("Error in get_data:", error);
  }

  if (result.status === "Success") {
    // show data
    matchstatus.value = `${result.status}: ${result.message}`;
    // show table only is status is success
    tables.forEach((element) => {
      if (element) {
        element.classList.remove("d-none", "d-flex");
      }
    });
    // general info
    const geninfo = result.data.general_info;
    common_name.textContent = geninfo.common_name;
    const sanslist = geninfo.sans;
    const saneles = sanslist.join(", ");
    sans.textContent = saneles;
    not_valid_before.textContent = geninfo.not_valid_before;
    not_valid_after.textContent = geninfo.not_valid_after;
    expiry.textContent = geninfo.expiry;
    key_type.textContent = geninfo.key_data.type;
    key_size.textContent = geninfo.key_data.size;
    signature_algorithm.textContent = geninfo.signature_algorithm;
    serial_number.textContent = geninfo.serial_number;

    // issuer info
    const issuerinfo = result.data.issuer_info;
    issuer.textContent = issuerinfo.issuer;
    organization.textContent = issuerinfo.organization;
    country.textContent = issuerinfo.country;

    // x509 extensions info
    const x509extenstionsinfo = result.data.extensions_data;
    authorityKeyIdentifier.textContent =
      x509extenstionsinfo.authorityKeyIdentifier;
    subjectKeyIdentifier.textContent = x509extenstionsinfo.subjectKeyIdentifier;
    key_usage.textContent = x509extenstionsinfo.key_usage;
    extended_key_usage.textContent = x509extenstionsinfo.extended_key_usage;
    crl_distribution_points.textContent =
      x509extenstionsinfo.crl_distribution_points;
    ocsp_url.textContent = x509extenstionsinfo.authority_info.ocsp_url;
    ca_issuer_url.textContent =
      x509extenstionsinfo.authority_info.ca_issuer_url;
    const subject_alt_name_list = x509extenstionsinfo.subject_alt_name;
    const subject_alt_names = subject_alt_name_list.join(", ");
    subject_alt_name.textContent = subject_alt_names;

    // raw ssl
    raw_openssl_data.value = result.data.raw_openssl_data.raw_openssl_data;
    openssl_asn1parse_data.value =
      result.data.raw_openssl_data.openssl_asn1parse_data;
  } else {
    matchstatus.value = `${result.status}: ${result.message}`;
  }

  // post-show data actions
  decode.innerHTML = "Decode & Match";
  decode.classList.remove("disabled", "placeholder", "placeholder-wave");
  matchstatus.classList.remove("placeholder", "placeholder-wave");
}

async function hidetables() {
  const tables = [
    general_info,
    issuer_info,
    x509_extenstions_info,
    rawssl,
    asn1parsed,
  ];
  tables.forEach((element) => {
    if (element) {
      element.classList.add("d-none", "d-flex");
    }
  });
}

// Add event listener with proper debug
document.getElementById("decodessl").addEventListener("submit", decoder);
document.getElementById("decodessl").addEventListener("reset", hidetables);
