exports.ok=req=>{const p=process.env.DASHBOARD_PASSCODE;return !p||req.headers['x-passcode']===p||(req.query&&req.query.p===p)};
