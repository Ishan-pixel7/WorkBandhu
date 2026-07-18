const Validate = {
  required(value, name) {
    if (!value || value.trim() === "") {
      return `${name} is required`;
    }
    return "";
  },
  email(value) {
    let check =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!check.test(value)) {
      return "Invalid email";
    }
    return "";
  },
  phone(value) {
    if (!value) {
      return "";
    }
    let phone =
      value.replace(/\D/g, "");
    if (phone.length !== 10) {
      return "Phone must be 10 digits";
    }
    return "";
  },
  length(value, size, name) {
    if (value.trim().length < size) {
      return `${name} is too short`;
    }
    return "";
  },
  number(value, min, name) {
    let num =
      Number(value);
    if (!num) {
      return `${name} required`;
    }
    if (num < min) {
      return `${name} must be above ${min}`;
    }
    return "";
  },
  same(a, b, name) {
    if (a !== b) {
      return `${name} doesn't match`;
    }
    return "";
  },
  show(field, msg) {
    let box = document.getElementById("field-" + field);
    let error = document.getElementById("err-" + field);
    if (box) box.classList.add("is-invalid");
    if (error) error.innerText = msg;
  },
  clear(field) {
    let box = document.getElementById("field-" + field);
    let error = document.getElementById("err-" + field);
    if (box) box.classList.remove("is-invalid");
    if (error) error.innerText = "";
  },
  check(field, result) {
    if (result) {
      this.show(field, result);
      return false;
    }
    this.clear(field);
    return true;
  },
  login(email, password) {
    let valid = true;
    valid =
      this.check(
        "email",
        this.required(email, "Email")
        ||
        this.email(email)
      )
      && valid;
    valid =
      this.check(
        "password",
        this.required(password, "Password")
      )
      && valid;
    return valid;
  },
  register(data) {
    let valid = true;
    valid = this.check(
      "name",
      this.required(data.name, "Name") || this.min(data.name, 2, "Name")
    ) && valid;
    valid =
      this.check(
        "email",
        this.required(data.email, "Email")
        ||
        this.email(data.email)
      )
      && valid;
    valid =
      this.check(
        "phone",
        this.phone(data.phone)
      )
      && valid;
    valid = this.check(
      "password",
      this.required(data.password, "Password") || this.min(data.password, 6, "Password")
    ) && valid;
    valid = this.check(
      "confirmPassword",
      this.match(data.password, data.confirmPassword, "Passwords")
    ) && valid;
    if (data.role === "worker") {
      valid =
        this.check(
          "category",
          this.required(
            data.category,
            "Trade"
          )
        )
        && valid;
      valid =
        this.check(
          "hourlyRate",
          this.number(
            data.hourlyRate,
            50,
            "Hourly rate"
          )
        )
        && valid;
    }
    return valid;
  },
  // aliases for different template conventions
  min(value, size, name) {
    return this.length(value, size, name);
  },
  match(a, b, name) {
    return this.same(a, b, name);
  },
  listen(field, rule) {
    const input =
      document.getElementById(field);
    if (!input) return;
    input.addEventListener(
      "blur",
      () => {
        this.check(
          field,
          rule(input.value)
        );
      }
    );
    input.addEventListener(
      "input",
      () => {
        const box =
          document.getElementById(
            "field-" + field
          );
        if (
          box &&
          box.classList.contains(
            "is-invalid"
          )
        ) {
          this.clear(field);
        }
      }
    );
  },
  // aliases used by the HTML templates
  liveField(field, rule) {
    return this.listen(field, rule);
  },
  loginForm(email, password) {
    return this.login(email, password);
  },
  registerForm(data) {
    return this.register(data);
  },
  minLength(value, size, name) {
    return this.length(value, size, name);
  },
  matches(a, b, name) {
    return this.same(a, b, name);
  },
  renderPasswordStrength(value) {
    const bar = document.getElementById("pw-strength-bar");
    if (!bar) return;
    let score = 0;
    if (value.length >= 6) score++;
    if (value.length >= 10) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    const pct = Math.min(score * 20, 100);
    bar.style.width = pct + "%";
    if (pct <= 40) bar.style.background = "#b24435";
    else if (pct <= 60) bar.style.background = "#e76e2f";
    else bar.style.background = "#2e6b3e";
  }
};