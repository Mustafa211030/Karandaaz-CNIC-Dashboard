const{fetchAsset,fetchAll}=require('../lib/kobo'),{transform}=require('../lib/transform'),{ok}=require('../lib/auth');
let cache={t:0,v:null,p:null},asset={t:0,v:null};
async function build(){
 if(!asset.v||Date.now()-asset.t>600000)asset={t:Date.now(),v:await fetchAsset()};
 const s=await fetchAll(),v=transform(s,asset.v);
 v.meta={koboTotal:s.total,subs:v.subs,skipped:v.skipped,latest:v.latest,fetched:v.fetched};
 return v}
module.exports=async(req,res)=>{
 if(!ok(req))return res.status(401).json({error:'passcode required'});
 try{
  if(!cache.v||Date.now()-cache.t>10000){cache.p=cache.p||build().finally(()=>{cache.p=null});cache.v=await cache.p;cache.t=Date.now()}
  res.setHeader('Cache-Control','no-store, max-age=0');res.setHeader('CDN-Cache-Control','no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');
  res.status(200).json(cache.v);
 }catch(e){res.status(502).json({error:e.message})}
};