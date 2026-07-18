/* ===== SVG Icon Library ===== */
const Icons = {
  dashboard: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="7" height="7" rx="1.5"/><rect x="11" y="2" width="7" height="7" rx="1.5"/><rect x="2" y="11" width="7" height="7" rx="1.5"/><rect x="11" y="11" width="7" height="7" rx="1.5"/></svg>',
  briefcase: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="16" height="11" rx="2"/><path d="M6 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>',
  wallet: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="16" height="13" rx="2"/><circle cx="14" cy="10.5" r="1.5"/><path d="M2 8h16"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="7" r="3.5"/><path d="M3 18c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>',
  logout: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 2H4a2 2 0 00-2 2v12a2 2 0 002 2h3"/><path d="M14 14l4-4-4-4"/><line x1="18" y1="10" x2="7" y2="10"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8.5" cy="8.5" r="5.5"/><line x1="13" y1="13" x2="18" y2="18"/></svg>',
  bell: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2a5 5 0 015 5c0 5 2 7 2 7H3s2-2 2-7a5 5 0 015-5z"/><path d="M8 16a2 2 0 004 0"/></svg>',
  star: '<svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor"><path d="M9 1.5l2.5 5 5.5.8-4 3.9.9 5.3L9 13.8l-4.9 2.7.9-5.3-4-3.9 5.5-.8z"/></svg>',
  clock: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><path d="M10 5v5l3 3"/></svg>',
  check: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 10l4 4 8-8"/></svg>',
  location: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 18s-7-5.5-7-10a7 7 0 0114 0c0 4.5-7 10-7 10z"/><circle cx="10" cy="8" r="2.5"/></svg>',
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  cancel: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="10" r="8"/><line x1="7" y1="7" x2="13" y2="13"/><line x1="13" y1="7" x2="7" y2="13"/></svg>',
  plus: '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="10" y1="4" x2="10" y2="16"/><line x1="4" y1="10" x2="16" y2="10"/></svg>',
  empty: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="6" y="8" width="28" height="24" rx="3"/><path d="M6 16h28"/><circle cx="20" cy="26" r="3"/></svg>',
};

/* ===== Dashboard Controller ===== */
const Dashboard = {
  user: null,

  start() {
    this.user = Auth.check();
    if (!this.user) return;

    this.renderSidebar();
    this.renderTopbar();

    if (this.user.role === "worker") {
      WorkerDashboard.show(this.user);
    } else {
      CustomerDashboard.show(this.user);
    }
  },

  renderSidebar() {
    const nav = document.getElementById("sidebar-nav");
    const footer = document.getElementById("sidebar-footer");
    if (!nav || !footer) return;

    const isWorker = this.user.role === "worker";

    const navItems = isWorker
      ? [
          { icon: Icons.dashboard, label: "Dashboard", active: true },
          { icon: Icons.briefcase, label: "My Jobs", active: false },
          { icon: Icons.wallet, label: "Earnings", active: false },
          { icon: Icons.user, label: "Profile", active: false },
        ]
      : [
          { icon: Icons.dashboard, label: "Dashboard", active: true },
          { icon: Icons.briefcase, label: "My Bookings", active: false },
          { icon: Icons.search, label: "Find Workers", active: false },
          { icon: Icons.user, label: "Profile", active: false },
        ];

    nav.innerHTML =
      '<div class="sidebar-section-label">Menu</div>' +
      navItems
        .map(
          (item) => `
        <a class="nav-item${item.active ? " active" : ""}" href="#">
          ${item.icon}
          <span>${item.label}</span>
        </a>`
        )
        .join("");

    footer.innerHTML = `
      <a class="nav-item" href="#" onclick="Auth.logout(); return false;">
        ${Icons.logout}
        <span>Log out</span>
      </a>`;
  },

  renderTopbar() {
    const topbar = document.getElementById("dash-topbar");
    if (!topbar) return;

    const initials = this.user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    topbar.innerHTML = `
      <button class="mobile-menu-btn" onclick="Dashboard.toggleSidebar()">
        ${Icons.menu}
      </button>
      <div class="topbar-search">
        ${Icons.search}
        <input type="text" placeholder="Search jobs, workers…" />
      </div>
      <div class="topbar-right">
        <div class="topbar-bell">
          ${Icons.bell}
          <span class="notif-dot"></span>
        </div>
        <div class="topbar-user">
          <div class="topbar-avatar">${initials}</div>
          <div>
            <div class="topbar-name">${this.user.name}</div>
            <div class="topbar-role">${this.user.role}</div>
          </div>
        </div>
      </div>`;
  },

  toggleSidebar() {
    const sidebar = document.getElementById("dash-sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    sidebar.classList.toggle("open");
    if (backdrop) backdrop.classList.toggle("show");
  },

  greeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  },

  todayStr() {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  },

  fmtDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  },

  money(n) {
    return "रु " + Number(n || 0).toLocaleString();
  },

  pillClass(status) {
    return "pill pill-" + status;
  },
};

