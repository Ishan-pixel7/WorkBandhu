const Dashboard = {
    user:null,
    start(){
        this.user = Auth.check();
        if(!this.user){
            return;
        }
        if(this.user.role==="worker"){
            WorkerDashboard.show(this.user);
        }
        else{
            CustomerDashboard.show(this.user);
        }
    },
    money(amount){
        return "रु " + amount;
    },
    date(date){
        return new Date(date)
        .toLocaleDateString();
    }
};
document.addEventListener(
"DOMContentLoaded",
()=>{
    Dashboard.start();
});
const CustomerDashboard = {
show(user){
let bookings =
Booking.getUserJobs(user.id);
let root =
document.getElementById("dash-root");
root.innerHTML = `
<div class="dashboard-head">
<h1>
Hello ${user.name}
</h1>
<p>
Manage your worker bookings
</p>
</div>
<div class="stats">
<div>
<h2>${bookings.length}</h2>
<p>Bookings</p>
</div>
<div>
<h2>
${this.count(bookings,"pending")}
</h2>
<p>Pending</p>
</div>
<div>
<h2>
${this.count(bookings,"completed")}
</h2>
<p>Completed</p>
</div>
</div>
<section class="jobs">
<h2>
Your Requests
</h2>
${this.list(bookings)}
</section>
`;
},
count(list,status){
return list.filter(
job=>job.status===status
).length;
},
list(bookings){
if(!bookings.length){
return `
<div class="empty">
No bookings yet
</div>
`;
}
return bookings.map(job=>{
return `
<div class="job-card">
<div>
<h3>
${job.service}
</h3>
<p>
${job.date}
</p>
</div>
<span class="
status ${job.status}
">
${job.status}
</span>
</div>
`;
}).join("");
}
};
const WorkerDashboard = {
show(user){
let jobs =
Booking.getUserJobs(user.id);
let root =
document.getElementById(
"dash-root"
);
root.innerHTML = `
<h1>
Welcome ${user.name}
</h1>
<div class="stats">
<div>
<h2>
${jobs.length}
</h2>
<p>
Jobs
</p>
</div>
<div>
<h2>
${user.jobsDone || 0}
</h2>
<p>
Completed
</p>
</div>
<div>
<h2>
${user.rating || "New"}
</h2>
<p>
Rating
</p>
</div>
</div>
<h2>
Requests
</h2>
${this.jobs(jobs)}
`;
},
jobs(list){
if(!list.length){
return `
<div class="empty">
No requests
</div>
`;
}
return list.map(job=>{
return `
<div class="job-card">
<h3>
${job.service}
</h3>
<p>
${job.date}
</p>
<button 
class="btn"
onclick="
WorkerDashboard.accept('${job.id}')
">
Accept
</button>
</div>
`;
}).join("");
},
accept(id){
let jobs =
DB.get("wb_bookings");
let job =
jobs.find(
x=>x.id===id
);
if(job){
job.status="accepted";
}
DB.save(
"wb_bookings",
jobs
);
this.show(
Auth.current()
);
}
};