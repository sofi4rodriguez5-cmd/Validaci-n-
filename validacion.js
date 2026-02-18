let form = document.getElementById('form');
let usuario = document.getElementById("usuario");
let mensaje = document.getElementById("mensaje");
let email = document.getElementById("email");
let emailMsg = document.getElementById("emailMsg");
let password = document.getElementById("password");
let pwdMensaje = document.getElementById("pwdMensaje");
let pwdCounter = document.getElementById("pwdCounter");
let pwdStrength = document.getElementById("pwdStrength");
let togglePwd = document.getElementById("togglePwd");
let generalFeedback = document.getElementById("generalFeedback");
let attemptsInfo = document.getElementById("attemptsInfo");
let submitBtn = document.getElementById("submitBtn");

let failedAttempts = 0;
let lockTimer = null;
const LOCK_TIME_MS = 30000; // 30 segundos


usuario && usuario.addEventListener("input", function () {
    const orig = this.value;
    const sanitized = orig.replace(/[^a-zA-Z0-9._-]/g, '');

    this.value = sanitized;
    if (orig !== sanitized) {
        this.style.border = "2px solid red";
        mensaje.textContent = "Está intentando escribir algo inválido";
        mensaje.style.color = "red";
    } else if (sanitized.length < 3) {
        this.style.border = "2px solid red";
        mensaje.textContent = "Usuario debe tener mínimo 3 caracteres";
        mensaje.style.color = "red";
    } else {
        this.style.border = "2px solid green";
        mensaje.textContent = "Usuario válido";
        mensaje.style.color = "green";
    }
});


email && email.addEventListener("input", function () {
    const val = this.value.trim();
    
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (val === "") {
        this.style.border = "2px solid red";
        emailMsg.textContent = "Email obligatorio";
        emailMsg.style.color = "red";
    } else if (!re.test(val)) {
        this.style.border = "2px solid red";
        emailMsg.textContent = "Email inválido";
        emailMsg.style.color = "red";
    } else {
        this.style.border = "2px solid green";
        emailMsg.textContent = "Email válido";
        emailMsg.style.color = "green";
    }
});


password && password.addEventListener("input", function () {
    const val = this.value;
    pwdCounter.textContent = `${val.length} / 10`;
    
    const hasLower = /[a-z]/.test(val);
    const hasUpper = /[A-Z]/.test(val);
    const hasDigit = /[0-9]/.test(val);
    const hasSpecial = /[^A-Za-z0-9]/.test(val);
    const lengthOk = val.length >= 10;

    let score = 0;
    if (lengthOk) score++;
    if (hasLower && hasUpper) score++;
    if (hasDigit) score++;
    if (hasSpecial) score++;
    let strength = "Débil";
    let color = "red";
    if (score >= 3) { strength = "Media"; color = "orange"; }
    if (score >= 4) { strength = "Fuerte"; color = "green"; }

    pwdStrength.textContent = `Fuerza: ${strength}`;
    pwdStrength.style.color = color;

    if (lengthOk && hasDigit && hasSpecial) {
        this.style.border = "2px solid green";
        pwdMensaje.textContent = "Contraseña válida";
        pwdMensaje.style.color = "green";
    } else {
        this.style.border = "2px solid red";
        pwdMensaje.textContent = "La contraseña debe tener al menos 10 caracteres, incluir número y carácter especial";
        pwdMensaje.style.color = "red";
    }
});

togglePwd && togglePwd.addEventListener("click", function () {
    if (!password) return;
    if (password.type === "password") {
        password.type = "text";
        this.textContent = "Ocultar";
    } else {
        password.type = "password";
        this.textContent = "Mostrar";
    }
});

function setFormLocked(locked) {
    if (!form) return;
    Array.from(form.elements).forEach(el => el.disabled = locked);
    if (locked) {
        attemptsInfo.textContent = "Formulario bloqueado por 30 segundos tras 3 intentos fallidos.";
        attemptsInfo.style.color = "red";
        
    } else {
        attemptsInfo.textContent = "";
    }
}


function onSuccessfulSubmit() {
    generalFeedback.textContent = "Formulario enviado correctamente";
    generalFeedback.style.color = "green";
    
    form.reset();
    [mensaje, emailMsg, pwdMensaje, pwdCounter, pwdStrength].forEach(el => { if (el) el.textContent = ""; });
    [usuario, email, password].forEach(el => { if (el) el.style.border = ""; });
    failedAttempts = 0;
}

form && form.addEventListener('submit', function (e) {
    e.preventDefault();

    
    if (attemptsInfo && attemptsInfo.textContent) {
        return;
    }

    const userVal = usuario ? usuario.value.trim() : "";
    const emailVal = email ? email.value.trim() : "";
    const pwdVal = password ? password.value : "";

    const userOk = /^[a-zA-Z0-9._-]{3,}$/.test(userVal);
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    const pwdOk = pwdVal.length >= 10 && /[0-9]/.test(pwdVal) && /[^A-Za-z0-9]/.test(pwdVal);

    if (userOk && emailOk && pwdOk) {
        onSuccessfulSubmit();
    } else {
        failedAttempts++;
        generalFeedback.textContent = "Hay errores en el formulario. Corrija antes de enviar.";
        generalFeedback.style.color = "red";
        
        if (!userOk && usuario) usuario.focus();
        else if (!emailOk && email) email.focus();
        else if (!pwdOk && password) password.focus();

        attemptsInfo.textContent = `Intentos fallidos: ${failedAttempts} / 3`;
        attemptsInfo.style.color = "red";

        if (failedAttempts >= 3) {
           
            setFormLocked(true);
            lockTimer = setTimeout(() => {
                setFormLocked(false);
                failedAttempts = 0;
                attemptsInfo.textContent = "";
                generalFeedback.textContent = "";
                lockTimer = null;
            }, LOCK_TIME_MS);
        }
    }
});