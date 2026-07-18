const DB = {
  get(key) {
    const value = localStorage.getItem(key);
    if (!value) {
      return [];
    }
    try {
      return JSON.parse(value);
    }
    catch {
      return [];
    }
  },
  save(key, value) {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};
const Auth = {
  id(type) {
    return type + "_" + Date.now();
  },
  users() {
    return DB.get("wb_users");
  },
  saveUsers(users) {
    DB.save("wb_users", users);
  },
  current() {
    let id = localStorage.getItem("wb_session");
    if (!id) {
      return null;
    }
    return this.users()
      .find(user => user.id === id);
  },
  register(data) {
    let users = this.users();
    let exists = users.find(
      user =>
        user.email.toLowerCase()
        === data.email.toLowerCase()
    );
    if (exists) {
      return {
        success: false,
        message: "Email already registered"
      };
    }
    let user = {
      id: this.id("user"),
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
      phone: data.phone || "",
      location: data.location || "",
      joined: new Date()
        .toISOString()
    };
    if (data.role === "worker") {
      user.category =
        data.category || "General";
      user.rate =
        Number(data.rate) || 200;
      user.bio =
        data.bio || "";
      user.skills =
        data.skills || [];
      user.jobsDone = 0;
      user.verified = false;
    }
    users.push(user);
    this.saveUsers(users);
    localStorage.setItem(
      "wb_session",
      user.id
    );
    return {
      success: true,
      user
    };
  },
  login(email, password) {
    let user = this.users()
      .find(
        u =>
          u.email === email &&
          u.password === password
      );
    if (!user) {
      return {
        success: false,
        message: "Wrong login details"
      };
    }
    localStorage.setItem(
      "wb_session",
      user.id
    );
    return {
      success: true,
      user
    };
  },
  logout() {
    DB.remove("wb_session");
    window.location.href = "login.html";
  },
  redirectIfLoggedIn() {
    let user = this.current();
    if (user) {
      const dest =
        user.role === "worker"
          ? "worker-dashboard.html"
          : "customer-dashboard.html";
      window.location.href = dest;
      return true;
    }
    return false;
  },
  check() {
    let user = this.current();
    if (!user) {
      location.href = "login.html";
      return null;
    }
    return user;
  }
};
const Workers = {
  all() {
    return DB.get("wb_users")
      .filter(
        user =>
          user.role === "worker"
      );
  },
  search(category) {
    return this.all()
      .filter(
        worker =>
          worker.category
            .toLowerCase()
            .includes(
              category.toLowerCase()
            )
      );
  },
  rating(id) {
    let reviews =
      DB.get("wb_reviews")
        .filter(
          r =>
            r.workerId === id
        );
    if (reviews.length === 0) {
      return "New";
    }
    let total =
      reviews.reduce(
        (sum, r) =>
          sum + r.rating,
        0
      );
    return (
      total / reviews.length
    ).toFixed(1);
  }
};
const Booking = {
  create(data) {
    let bookings =
      DB.get("wb_bookings");
    let job = {
      id: "job_" + Date.now(),
      customer: data.customer,
      worker: data.worker,
      service: data.service,
      date: data.date,
      status: "pending"
    };
    bookings.push(job);
    DB.save(
      "wb_bookings",
      bookings
    );
    return job;
  },
  getUserJobs(id) {
    return DB.get("wb_bookings")
      .filter(
        job =>
          job.customer === id ||
          job.worker === id
      );
  }
};
function createDemo() {
  if (localStorage.getItem("wb_ready")) {
    return;
  }
  let users = [
    {
      id: "user_1",
      name: "Ramesh",
      email: "ramesh@test.com",
      password: "1234",
      role: "worker",
      category: "Carpenter",
      rate: 300,
      location: "Kathmandu",
      skills: [
        "Furniture",
        "Repair"
      ],
      jobsDone: 30
    },
    {
      id: "user_2",
      name: "Sita",
      email: "sita@test.com",
      password: "1234",
      role: "customer",
      location: "Lalitpur"
    }
  ];
  DB.save(
    "wb_users",
    users
  );
  localStorage.setItem(
    "wb_ready",
    "yes"
  );
}
document.addEventListener(
  "DOMContentLoaded",
  () => {
    createDemo();
    let user =
      Auth.current();
    console.log(
      "WorkBandhu started",
      user
    );
  });