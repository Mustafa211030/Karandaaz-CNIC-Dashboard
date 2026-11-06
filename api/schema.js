// Debug helper: shows the form's field names and which ones the dashboard will try. Returns no submission values.
const{fetchAsset,fetchAll}=require('../lib/kobo'),{resolver,first,last}=require('../lib/transform'),{ok}=require('../lib/auth');
module.exports=async(req,res)=>{
 if(!ok(req))return res.status(401).json({error:'passcode required'});
 try{
  const a=await fetchAsset(),s=await fetchAll(true),keys=new Set();
  (s[0]?Object.keys(s[0]):[]).forEach(k=>{keys.add(last(k));if(Array.isArray(s[0][k])&&s[0][k][0]&&typeof s[0][k][0]==='object')Object.keys(s[0][k][0]).forEach(x=>keys.add(last(x)))});
  res.status(200).json({fieldsTheDashboardWillTry:resolver(a).cand,keysFoundInFirstSubmission:[...keys],form:((a.content&&a.content.survey)||[]).slice(0,400).map(q=>[q.name,q.type,first(q.label).slice(0,50)])});
 }catch(e){res.status(502).json({error:e.message})}
};
