async function validateLicense(licenseKey) {
    const btn = document.getElementById('validateLicenseBtn');
    const errorDiv = document.getElementById('licenseError');
    const successDiv = document.getElementById('licenseSuccess');
    const input = document.getElementById('licenseKeyInput');
    
    btn.textContent = 'Validating...';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    try {
        // Call Gumroad API directly (no proxy)
        const response = await fetch('https://api.gumroad.com/v2/licenses/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                product_id: PRODUCT_ID,
                license_key: licenseKey.trim(),
            }),
        });
        
        const data = await response.json();
        
        if (data.success && data.purchase) {
            // Valid license!
            localStorage.setItem(LICENSE_STORAGE_KEY, JSON.stringify({
                key: licenseKey.trim(),
                validated: new Date().toISOString(),
                purchase: data.purchase
            }));
            
            successDiv.querySelector('p').textContent = '✓ License activated successfully!';
            successDiv.style.display = 'block';
            
            setTimeout(() => {
                const modal = document.getElementById('licenseModal');
                if (modal) modal.remove();
            }, 1500);
        } else {
            // Invalid license
            errorDiv.querySelector('p').textContent = '✗ Invalid license key. Please check your email and try again.';
            errorDiv.style.display = 'block';
            btn.textContent = 'Activate Calculator';
            btn.disabled = false;
            btn.style.opacity = '1';
            input.value = '';
            input.focus();
        }
    } catch (error) {
        errorDiv.querySelector('p').textContent = '✗ Connection error. Please check your internet connection and try again.';
        errorDiv.style.display = 'block';
        btn.textContent = 'Activate Calculator';
        btn.disabled = false;
        btn.style.opacity = '1';
    }
}