/* ===== Worker Dashboard ===== */
const WorkerDashboard = {
  show(user) {
    const jobs = Booking.getUserJobs(user.id);
    const rating = Workers.rating(user.id);
    const pending = jobs.filter((j) => j.status === "pending").length;
    const accepted = jobs.filter((j) => j.status === "accepted").length;
    const completed = jobs.filter((j) => j.status === "completed").length;
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const root = document.getElementById("dash-root");
    if (!root) return;

    root.innerHTML = `
      <!-- Welcome Banner -->
      <div class="welcome-banner">
        <div class="welcome-text">
          <h1>${Dashboard.greeting()}, ${user.name}!</h1>
          <p>${Dashboard.todayStr()}</p>
        </div>
        <div class="welcome-stats">
          <div class="welcome-stat">
            <span class="stat-value">${user.jobsDone || 0}</span>
            <span class="stat-label">Jobs Done</span>
          </div>
          <div class="welcome-stat">
            <span class="stat-value">${Dashboard.money(user.rate)}</span>
            <span class="stat-label">Hourly Rate</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background:#e8f5e9;color:#2e6b3e">${Icons.briefcase}</div>
          <span class="stat-number">${jobs.length}</span>
          <span class="stat-title">Total Requests</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#fff3e0;color:#c75a26">${Icons.clock}</div>
          <span class="stat-number">${pending}</span>
          <span class="stat-title">Pending</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#e4eee6;color:#3e7c59">${Icons.check}</div>
          <span class="stat-number">${accepted + completed}</span>
          <span class="stat-title">Accepted</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#ede7f6;color:#5b5fc7">${Icons.star}</div>
          <span class="stat-number">${rating}</span>
          <span class="stat-title">Rating</span>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Left: Jobs List -->
        <div class="section-card">
          <div class="section-header">
            <h2>Job Requests</h2>
            <span class="badge">${jobs.length} total</span>
          </div>
          ${this.renderJobs(jobs)}
        </div>

        <!-- Right: Profile + Quick Stats -->
        <div>
          <div class="section-card" style="margin-bottom:20px">
            <div class="profile-summary">
              <div class="profile-avatar-lg">${initials}</div>
              <h3>${user.name}</h3>
              <div class="profile-role">${user.category || "Worker"}</div>
              <span class="verification-badge ${user.verified ? "verified" : "unverified"}">
                ${user.verified ? "✓ Verified" : "⏳ Unverified"}
              </span>
              ${
                user.skills && user.skills.length
                  ? `<div class="skill-tags">${user.skills.map((s) => `<span class="skill-tag">${s}</span>`).join("")}</div>`
                  : ""
              }
            </div>
            <div class="info-list">
              ${user.location ? `<div class="info-row"><span class="info-label">📍 Location</span><span class="info-value">${user.location}</span></div>` : ""}
              <div class="info-row"><span class="info-label">💰 Rate</span><span class="info-value">${Dashboard.money(user.rate)}/hr</span></div>
              <div class="info-row"><span class="info-label">📅 Joined</span><span class="info-value">${Dashboard.fmtDate(user.joined)}</span></div>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <h2>Performance</h2>
            </div>
            ${this.renderPerformance(user, jobs)}
          </div>
        </div>
      </div>`;
  },

  renderJobs(jobs) {
    if (!jobs.length) {
      return `
        <div class="empty-state">
          <div class="empty-icon">${Icons.empty}</div>
          <p>No job requests yet.<br>Your bookings will appear here.</p>
        </div>`;
    }

    const allUsers = Auth.users();
    return jobs
      .slice()
      .reverse()
      .map((job) => {
        const customer = allUsers.find((u) => u.id === job.customer);
        const customerName = customer ? customer.name : "Customer";
        return `
        <div class="job-item">
          <div class="job-info">
            <h4>${job.service || "Service Request"}</h4>
            <p>From ${customerName} · ${Dashboard.fmtDate(job.date)}</p>
          </div>
          <div class="job-actions">
            <span class="${Dashboard.pillClass(job.status)}">${job.status}</span>
            ${job.status === "pending" ? `<button class="btn-sm btn-accept" onclick="WorkerDashboard.accept('${job.id}')">Accept</button>` : ""}
            ${job.status === "accepted" ? `<button class="btn-sm btn-complete" onclick="WorkerDashboard.complete('${job.id}')">Complete</button>` : ""}
          </div>
        </div>`;
      })
      .join("");
  },

  renderPerformance(user, jobs) {
    const total = jobs.length || 1;
    const completed = jobs.filter((j) => j.status === "completed").length;
    const completionPct = Math.round((completed / total) * 100);
    const acceptedCount = jobs.filter(
      (j) => j.status === "accepted" || j.status === "completed"
    ).length;
    const acceptPct = Math.round((acceptedCount / total) * 100);

    return `
      <div class="info-row">
        <span class="info-label">Completion Rate</span>
        <span class="info-value">${completionPct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${completionPct}%;background:#2e6b3e"></div>
      </div>
      <div class="info-row" style="margin-top:14px">
        <span class="info-label">Acceptance Rate</span>
        <span class="info-value">${acceptPct}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width:${acceptPct}%;background:#e76e2f"></div>
      </div>
      <div class="info-row" style="margin-top:14px">
        <span class="info-label">Jobs Done (All Time)</span>
        <span class="info-value">${user.jobsDone || 0}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Category</span>
        <span class="info-value">${user.category || "General"}</span>
      </div>`;
  },

  accept(id) {
    const jobs = DB.get("wb_bookings");
    const job = jobs.find((x) => x.id === id);
    if (job) job.status = "accepted";
    DB.save("wb_bookings", jobs);
    this.show(Auth.current());
  },

  complete(id) {
    const jobs = DB.get("wb_bookings");
    const job = jobs.find((x) => x.id === id);
    if (job) job.status = "completed";
    DB.save("wb_bookings", jobs);
    // Increment worker's jobsDone
    const users = Auth.users();
    const user = users.find((u) => u.id === Auth.current().id);
    if (user) {
      user.jobsDone = (user.jobsDone || 0) + 1;
      Auth.saveUsers(users);
    }
    this.show(Auth.current());
  },
};

