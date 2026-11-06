const{fetchAsset,fetchAll}=require('../lib/kobo'),{transform}=require('../lib/transform'),{ok}=require('../lib/auth');
let cache={t:0,v:null};
module.exports=async(req,res)=>{
 if(!ok(req))return res.status(401).json({error:'passcode required'});
 try{
  if(!cache.v||Date.now()-cache.t>30000){const[a,s]=await Promise.all([fetchAsset(),fetchAll()]);cache={t:Date.now(),v:transform(s,a)}}
  res.setHeader('Cache-Control','private, no-store');res.status(200).json(cache.v);
 }catch(e){res.status(502).json({error:e.message})}
};
