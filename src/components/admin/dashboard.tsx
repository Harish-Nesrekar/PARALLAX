
"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, Check, ChevronDown, CircleDot, Clock3, Inbox, LogOut, Search, Settings, ShieldCheck, Users } from "lucide-react";
import { EnquiryDrawer } from "@/components/admin/enquiry-drawer";
type Enquiry = { id:string; name:string; email:string; company:string|null; project_type:string; budget:string|null; timeline:string|null; message:string; status:string; source:string; created_at:string; updated_at:string };
type Stats = { total:number; new:number; active:number; converted:number };
const statuses = ["new","reviewing","contacted","qualified","proposal_sent","converted","closed"];
const label = (s:string) => ({new:"New",reviewing:"Reviewing",contacted:"Contacted",qualified:"Qualified",proposal_sent:"Proposal sent",converted:"Converted",closed:"Closed"}[s] || s);
export function AdminDashboard({ email }: { email:string }) {
 const [items,setItems]=useState<Enquiry[]>([]); const [stats,setStats]=useState<Stats>({total:0,new:0,active:0,converted:0}); const [query,setQuery]=useState(""); const [filter,setFilter]=useState("all"); const [selected,setSelected]=useState<Enquiry|null>(null); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
 const load=useCallback(async()=>{setLoading(true);setError("");try{const params=new URLSearchParams({status:filter,q:query});const r=await fetch(`/api/admin/enquiries?${params}`,{cache:"no-store"});const d=await r.json();if(!r.ok)throw new Error(d.message||"Unable to load enquiries");setItems(d.enquiries);setStats(d.stats);}catch(e){setError(e instanceof Error?e.message:"Unable to load enquiries");}finally{setLoading(false);}},[filter,query]);
 useEffect(()=>{const timer=setTimeout(()=>{void load();},180);return()=>clearTimeout(timer);},[load]);
 const selectedCurrent=useMemo(() => (selected ? items.find((x) => x.id === selected.id) ?? selected : null), [selected, items]);
 function applyStatus(id:string,status:string){setItems(cur=>cur.map(x=>x.id===id?{...x,status}:x));void load();}
 async function logout(){
   if (!window.confirm("Sign out of the PARALLAX admin workspace?")) return;
   try {
     const response = await fetch("/api/admin/logout", { method:"POST" });
     if (!response.ok) throw new Error("Unable to end your session. Please try again.");
     window.location.assign("/admin/login");
   } catch (reason) {
     setError(reason instanceof Error ? reason.message : "Logout failed.");
   }
 }
 return <main className="admin-shell"><aside className="admin-sidebar"><Link href="/" className="admin-brand">PARALLAX<span>.</span></Link><p className="admin-side-label">WORKSPACE</p><Link className="admin-side-link active" href="/admin"><Inbox size={17}/> Enquiries</Link><Link className="admin-side-link" href="/admin/settings"><Settings size={17}/> Settings</Link><div className="admin-sidebar-bottom"><div className="admin-secure"><ShieldCheck size={17}/><span>Private admin area<br/><small>Secure session active</small></span></div><div className="admin-profile"><div className="admin-avatar">{email.slice(0,1).toUpperCase()}</div><div><strong>{email}</strong><small>Administrator</small></div><button onClick={logout} aria-label="Sign out" title="Sign out"><LogOut size={17}/></button></div></div></aside><section className="admin-main"><header className="admin-topbar"><div><p className="admin-kicker">PARALLAX / OPERATIONS</p><h1>Enquiries <em>& leads</em></h1></div><div className="admin-top-actions"><span className="admin-live"><i/> Workspace live</span><button className="admin-refresh" onClick={()=>void load()}><Activity size={16}/> Refresh</button></div></header><div className="admin-content"><div className="admin-welcome"><div><h2>Your business, <em>in focus.</em></h2><p>Review incoming opportunities and keep every conversation moving.</p></div><div className="admin-date"><Clock3 size={15}/> {new Date().toLocaleDateString("en",{weekday:"short",month:"short",day:"numeric",year:"numeric"})}</div></div><div className="admin-stats"><article><span>Total enquiries</span><strong>{stats.total}</strong><small><Inbox size={14}/> All submissions</small></article><article><span>New enquiries</span><strong>{stats.new}</strong><small><CircleDot size={14}/> Awaiting review</small></article><article><span>Active pipeline</span><strong>{stats.active}</strong><small><Activity size={14}/> In progress</small></article><article><span>Converted</span><strong>{stats.converted}</strong><small><Check size={14}/> Won opportunities</small></article></div><section className="admin-table-card"><div className="admin-table-heading"><div><p className="admin-kicker">CUSTOMER PIPELINE</p><h2>All enquiries</h2></div><span className="admin-count">{items.length} shown</span></div><div className="admin-toolbar"><label className="admin-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, email or company"/></label><label className="admin-filter"><span>Status</span><select value={filter} onChange={e=>setFilter(e.target.value)}>{["all",...statuses].map(s=><option key={s} value={s}>{s==="all"?"All statuses":label(s)}</option>)}</select><ChevronDown size={15}/></label></div>{error&&<p className="admin-error admin-error-inline">{error}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>CONTACT</th><th>PROJECT</th><th>DATE</th><th>STATUS</th><th/></tr></thead><tbody>{loading?<tr><td colSpan={5} className="admin-empty"><span className="admin-loading-cell"><span className="liquid-loader liquid-loader-sm" role="status" aria-label="Loading enquiries"><span className="liquid-loader-wave" /><span className="liquid-loader-shine" /></span> Loading enquiries…</span></td></tr>:items.length===0?<tr><td colSpan={5} className="admin-empty"><Users size={24}/><strong>No enquiries found</strong>
<span>New website submissions will appear here.</span></td></tr>:items.map(item=>
<tr key={item.id} onClick={()=>setSelected(item)}>
<td>
<strong>{item.name}</strong>
<span>{item.email}{item.company?` · ${item.company}`:""}</span>
</td>
<td>
<strong>{item.project_type}</strong>
<span>{item.budget||"Budget not specified"}</span>
</td>
<td>
{new Date(item.created_at).toLocaleDateString()}
</td>
<td>
<span className={`admin-status status-${item.status}`}>{label(item.status)}</span>
</td>
<td>
<button className="admin-open" aria-label={`View ${item.name}`}>

<ArrowUpRight size={17}/>

</button>
</td>
</tr>)}
</tbody>
</table>
</div>
</section>
<footer className="admin-footer">
<span>PARALLAX OPERATIONS</span>
<span>Enquiry data is private to your administrator account.</span>
</footer>
</div>
</section>
{selectedCurrent&&<EnquiryDrawer enquiry={selectedCurrent} onClose={()=>setSelected(null)} onStatusChanged={applyStatus}/>}
</main>;
}
