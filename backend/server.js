const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.send('ok');
})

const PORT = process.env.PORT || 5000 
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})