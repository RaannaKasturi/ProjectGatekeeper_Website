// Key Type Select
const keyTypeSelect = document.getElementById('valkeytype');
const keySizeDiv = document.getElementById('keysize');
const keyCurveDiv = document.getElementById('keycurve');
keyTypeSelect.addEventListener('change', function () {
    const selectedKeyType = this.value;
    if (selectedKeyType === 'rsa') {
        keySizeDiv.classList.remove('visually-hidden');
        keyCurveDiv.classList.add('visually-hidden');
    } else if (selectedKeyType === 'ecc') {
        keySizeDiv.classList.add('visually-hidden');
        keyCurveDiv.classList.remove('visually-hidden');
    }
});