/* ===== Customer Dashboard ===== */
const CustomerDashboard = {
  show(user) {
    const bookings = Booking.getUserJobs(user.id);
    const pending = bookings.filter((j) => j.status === "pending").length;
    const completed = bookings.filter((j) => j.status === "completed").length;
    const cancelled = bookings.filter((j) => j.status === "cancelled").length;
    const workers = Workers.all();
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const root = document.getElementById("dash-root");
    if (!root) return;

    root.innerHTML = `
      <!-- Welcome Banner -->
      <div class="welcome-banner customer-banner">
        <div class="welcome-text">
          <h1>${Dashboard.greeting()}, ${user.name}!</h1>
          <p>${Dashboard.todayStr()}</p>
        </div>
        <div class="welcome-stats">
          <div class="welcome-stat">
            <span class="stat-value">${bookings.length}</span>
            <span class="stat-label">Bookings</span>
          </div>
          <div class="welcome-stat">
            <span class="stat-value">${workers.length}</span>
            <span class="stat-label">Workers Available</span>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon" style="background:#e8f5e9;color:#2e6b3e">${Icons.briefcase}</div>
          <span class="stat-number">${bookings.length}</span>
          <span class="stat-title">Total Bookings</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#fff3e0;color:#c75a26">${Icons.clock}</div>
          <span class="stat-number">${pending}</span>
          <span class="stat-title">Pending</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#e4eee6;color:#3e7c59">${Icons.check}</div>
          <span class="stat-number">${completed}</span>
          <span class="stat-title">Completed</span>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background:#fce8e6;color:#b24435">${Icons.cancel}</div>
          <span class="stat-number">${cancelled}</span>
          <span class="stat-title">Cancelled</span>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="content-grid">
        <!-- Left: Bookings List -->
        <div class="section-card">
          <div class="section-header">
            <h2>Your Bookings</h2>
            <span class="badge">${bookings.length} total</span>
          </div>
          ${this.renderBookings(bookings)}
        </div>

        <!-- Right: Workers + Actions -->
        <div>
          <div class="section-card" style="margin-bottom:20px">
            <div class="section-header">
              <h2>Top Workers</h2>
            </div>
            ${this.renderWorkers(workers)}
          </div>

          <div class="section-card" style="margin-bottom:20px">
            <div class="section-header">
              <h2>Quick Actions</h2>
            </div>
            <div class="quick-actions">
              <a class="action-btn" href="#" onclick="CustomerDashboard.openBookingModal(); return false;">
                <div class="action-icon" style="background:#e8f5e9;color:#2e6b3e">${Icons.plus}</div>
                <span>Book a Worker</span>
              </a>
              <a class="action-btn" href="#" onclick="return false;">
                <div class="action-icon" style="background:#ede7f6;color:#5b5fc7">${Icons.search}</div>
                <span>Browse All Workers</span>
              </a>
            </div>
          </div>

          <div class="section-card">
            <div class="section-header">
              <h2>Account Info</h2>
            </div>
            <div class="info-list">
              ${user.location ? `<div class="info-row"><span class="info-label">📍 Location</span><span class="info-value">${user.location}</span></div>` : ""}
              ${user.email ? `<div class="info-row"><span class="info-label">✉️ Email</span><span class="info-value">${user.email}</span></div>` : ""}
              <div class="info-row"><span class="info-label">📅 Joined</span><span class="info-value">${Dashboard.fmtDate(user.joined)}</span></div>
            </div>
          </div>
        </div>
      </div>`;
  },

  renderBookings(bookings) {
    if (!bookings.length) {
      return `
        <div class="empty-state">
          <div class="empty-icon">${Icons.empty}</div>
          <p>No bookings yet.<br>Book a worker to get started!</p>
        </div>`;
    }

    const allUsers = Auth.users();
    return bookings
      .slice()
      .reverse()
      .map((job) => {
        const worker = allUsers.find((u) => u.id === job.worker);
        const workerName = worker ? worker.name : "Worker";
        return `
        <div class="job-item">
          <div class="job-info">
            <h4>${job.service || "Service"}</h4>
            <p>${workerName} · ${Dashboard.fmtDate(job.date)}</p>
          </div>
          <div class="job-actions">
            <span class="${Dashboard.pillClass(job.status)}">${job.status}</span>
            ${job.status === "completed" ? `<button class="btn-sm btn-review" onclick="CustomerDashboard.openReview('${job.id}','${job.worker}')">Review</button>` : ""}
            ${job.status === "pending" ? `<button class="btn-sm btn-cancel" onclick="CustomerDashboard.cancel('${job.id}')">Cancel</button>` : ""}
          </div>
        </div>`;
      })
      .join("");
  },

  renderWorkers(workers) {
    if (!workers.length) {
      return '<div class="empty-state"><p>No workers available yet.</p></div>';
    }
    return workers
      .slice(0, 5)
      .map((w) => {
        const init = w.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();
        const rating = Workers.rating(w.id);
        return `
        <div class="worker-mini">
          <div class="worker-mini-avatar">${init}</div>
          <div class="worker-mini-info">
            <h4>${w.name}</h4>
            <p>${w.category} · ⭐ ${rating}</p>
          </div>
          <span class="worker-mini-rate">${Dashboard.money(w.rate)}/hr</span>
        </div>`;
      })
      .join("");
  },

  cancel(id) {
    const jobs = DB.get("wb_bookings");
    const job = jobs.find((x) => x.id === id);
    if (job) job.status = "cancelled";
    DB.save("wb_bookings", jobs);
    this.show(Auth.current());
  },

  openReview(jobId, workerId) {
    const overlay = document.getElementById("review-overlay");
    if (!overlay) return;
    overlay.classList.add("show");
    overlay.dataset.jobId = jobId;
    overlay.dataset.workerId = workerId;
    const worker = Auth.users().find((u) => u.id === workerId);
    const nameEl = document.getElementById("review-worker-name");
    if (nameEl && worker) nameEl.textContent = "Rate " + worker.name;
  },

  openBookingModal() {
    const overlay = document.getElementById("booking-overlay");
    if (!overlay) return;

    // Fill worker select
    const workerSelect = document.getElementById("bk-worker");
    if (workerSelect) {
      const workers = Workers.all();
      workerSelect.innerHTML = workers
        .map(
          (w) =>
            `<option value="${w.id}">${w.name} — ${w.category} (${Dashboard.money(w.rate)}/hr)</option>`
        )
        .join("");
    }

    // Default date to tomorrow
    const dateInput = document.getElementById("bk-date");
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dateInput.value = tomorrow.toISOString().split("T")[0];
    }

    overlay.classList.add("show");
  },
};

