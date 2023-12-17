const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const captchaResponse = grecaptcha.getResoponse();

    if (!captchaResponse.length > 0){
        throw new Error("Captcha not complete");
    }

});