const first=x=>String(Array.isArray(x)?x[0]:x==null?'':x).replace(/\s+/g,' ').trim();
const last=k=>k.split('/').pop().toLowerCase();
// [label prefixes to look up in the form definition, fallback field names]
const SPEC={cluster:[['treatment cluster'],['treatment_cluster','cl_cluster','cluster']],province:[['province'],['province']],district:[['district'],['district']],area:[[],['cl_area']],res:[[],['r_result']],note:[[],['cnic_review_note']],cnic:[['cnic number of'],['cnic_number','cnic']],no:[[],['resp_no']],lat:[[],['resp_lat']],lon:[[],['resp_lon']],front:[['front side'],['front_side','cnic_front']],back:[['back side'],['back_side','cnic_back']],n:[[],['cl_n_resp']],clat:[[],['cl_cluster_lat']],clon:[[],['cl_cluster_lon']]};
function resolver(asset){
 const c=(asset&&asset.content)||{},sv=c.survey||[],ch=c.choices||[],ov=JSON.parse(process.env.FIELD_MAP||'{}'),q={},cand={};
 sv.forEach(x=>{if(x.name)q[x.name.toLowerCase()]=x});
 for(const k in SPEC){const[ls,ns]=SPEC[k];cand[k]=[...[].concat(ov[k]||[]),...ls.flatMap(l=>sv.filter(x=>x.name&&first(x.label).toLowerCase().startsWith(l)).map(x=>x.name)),...ns].map(s=>s.toLowerCase())}
 const lbl=(n,v)=>{const x=q[n];if(!x)return v;const ln=x.select_from_list_name||String(x.type||'').split(' ')[1],h=ch.find(o=>o.list_name===ln&&String(o.name)===String(v));return h?first(h.label):v};
 return{cand,get:(f,k)=>{for(const n of cand[k])if(f[n]!=null&&f[n]!=='')return lbl(n,f[n]);return null}}}
function transform(subs,asset){
 let skipped=0,latest='';const{get}=resolver(asset),cls={},recs=[],P=v=>v==null||v===''?null:+v;
 for(const s of subs){
  const top={};let items=[];
  for(const k in s){const v=s[k];if(Array.isArray(v)){if(v.length&&v[0]&&typeof v[0]==='object'&&Object.keys(v[0]).some(x=>last(x)==='r_result'))items=v}else if(v!==null&&typeof v!=='object')top[last(k)]=v}
  const t=String(s._submission_time||'').replace(' ','T').slice(0,19);
  items.forEach((it,j)=>{const f={...top};for(const k in it)if(it[k]!=null)f[last(k)]=it[k];
   const cl=get(f,'cluster');if(!cl||!t){skipped++;return}if(t>latest)latest=t;
   if(!cls[cl])cls[cl]=[get(f,'province')||'Unknown',get(f,'district')||'Unknown',get(f,'area')||'',+get(f,'n')||35,P(get(f,'clat')),P(get(f,'clon'))];
   recs.push([cl,String(get(f,'res')||'other'),get(f,'note')||'',String(get(f,'cnic')||''),get(f,'no')||j+1,t,P(get(f,'lat')),P(get(f,'lon')),(get(f,'front')?1:0)+(get(f,'back')?2:0)])});
 }
 return{recs,cls,skipped,subs:subs.length,latest,fetched:new Date().toISOString()}}
module.exports={transform,resolver,SPEC,last,first};