/* ===== Initialise on DOM ready ===== */
document.addEventListener("DOMContentLoaded", () => {
  Dashboard.start();

  // --- Review modal handlers ---
  const reviewClose = document.getElementById("review-close");
  const reviewOverlay = document.getElementById("review-overlay");
  const reviewForm = document.getElementById("review-form");

  if (reviewClose && reviewOverlay) {
    reviewClose.addEventListener("click", () =>
      reviewOverlay.classList.remove("show")
    );
  }

  if (reviewForm && reviewOverlay) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const workerId = reviewOverlay.dataset.workerId;
      const rating = Number(document.getElementById("rv-rating").value);
      const comment = (
        document.getElementById("rv-comment").value || ""
      ).trim();
      const user = Auth.current();

      const reviews = DB.get("wb_reviews");
      reviews.push({
        id: "rv_" + Date.now(),
        workerId,
        customerId: user.id,
        rating,
        comment,
        date: new Date().toISOString(),
      });
      DB.save("wb_reviews", reviews);

      const msg = document.getElementById("review-msg");
      if (msg) {
        msg.textContent = "Review submitted! Thank you.";
        msg.className = "form-msg success show";
      }

      setTimeout(() => {
        reviewOverlay.classList.remove("show");
        if (msg) {
          msg.className = "form-msg";
          msg.textContent = "";
        }
        reviewForm.reset();
        CustomerDashboard.show(Auth.current());
      }, 1000);
    });
  }

  // --- Booking modal handlers ---
  const bookingClose = document.getElementById("booking-close");
  const bookingOverlay = document.getElementById("booking-overlay");
  const bookingForm = document.getElementById("booking-form");

  if (bookingClose && bookingOverlay) {
    bookingClose.addEventListener("click", () =>
      bookingOverlay.classList.remove("show")
    );
  }

  if (bookingForm && bookingOverlay) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = Auth.current();
      const workerId = document.getElementById("bk-worker").value;
      const service = document.getElementById("bk-service").value.trim();
      const date = document.getElementById("bk-date").value;

      if (!service) {
        const msg = document.getElementById("booking-msg");
        if (msg) {
          msg.textContent = "Please describe the service you need.";
          msg.className = "form-msg error show";
        }
        return;
      }

      Booking.create({
        customer: user.id,
        worker: workerId,
        service,
        date,
      });

      const msg = document.getElementById("booking-msg");
      if (msg) {
        msg.textContent = "Booking created successfully!";
        msg.className = "form-msg success show";
      }

      setTimeout(() => {
        bookingOverlay.classList.remove("show");
        if (msg) {
          msg.className = "form-msg";
          msg.textContent = "";
        }
        bookingForm.reset();
        CustomerDashboard.show(Auth.current());
      }, 1000);
    });
  }

  // --- Sidebar backdrop close ---
  const backdrop = document.getElementById("sidebar-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => Dashboard.toggleSidebar());
  }
});