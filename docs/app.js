const API_BASE = "https://jobtracker-api-dr9h.onrender.com/";

const rows = document.getElementById("rows");
const state = document.getElementById("state");
const form = document.getElementById("create-form");
const search = document.getElementById("search");
const statusFilter = document.getElementById("status-filter");
const refreshBtn = document.getElementById("btn-refresh");

let items = [];

function normalizeUrl(v){
  if(!v) return null;
  v=v.trim();
  if(!v) return null;
  if(!/^https?:\/\//i.test(v)) return "https://"+v;
  return v;
}

async function api(path,options={}){
  const res=await fetch(API_BASE+path,{
    headers:{'Content-Type':'application/json'},
    ...options
  });
  if(!res.ok) throw new Error(await res.text());
  if(res.status===204) return null;
  return res.json();
}

async function load(){
  state.textContent="Loading...";
  items=await api("/api/applications");
  render();
  state.textContent="";
}

function render(){
  const q=search.value.toLowerCase();
  const st=statusFilter.value;

  const filtered=items.filter(x=>{
    if(st && x.status!==st) return false;
    if(!q) return true;
    return x.company.toLowerCase().includes(q)
      || x.position.toLowerCase().includes(q);
  });

  rows.innerHTML=filtered.map(x=>`
    <tr>
      <td>${x.company}</td>
      <td>${x.position}</td>
      <td>${x.status}</td>
      <td>${x.appliedOn ? x.appliedOn.substring(0,10) : ""}</td>
      <td>
        <button class="btn danger" onclick="del(${x.id})">
            Delete
        </button>
      </td>
    </tr>
  `).join("");
}

form.addEventListener("submit",async e=>{
  e.preventDefault();

  const fd=new FormData(form);

  const dto={
    company:fd.get("company"),
    position:fd.get("position"),
    status:fd.get("status"),
    link:normalizeUrl(fd.get("link")),
    notes:fd.get("notes")||null
  };

  const date=fd.get("appliedOn");
  if(date) dto.appliedOn=new Date(date+"T00:00:00").toISOString();

  const created=await api("/api/applications",{
    method:"POST",
    body:JSON.stringify(dto)
  });

  items.unshift(created);
  form.reset();
  render();
});

async function del(id){
  await api("/api/applications/"+id,{method:"DELETE"});
  items=items.filter(x=>x.id!==id);
  render();
}

search.addEventListener("input",render);
statusFilter.addEventListener("change",render);
refreshBtn.addEventListener("click",load);

load();